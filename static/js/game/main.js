/**
 * ARIA: The Lost Code - Phaser Game Bootstrap + HUD Wiring
 *
 * Loaded last. All other game scripts have already run and attached
 * their exports to window.ARIA_GAME.
 *
 * Responsibilities:
 *   1. Shared event bus
 *   2. Per-gate progress state (which challenges solved, which gates open)
 *   3. Phaser game config and boot
 *   4. HUD element wiring (ARIA bar, Chances display, challenge panel)
 *   5. Routing aria:interact events to the correct challenge
 */

window.ARIA_GAME = window.ARIA_GAME || {};
// AG is declared as `const AG = window.ARIA_GAME` in config.js (loaded first).
// Re-declaring const in the same global scope throws a SyntaxError - use the
// existing reference directly.

// ---------------------------------------------------------------------------
// 1. Event bus
// ---------------------------------------------------------------------------
AG.events = new Phaser.Events.EventEmitter();

// ---------------------------------------------------------------------------
// 2. Dialogue system (Layer 8)
//    Created before Phaser boots so the very first aria:speak from the scene
//    is routed through the typewriter from the opening line onward.
// ---------------------------------------------------------------------------
AG.dialogue = new AG.DialogueSystem(document.getElementById('aria-text'));

// ---------------------------------------------------------------------------
// 3. Gate progress tracking
//    Per gate: { totalChallenges, solved: Set of solved challenge IDs }
//    When solved.size === totalChallenges, the gate opens.
// ---------------------------------------------------------------------------
AG.gateState = {};

Object.entries(AG.GATE_CHALLENGES || {}).forEach(([gateKey, challengeIds]) => {
    AG.gateState[gateKey] = {
        total:  challengeIds.length,
        solved: new Set(),
        open:   false,
    };
});

// Boss bug / boss chamber state
AG.bossBugDefeated = false;

// Ejection flag - set when chances drop to 0; cleared on chance:restore
AG.chancesEmpty = false;

// ---------------------------------------------------------------------------
// 3. Phaser boot
// ---------------------------------------------------------------------------
const phaserConfig = {
    type:            Phaser.AUTO,
    width:           800,
    height:          576,
    backgroundColor: '#0d0d1a',
    parent:          'game-container',
    pixelArt:        true,
    // CinematicScene runs first; it either plays the cinematic then
    // transitions to OriginNodeScene, or skips straight to it.
    scene:           [AG.CinematicScene, AG.OriginNodeScene],
    scale: {
        mode:      Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
};

new Phaser.Game(phaserConfig);

// ---------------------------------------------------------------------------
// 4. Initialise Pyodide runner and challenge panel
// ---------------------------------------------------------------------------

// Create and pre-warm the Python runner immediately so it's ready when
// the player first reaches a gate (Pyodide takes a few seconds to load).
AG.pyodideRunner = new AG.PyodideRunner();
AG.pyodideRunner.load().catch(() => {
    console.warn('Pyodide failed to pre-load. Will retry on first submission.');
});

AG.challengePanel = new AG.ChallengePanel();

// ---------------------------------------------------------------------------
// 5. Load persisted player state from the backend (Layer 9)
//    Runs asynchronously - the HUD starts at default 3 and updates when the
//    fetch resolves.  If the player had 0 chances last session, chancesEmpty
//    is set immediately so gate entry is blocked until chances are restored.
// ---------------------------------------------------------------------------
fetch('/api/player-state/')
    .then(r => r.json())
    .then(data => {
        if (typeof data.chances === 'number') {
            updateChancesDisplay(data.chances);
            if (data.chances === 0) AG.chancesEmpty = true;
        }
    })
    .catch(() => { /* keep default 3 */ });

// ---------------------------------------------------------------------------
// 7. Pyodide status indicator in the ARIA bar
// ---------------------------------------------------------------------------
AG.events.on('pyodide:ready', () => {
    const el = document.getElementById('pyodide-status');
    if (el) {
        el.textContent = '🐍 ready';
        el.classList.add('ready');
        // Fade it out after 3 s - no need to keep it visible once loaded
        setTimeout(() => { el.style.opacity = '0'; }, 3000);
    }
});

// ---------------------------------------------------------------------------
// 8. HUD: ARIA dialogue bar
//    All aria:speak events route through the dialogue system (Layer 8).
//    say() interrupts any current speech - game events always take priority.
// ---------------------------------------------------------------------------
AG.events.on('aria:speak', ({ text }) => {
    AG.dialogue.say(text);
});

// ---------------------------------------------------------------------------
// 9. HUD: Chances display + persistence helpers (Layer 9)
// ---------------------------------------------------------------------------
let currentChances = 3;
AG._currentChances = 3;   // exposed for the menu's quit handler

/** Read Django's csrftoken cookie - needed for authenticated AJAX POSTs. */
function _getCsrfToken() {
    const c = document.cookie.split(';').find(s => s.trim().startsWith('csrftoken='));
    return c ? decodeURIComponent(c.trim().split('=')[1]) : '';
}

/**
 * Fire-and-forget POST to persist the current chance count to the database.
 * Failures are non-fatal - the JS counter remains authoritative for the session.
 */
function _syncChances(count) {
    fetch('/api/chances/sync/', {
        method:  'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken':  _getCsrfToken(),
        },
        body: JSON.stringify({ chances: count }),
    }).catch(err => console.warn('[ARIA] Chances sync failed:', err));
}

