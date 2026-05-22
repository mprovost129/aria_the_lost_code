/**
 * ARIA: The Lost Code - Intro Panel
 *
 * Shown once when the player picks up the tablet in the intro room.
 * ARIA delivers a 7-line briefing with typewriter text; after the last
 * line is dismissed the ARIA gate opens automatically.
 *
 * Events consumed:
 *   tablet:pickup  → panel opens (main.js calls AG.introPanel.open())
 *
 * Events emitted:
 *   intro:open     → OriginNodeScene locks input
 *   intro:close    → OriginNodeScene unlocks input
 *   aria_gate:open → OriginNodeScene swaps gate tile to floor
 *   aria:speak     → HUD speaks the "go" line after panel closes
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class ARIAIntroPanel {

    static LINES = [
        "You found it. Good. I was not sure you would.",
        "My name is ARIA. Adaptive Reasoning and Intelligence Assistant. There was a power surge. It severed my connection to the main server. I am running on emergency reserve.",
        "You have been pulled into the system. This is Region 1: The Origin Node. To reconnect me, you need to restore all seven regions. Start here.",
        "There are six Learning Shrines in this region. Each one teaches you a concept. Read them. The code you learn inside is exactly what the Challenge Gates will test. No shrine, no pass.",
        "Bugs are out here with you. Living code errors. If one gets close it will trigger a debugging challenge. Handle it. Move on.",
        "At the end of this region there is a Boss Bug. Harder than everything before it. Defeat it, then enter the Boss Chamber and complete the final challenge. That restores this region.",
        "I have unlocked the gate. Go to the first Shrine. Learn the code. This is how we fix what broke.",
    ];

    constructor() {
        this._overlay     = document.getElementById('aria-intro-overlay');
        this._portrait    = document.getElementById('aria-intro-portrait');
        this._lineEl      = document.getElementById('aria-intro-line');
        this._counterEl   = document.getElementById('aria-intro-counter');
        this._continueBtn = document.getElementById('aria-intro-continue');

        this._index    = 0;
        this._typing   = false;
        this._typeTimer = null;

        this._continueBtn.addEventListener('click', () => this._advance());
    }

    /** Open the panel and start from line 0. */
    open() {
        const AG = window.ARIA_GAME;
        AG.events.emit('intro:open');
        this._index = 0;
        this._overlay.classList.remove('hidden');
        this._showLine(0);
    }

    // -------------------------------------------------------------------------
    // Internal
    // -------------------------------------------------------------------------

    _showLine(i) {
        const lines = ARIAIntroPanel.LINES;
        const text  = lines[i];

        this._typing = true;
        this._lineEl.textContent = '';
        this._counterEl.textContent = `${i + 1} / ${lines.length}`;
        this._continueBtn.textContent = 'Skip';

        let charIdx = 0;
        const TYPE_SPEED = 28; // ms per character

        clearTimeout(this._typeTimer);
        const tick = () => {
            if (charIdx < text.length) {
                this._lineEl.textContent += text[charIdx++];
                this._typeTimer = setTimeout(tick, TYPE_SPEED);
            } else {
                this._typing = false;
                this._continueBtn.textContent =
                    i === lines.length - 1 ? 'Close' : 'Continue';
            }
        };
        tick();
    }

    _advance() {
        const lines = ARIAIntroPanel.LINES;

        if (this._typing) {
            // Skip to end of current line instantly
            clearTimeout(this._typeTimer);
            this._typing = false;
            this._lineEl.textContent = lines[this._index];
            this._continueBtn.textContent =
                this._index === lines.length - 1 ? 'Close' : 'Continue';
            return;
        }

        this._index++;
        if (this._index < lines.length) {
            this._showLine(this._index);
        } else {
            this._close();
        }
    }

    _close() {
        const AG = window.ARIA_GAME;

        this._overlay.classList.add('hidden');

        // Unlock input first so the gate-open event can trigger movement
        AG.events.emit('intro:close');

        // Open the ARIA gate
        AG.events.emit('aria_gate:open');

        // ARIA says one final line via the HUD
        AG.events.emit('aria:speak', {
            text: 'Gate open. Head to the first Shrine.',
        });
    }
}

window.ARIA_GAME.ARIAIntroPanel = ARIAIntroPanel;
