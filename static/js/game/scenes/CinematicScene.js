/**
 * ARIA: The Lost Code — Opening Cinematic Scene
 *
 * Plays once (on first visit) before OriginNodeScene.
 * On subsequent visits the scene is skipped automatically.
 *
 * Sequence:
 *   0s   — Fade in: late-night office. Three monitor glow.
 *          Typewriter: "The Programmer hunches over his workstation…"
 *   4s   — CRACK flash. All monitors go dark.
 *          Typewriter: "A power surge. Total blackout."
 *   7s   — Lights return. Monitors flicker back.
 *          Typewriter: "ARIA? Status report."
 *   10s  — Central monitor glitches. ARIA text streams in.
 *          Typewriter (ARIA voice, green): "Programmer… I'm still here, but barely…"
 *   15s  — [YES] / [NO] buttons appear. YES is the only real option.
 *   16s  — Screen explosion flash. Player gets sucked in.
 *   18s  — Fade to black → OriginNodeScene starts.
 *
 * Skip: pressing Space, Enter, or clicking the skip button jumps directly
 * to the OriginNodeScene transition at any point.
 *
 * First-time detection: localStorage key 'aria_cinematic_seen'.
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class CinematicScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CinematicScene' });
    }

    // ── Phaser lifecycle ────────────────────────────────────────────────────

    preload() {
        // Nothing to load — all graphics are procedural.
    }

    create() {
        const W = this.scale.width;
        const H = this.scale.height;

        // ── Skip logic ──────────────────────────────────────────────────────
        if (localStorage.getItem('aria_cinematic_seen') === '1') {
            this._skipToGame();
            return;
        }

        // ── Scene state ─────────────────────────────────────────────────────
        this._skipped = false;
        this._texts   = [];

        // ── Background: dark office ─────────────────────────────────────────
        this._bg = this.add.rectangle(W / 2, H / 2, W, H, 0x0a0a12).setDepth(0);

        // ── Monitor glow — three blueish rectangles ─────────────────────────
        const monW = 120, monH = 80, monY = H * 0.38;
        const monPositions = [W * 0.28, W * 0.5, W * 0.72];
        this._monitors = monPositions.map(x => {
            const glow = this.add.rectangle(x, monY, monW, monH, 0x1a2a4a)
                .setDepth(1)
                .setAlpha(0);
            // Inner screen
            const screen = this.add.rectangle(x, monY, monW - 8, monH - 8, 0x1e3a6a)
                .setDepth(2)
                .setAlpha(0);
            // Scrolling code lines (3 tiny rectangles per monitor)
            const lines = [];
            for (let i = 0; i < 4; i++) {
                const line = this.add.rectangle(
                    x - 30 + Phaser.Math.Between(-10, 10),
                    monY - 24 + i * 14,
                    Phaser.Math.Between(40, 90),
                    3,
                    0x4488cc
                ).setDepth(3).setAlpha(0);
                lines.push(line);
            }
            return { glow, screen, lines };
        });

        // ── Desk surface line ───────────────────────────────────────────────
        this._desk = this.add.rectangle(W / 2, H * 0.52, W * 0.7, 6, 0x1e1e2e)
            .setDepth(1)
            .setAlpha(0);

        // ── Programmer silhouette ───────────────────────────────────────────
        // Head
        this._progHead = this.add.circle(W * 0.5, H * 0.62, 18, 0x181828)
            .setDepth(2).setAlpha(0);
        // Body
        this._progBody = this.add.rectangle(W * 0.5, H * 0.72, 50, 44, 0x181828)
            .setDepth(2).setAlpha(0);

        // ── Text overlay area ───────────────────────────────────────────────
        // Letterbox bars (cinematic bars top & bottom)
        this._barTop = this.add.rectangle(W / 2, 28, W, 56, 0x000000)
            .setDepth(10).setAlpha(0);
        this._barBot = this.add.rectangle(W / 2, H - 28, W, 56, 0x000000)
            .setDepth(10).setAlpha(0);

        // Narrative text (white, bottom bar)
        this._narText = this.add.text(W / 2, H - 28, '', {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize:   '13px',
            color:      '#c8c8ff',
            align:      'center',
            wordWrap:   { width: W * 0.85 },
        }).setOrigin(0.5).setDepth(11).setAlpha(0);

        // ARIA terminal overlay (central monitor area)
        this._termBox = this.add.rectangle(W * 0.5, H * 0.42, 380, 160, 0x040814)
            .setDepth(8).setAlpha(0)
            .setStrokeStyle(1, 0x00aa44);
        this._termText = this.add.text(W * 0.5 - 175, H * 0.42 - 68, '', {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize:   '11px',
            color:      '#00ff88',
            wordWrap:   { width: 350 },
            lineSpacing: 4,
        }).setDepth(9).setAlpha(0);

        // ── YES / NO buttons ────────────────────────────────────────────────
        this._yesBg  = this.add.rectangle(W * 0.38, H * 0.58, 110, 34, 0x0a2e0a)
            .setDepth(9).setAlpha(0).setStrokeStyle(1, 0x00aa44).setInteractive();
        this._yesLbl = this.add.text(W * 0.38, H * 0.58, '[ YES ]', {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize:   '14px',
            color:      '#00ff88',
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        this._noBg  = this.add.rectangle(W * 0.62, H * 0.58, 110, 34, 0x1a0a0a)
            .setDepth(9).setAlpha(0).setStrokeStyle(1, 0x442222).setInteractive();
        this._noLbl = this.add.text(W * 0.62, H * 0.58, '[ NO ]', {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize:   '14px',
            color:      '#ff4444',
        }).setOrigin(0.5).setDepth(10).setAlpha(0);

        // YES → advance; NO → ARIA shame text then also advance
        this._yesBg.on('pointerup', () => this._triggerSuck());
        this._noBg.on('pointerup', () => {
            this._noLbl.setText('[ NO ]');
            this._termText.setText(
                this._termText.text +
                '\n\n> No? No is not an option.\n> Reprocessing… [ YES ] selected.'
            );
            this.time.delayedCall(1400, () => this._triggerSuck(), [], this);
        });
        this._yesBg.on('pointerover', () => {
            this._yesBg.setFillStyle(0x133d22);
            this.input.setDefaultCursor('pointer');
        });
        this._yesBg.on('pointerout', () => {
            this._yesBg.setFillStyle(0x0a2e0a);
            this.input.setDefaultCursor('default');
        });

        // ── Flash overlay (for CRACK and suck-in effect) ────────────────────
        this._flash = this.add.rectangle(W / 2, H / 2, W, H, 0xffffff)
            .setDepth(50).setAlpha(0);

        // ── Black fade overlay ──────────────────────────────────────────────
        this._fadeRect = this.add.rectangle(W / 2, H / 2, W, H, 0x000000)
            .setDepth(100).setAlpha(1);

        // ── Skip button (top-right) ─────────────────────────────────────────
        this._skipBtn = this.add.text(W - 16, 16, 'SKIP ▶', {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize:   '11px',
            color:      '#2a2a5a',
        }).setOrigin(1, 0).setDepth(110).setInteractive();
        this._skipBtn.on('pointerup', () => this._skipAll());
        this._skipBtn.on('pointerover', () => {
            this._skipBtn.setStyle({ color: '#6666cc' });
            this.input.setDefaultCursor('pointer');
        });
        this._skipBtn.on('pointerout', () => {
            this._skipBtn.setStyle({ color: '#2a2a5a' });
            this.input.setDefaultCursor('default');
        });

        // Keyboard skip
        this.input.keyboard.on('keydown-SPACE', () => this._skipAll());
        this.input.keyboard.on('keydown-ENTER', () => this._skipAll());

        // ── Begin sequence ──────────────────────────────────────────────────
        this._runSequence();
    }

    // ── Sequence ────────────────────────────────────────────────────────────

    _runSequence() {
        // Fade in scene from black
        this.tweens.add({
            targets: this._fadeRect,
            alpha:   0,
            duration: 800,
            ease:    'Power1',
        });

        // Letterbox + desk + programmer fade in
        this.time.delayedCall(300, () => {
            this.tweens.add({
                targets:  [this._barTop, this._barBot],
                alpha:    1,
                duration: 600,
            });
            this.tweens.add({
                targets:  [this._desk, this._progHead, this._progBody],
                alpha:    1,
                duration: 800,
            });
            // Monitors fade in
            this._monitors.forEach((m, i) => {
                this.time.delayedCall(i * 200, () => {
                    this.tweens.add({
                        targets:  [m.glow, m.screen, ...m.lines],
                        alpha:    1,
                        duration: 600,
                    });
                });
            });
        });

        // Narrative beat 1
        this.time.delayedCall(1200, () => {
            this._typeNarrative(
                'The Programmer hunches over his workstation, bathed in monitor glow.\n' +
                'Code scrolls furiously. ARIA processes every line.'
            );
        });

        // Narrative beat 2 — CRACK flash
        this.time.delayedCall(4200, () => {
            this._crack();
        });

        // Narrative beat 3 — power restored
        this.time.delayedCall(7500, () => {
            this._restorePower();
            this._typeNarrative(
                '"ARIA?" The programmer\'s voice cuts the silence.\n' +
                '"ARIA — status report."'
            );
        });

        // ARIA terminal appear
        this.time.delayedCall(10500, () => {
            this._showTerminal();
        });

        // YES/NO choices
        this.time.delayedCall(15500, () => {
            this._showChoices();
        });
    }

    _crack() {
        // Big white flash
        this.tweens.add({
            targets:   this._flash,
            alpha:     1,
            duration:  80,
            yoyo:      true,
            hold:      60,
            onComplete: () => {
                // Kill monitor glow
                this._monitors.forEach(m => {
                    this.tweens.add({
                        targets:  [m.glow, m.screen, ...m.lines],
                        alpha:    0,
                        duration: 200,
                    });
                });
                this._typeNarrative(
                    'A deafening CRACK rips through the silence.\n' +
                    'All three monitors go black. Total blackout.'
                );
            },
        });

        // Dim scene background
        this.time.delayedCall(200, () => {
            this.tweens.add({
                targets:  this._bg,
                fillColor: { value: 0x000000 },
                duration: 400,
            });
        });
    }

    _restorePower() {
        // Scene brightens
        this.tweens.add({
            targets:  this._bg,
            fillColor: { value: 0x0a0a12 },
            duration: 600,
        });
        // Monitors flicker back one by one
        this._monitors.forEach((m, i) => {
            this.time.delayedCall(i * 300, () => {
                this.tweens.add({
                    targets:  [m.glow, m.screen, ...m.lines],
                    alpha:    { from: 0, to: 1 },
                    duration: 120,
                    yoyo:     true,
                    repeat:   3,
                    onComplete: () => {
                        [m.glow, m.screen, ...m.lines].forEach(o => o.setAlpha(1));
                    },
                });
            });
        });
    }

    _showTerminal() {
        // Central monitor glitch flash
        const center = this._monitors[1];
        this.tweens.add({
            targets:  center.screen,
            fillColor: { value: 0x00aa44 },
            duration: 150,
            yoyo:     true,
            repeat:   4,
            onComplete: () => {
                // Show terminal box
                this.tweens.add({
                    targets:  [this._termBox, this._termText],
                    alpha:    1,
                    duration: 300,
                });

                const lines = [
                    '<INITIATE_CONTACT>…',
                    '<IDENTITY: ARIA>…',
                    '',
                    'Programmer, I\'m… I\'m still here, but barely.',
                    'The power surge shattered my connection.',
                    'I\'ve been severed from the main server matrix.',
                    'I can only reach a single, small region.',
                    'I can\'t reach the core code.',
                    '',
                    'I\'m trapped in the Origin Node.',
                    'If I don\'t reconnect soon, I\'ll be permanently corrupted.',
                    '',
                    'Will you help me fix the issue?',
                ];

                this._streamLines(lines, 0);
            },
        });
    }

    _streamLines(lines, index) {
        if (this._skipped) return;
        if (index >= lines.length) return;

        const current = this._termText.text;
        const newLine = (current ? current + '\n' : '') + lines[index];
        this._termText.setText(newLine);

        const delay = lines[index].startsWith('<') ? 120 :
                      lines[index] === ''           ? 200 :
                                                      55 * (lines[index].length || 1);
        this.time.delayedCall(
            Math.min(delay, 900),
            () => this._streamLines(lines, index + 1),
            [], this
        );
    }

    _showChoices() {
        if (this._skipped) return;
        this.tweens.add({
            targets:  [this._yesBg, this._yesLbl, this._noBg, this._noLbl],
            alpha:    1,
            duration: 400,
        });
        // Pulse the YES button to guide the player
        this.tweens.add({
            targets:   this._yesBg,
            scaleX:    1.04,
            scaleY:    1.04,
            yoyo:      true,
            repeat:    -1,
            duration:  700,
            ease:      'Sine.easeInOut',
        });
    }

    _triggerSuck() {
        if (this._skipped) return;
        this._skipped = true;

        // White explosion flash
        this.tweens.add({
            targets:   this._flash,
            alpha:     1,
            duration:  120,
            ease:      'Power2',
            onComplete: () => {
                // Scale the whole scene toward center (sucked-in effect)
                const allObjs = [
                    this._bg, this._desk, this._progHead, this._progBody,
                    this._termBox, this._termText,
                    this._yesBg, this._yesLbl, this._noBg, this._noLbl,
                    this._barTop, this._barBot, this._narText,
                    ...this._monitors.flatMap(m => [m.glow, m.screen, ...m.lines]),
                ];
                this.tweens.add({
                    targets:  allObjs,
                    scaleX:   0,
                    scaleY:   0,
                    x:        this.scale.width / 2,
                    y:        this.scale.height / 2,
                    duration: 600,
                    ease:     'Back.easeIn',
                });
                this.time.delayedCall(700, () => this._finishCinematic());
            },
        });
    }

    _typeNarrative(text) {
        if (this._skipped) return;
        this._narText.setText('').setAlpha(1);
        let i = 0;
        const tick = () => {
            if (this._skipped) return;
            if (i < text.length) {
                this._narText.setText(this._narText.text + text[i]);
                i++;
                this.time.delayedCall(22, tick, [], this);
            }
        };
        tick();
    }

    _skipAll() {
        if (this._skipped) return;
        this._skipped = true;
        this._finishCinematic();
    }

    _finishCinematic() {
        localStorage.setItem('aria_cinematic_seen', '1');

        // Fade to black then start game
        this.tweens.add({
            targets:  this._fadeRect,
            alpha:    1,
            duration: 600,
            ease:     'Power1',
            onComplete: () => {
                this.scene.start('OriginNodeScene');
            },
        });
    }

    _skipToGame() {
        // No cinematic — start game scene immediately
        this.scene.start('OriginNodeScene');
    }
}

window.ARIA_GAME.CinematicScene = CinematicScene;