function updateChancesDisplay(count) {
    currentChances = count;
    AG._currentChances = count;   // keep namespace copy in sync

    // Flicker animation on any dot that just became lost (Layer 9)
    document.querySelectorAll('.chance-dot').forEach((dot, i) => {
        const wasLit  = !dot.classList.contains('lost');
        const nowLost = i >= count;
        if (wasLit && nowLost) {
            dot.classList.add('flicker');
            setTimeout(() => dot.classList.remove('flicker'), 600);
        }
        dot.classList.toggle('lost', nowLost);
    });

    // Keep Tablet's ARIA tab in sync (tablet may not be instantiated yet
    // if chances change before main.js finishes - guard with optional chain).
    AG.tablet?.updateChances(count);
}

AG.events.on('chance:lose', () => {
    if (currentChances > 0) {
        updateChancesDisplay(currentChances - 1);
        _syncChances(currentChances);          // persist the new (decremented) count

        if (currentChances === 0) {
            // Player is out of chances - set ejection flag and auto-close the panel
            AG.chancesEmpty = true;
            AG.events.emit('aria:speak', {
                text: 'That was close. Very close. In the wrong direction. Go review your library and try again.',
            });
            // Give the player time to read the result, then eject from the challenge
            setTimeout(() => AG.challengePanel.close(), 2200);
        }
    }
});

AG.events.on('chance:restore', () => {
    AG.chancesEmpty = false;
    updateChancesDisplay(3);
    _syncChances(3);
});

// ---------------------------------------------------------------------------
// 7. Routing: aria:interact → correct challenge
// ---------------------------------------------------------------------------
AG.events.on('aria:interact', ({ tileId, col, row }) => {
    const TILE = AG.TILE;

    if (tileId === TILE.GATE) {
        _handleGateInteraction(col, row);

    } else if (tileId === TILE.BOSS_BUG) {
        if (!AG.bossBugDefeated) {
            AG.challengePanel.open(AG.CHALLENGES[AG.BOSS_BUG_CHALLENGE], null);
        }

    } else if (tileId === TILE.BOSS_CHAMBER) {
        if (!AG.bossBugDefeated) {
            AG.events.emit('aria:speak', {
                text: 'The Boss Chamber is sealed. Defeat the Bug guarding the entrance first.',
            });
        } else {
            AG.challengePanel.open(AG.CHALLENGES[AG.BOSS_CHALLENGE], null);
        }

    } else if (tileId === TILE.SHRINE) {
        // Open the Learning Shrine modal for this tile's shrine
        const shrine = _identifyShrine(col, row);
        if (shrine) {
            AG.shrineModal.open(shrine);
        } else {
            AG.events.emit('aria:speak', {
                text: 'A Learning Shrine. Study the concept here before attempting the gates.',
            });
        }
    }
});

function _handleGateInteraction(col, row) {
    const gateKey      = `${col},${row}`;
    const state        = AG.gateState[gateKey];
    const challengeIds = AG.GATE_CHALLENGES[gateKey];

    if (!state || !challengeIds) {
        AG.events.emit('aria:speak', {
            text: 'This gate is not ready yet. Come back soon.',
        });
        return;
    }

    if (state.open) {
        // Gate already open - shouldn't be reachable but guard just in case
        return;
    }

    // Layer 9: block gate entry when chances are depleted
    if (AG.chancesEmpty) {
        AG.events.emit('aria:speak', {
            text: 'No chances remaining. Defeat the Boss Bug to restore them.',
        });
        return;
    }

    // Find the next unsolved challenge for this gate
    const nextId = challengeIds.find(id => !state.solved.has(id));
    if (!nextId) return;   // all solved, gate should already be open

    const challenge = AG.CHALLENGES[nextId];
    if (!challenge) return;

    AG.challengePanel.open(challenge, { col, row });
}

// ---------------------------------------------------------------------------
// 8. challenge:solved → advance gate progress, open gate if complete
// ---------------------------------------------------------------------------
AG.events.on('challenge:solved', ({ challengeId, gatePos }) => {
    if (!gatePos) return;

    const gateKey = `${gatePos.col},${gatePos.row}`;
    const state   = AG.gateState[gateKey];
    if (!state) return;

    state.solved.add(challengeId);

    if (state.solved.size >= state.total) {
        // All challenges for this gate solved → open it
        state.open = true;
        AG.events.emit('gate:open', { col: gatePos.col, row: gatePos.row });
        AG.events.emit('aria:speak', {
            text: 'Gate open. Signal restored on this path. Keep moving.',
        });
    } else {
        // More challenges remain for this gate
        const remaining = state.total - state.solved.size;
        AG.events.emit('aria:speak', {
            text: `Good. ${remaining} more challenge${remaining > 1 ? 's' : ''} on this gate.`,
        });
    }
});

// ---------------------------------------------------------------------------
// 9. Boss Bug defeated
// ---------------------------------------------------------------------------
AG.events.on('boss_bug:solved', () => {
    AG.bossBugDefeated = true;
    AG.events.emit('chance:restore');   // full Chance restoration per Bible
    // Find the boss bug tile position from the map objects
    const bugPos = (AG.MAPS.ORIGIN_NODE_OBJECTS.bossBug || [])[0];
    if (bugPos) {
        AG.events.emit('boss_bug:clear', { col: bugPos.col, row: bugPos.row });
    }
    AG.events.emit('aria:speak', {
        text: 'Bug defeated. Chances restored. The Boss Chamber is open.',
    });
});

// ---------------------------------------------------------------------------
// 10. Boss Challenge complete - trigger ripple wave, then show completion card
// ---------------------------------------------------------------------------
AG.events.on('boss:solved', () => {
    AG.events.emit('aria:speak', {
        text: 'The Origin Node is restored. Signal expanding. Region 2 unlocked. We are just getting started.',
    });

    // Give the challenge panel time to slide closed before the Phaser
    // scene starts its restoration ripple (800 ms matches the panel close
    // animation + a short buffer so the screen is clear first).
    setTimeout(() => {
        AG.events.emit('region:restore');
    }, 800);
});

// region:restored fires from OriginNodeScene after the full ripple wave
// has played out.  Show the completion card.
AG.events.on('region:restored', () => {
    const overlay = document.getElementById('region-complete-overlay');
    const fill    = document.getElementById('rc-signal-fill');
    if (!overlay) return;

    // Fade + scale the card in
    overlay.classList.add('visible');

    // Animate the signal bar to 14% (1/7 regions).
    // Double-rAF ensures the CSS transition fires after the class change
    // that unhides the element - without this the browser skips the tween.
    if (fill) {
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                fill.style.width = '14.3%';
            });
        });
    }
});

// Continue button - dismiss the overlay and speak a closing line
const rcContinueBtn = document.getElementById('rc-continue-btn');
if (rcContinueBtn) {
    rcContinueBtn.addEventListener('click', () => {
        const overlay = document.getElementById('region-complete-overlay');
        if (overlay) overlay.classList.remove('visible');

        // Reset the signal bar so it can re-animate if revisited
        const fill = document.getElementById('rc-signal-fill');
        if (fill) fill.style.width = '0%';

        AG.events.emit('aria:speak', {
            text: 'Region 1 complete. The path forward is open. What waits in Region 2?',
        });
    });
}

// ---------------------------------------------------------------------------
// 11. Shrine modal (Layer 10)
// ---------------------------------------------------------------------------

// Instantiate ShrineModal - DOM must be ready
AG.shrineModal = new AG.ShrineModal();

/**
 * Identify which shrine a given tile belongs to by matching against the
 * cols/rows arrays defined in ARIA_GAME.SHRINES (region1_shrines.js).
 * Returns the shrine data object or null if no match.
 */
function _identifyShrine(col, row) {
    const shrines = AG.SHRINES;
    if (!shrines) return null;
    for (const key of Object.keys(shrines)) {
        const s = shrines[key];
        if (s.cols.includes(col) && s.rows.includes(row)) return s;
    }
    return null;
}

// ---------------------------------------------------------------------------
// 13. Tablet (Layer 7) + ARIA Hint tool (Layer 9)
// ---------------------------------------------------------------------------

// Instantiate Tablet - DOM must be ready (scripts run after body in base.html)
AG.tablet = new AG.Tablet();

// Tablet button in the ARIA bar
const tabletBtn = document.getElementById('tablet-btn');
if (tabletBtn) {
    tabletBtn.addEventListener('click', () => {
        // Block opening while the challenge panel is active
        const challengeOpen = document.getElementById('challenge-overlay')
            ?.classList.contains('open');
        if (challengeOpen) {
            AG.events.emit('aria:speak', {
                text: 'Finish the challenge first. Or close it with Esc.',
            });
            return;
        }
        AG.tablet.open();
    });
}

// Feed active challenge to the Tablet's Challenge tab
AG.events.on('challenge:opened', ({ challenge }) => {
    AG.tablet.setActiveChallenge(challenge);
});

// ARIA Hint tool button (Layer 9) - speaks the active challenge hint aloud
const ariaHintToolBtn = document.getElementById('aria-hint-tool-btn');
if (ariaHintToolBtn) {
    ariaHintToolBtn.addEventListener('click', () => {
        const challenge = AG.tablet?._activeChallenge;
        if (challenge?.hint_text) {
            AG.events.emit('aria:speak', { text: challenge.hint_text });
        } else {
            AG.events.emit('aria:speak', {
                text: 'No active challenge. Approach a gate to begin.',
            });
        }
        AG.tablet.close();
    });
}

// Log every first hint to the Tablet's ARIA tab
AG.events.on('hint:shown', (data) => {
    AG.tablet.addHint(data);
});

// ---------------------------------------------------------------------------
// 14. Proximity dialogue system (Layer 8)
//     OriginNodeScene emits player:moved on every successful step.
//     We run two checks here:
//       a) First movement from spawn → append the first_steps sequence to the
//          queue so it plays after ARIA's opening one-liner finishes.
//       b) Proximity zones → trigger ambient location-based dialogue once each.
// ---------------------------------------------------------------------------
let _firstMoveFired = false;

AG.events.on('player:moved', ({ col, row }) => {
    const D = AG.DIALOGUE;
    if (!D) return;

    // (a) First-move narrative - appended, not interrupting
    if (!_firstMoveFired) {
        _firstMoveFired = true;
        const lines = D.REGION1_EVENTS?.first_steps;
        if (lines) AG.dialogue.append(lines);
    }

    // (b) Proximity zone scan - break on first zone within range so we don't
    //     accidentally fire two triggers on the same step
    const zones = D.REGION1_ZONES || [];
    for (const zone of zones) {
        const dist = Math.abs(col - zone.col) + Math.abs(row - zone.row);
        if (dist <= zone.radius) {
            AG.dialogue.trigger(zone.id, zone.lines);
            break;
        }
    }
});

// ---------------------------------------------------------------------------
// 15. In-game menu - wired in game.html inline script (see extra_js block)
// ---------------------------------------------------------------------------
