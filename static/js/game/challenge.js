/**
 * ARIA: The Lost Code - ChallengePanel
 *
 * Manages the challenge overlay: renders a coding challenge, accepts player
 * input, validates the submission, and emits results to the event bus.
 *
 * Layer 4 validation: keyword-based string matching (temporary).
 * Layer 5 replaces validation with Pyodide code execution.
 *
 * Events emitted:
 *   aria:speak       { text }         - update ARIA dialogue bar
 *   challenge:open                    - tells the scene to disable movement
 *   challenge:close                   - tells the scene to re-enable movement
 *   gate:solved      { col, row }     - tells the scene to open a gate tile
 *   boss_bug:solved                   - tells the scene to clear the boss bug tile
 *   boss:solved                       - triggers region completion flow
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class ChallengePanel {

    constructor() {
        this.overlay       = document.getElementById('challenge-overlay');
        this.titleEl       = document.getElementById('cp-title');
        this.typeEl        = document.getElementById('cp-type-badge');
        this.ariaEl        = document.getElementById('cp-aria-text');
        this.editorEl      = document.getElementById('cp-editor');
        this.resultEl      = document.getElementById('cp-result');
        this.hintBox       = document.getElementById('cp-hint-box');
        this.hintText      = document.getElementById('cp-hint-text');
        this.refEl         = document.getElementById('cp-lesson-ref');
        this.submitBtn     = document.getElementById('cp-submit');
        this.hintBtn       = document.getElementById('cp-hint-btn');
        this.closeBtn      = document.getElementById('cp-close');
        this.outputSection = document.getElementById('cp-output-section');
        this.outputEl      = document.getElementById('cp-output');

        this.expectedHint  = document.getElementById('cp-expected-hint');
        this.expectedValue = document.getElementById('cp-expected-value');
        this.bugfixBanner  = document.getElementById('cp-bugfix-banner');
        this.editorLabel   = document.getElementById('cp-editor-label');

        this.currentChallenge = null;
        this.hintShown        = false;
        this.submitting       = false;

        this._bindEvents();
    }

    // -------------------------------------------------------------------------
    // Public API
    // -------------------------------------------------------------------------

    /**
     * Open the panel with the given challenge.
     * @param {object} challenge - from ARIA_GAME.CHALLENGES
     * @param {object|null} gatePos - { col, row } of the gate this belongs to (or null)
     */
    open(challenge, gatePos = null) {
        const AG = window.ARIA_GAME;

        this.currentChallenge = challenge;
        this.gatePos          = gatePos;
        this.hintShown        = false;

        // Populate the panel
        this.titleEl.textContent  = challenge.title;
        this.typeEl.textContent   = this._typeLabel(challenge.type);
        this.typeEl.className     = `cp-badge cp-badge--${challenge.type}`;
        this.ariaEl.textContent   = `ARIA: "${challenge.aria_intro}"`;
        this.editorEl.value       = challenge.prompt_code;
        this.refEl.textContent    = challenge.lesson_reference || '';
        this.refEl.style.display  = challenge.lesson_reference ? 'block' : 'none';

        // ── Context-aware editor label ───────────────────────────────────
        this._updateEditorLabel(challenge);

        // ── Expected output preview ──────────────────────────────────────
        const hasExpected = challenge.expected_output && challenge.expected_output.trim();
        if (this.expectedHint) {
            if (hasExpected) {
                this.expectedValue.textContent = challenge.expected_output.trim();
                this.expectedHint.style.display = 'block';
            } else {
                this.expectedHint.style.display = 'none';
            }
        }

        // ── Bug-fix banner ───────────────────────────────────────────────
        if (this.bugfixBanner) {
            this.bugfixBanner.style.display =
                challenge.type === 'bug_fix' ? 'block' : 'none';
        }

        // Clear previous result and output
        this._clearResult();
        this._clearOutput();
        this.hintBox.style.display = 'none';

        // Show overlay
        this.overlay.classList.add('open');
        this.editorEl.focus();

        // Pause game movement and notify listeners (Tablet) of the active challenge
        AG.events.emit('challenge:open');
        AG.events.emit('challenge:opened', { challenge });
        AG.events.emit('aria:speak', { text: challenge.aria_intro });
    }

    close() {
        const AG = window.ARIA_GAME;
        this.overlay.classList.remove('open');
        this.currentChallenge = null;

        // Clear the ARIA banner so it doesn't show stale text on next open
        const banner     = document.getElementById('cp-aria-banner');
        const bannerText = document.getElementById('cp-aria-banner-text');
        if (banner && bannerText) {
            bannerText.textContent = '';
            banner.classList.remove('has-text');
        }

        // Resume game movement
        AG.events.emit('challenge:close');
    }

    // -------------------------------------------------------------------------
    // Private
    // -------------------------------------------------------------------------

    _bindEvents() {
        this.submitBtn.addEventListener('click',  () => this._submit());
        this.hintBtn.addEventListener('click',    () => this._showHint());
        this.closeBtn.addEventListener('click',   () => this.close());

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
                this.close();
            }
        });

        this.editorEl.addEventListener('keydown', (e) => {
            // Ctrl+Enter / Cmd+Enter → submit
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this._submit();
                return;
            }
            // Tab → insert 4 spaces (don't move focus)
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = this.editorEl.selectionStart;
                const end   = this.editorEl.selectionEnd;
                const val   = this.editorEl.value;
                this.editorEl.value = val.substring(0, start) + '    ' + val.substring(end);
                this.editorEl.selectionStart = this.editorEl.selectionEnd = start + 4;
            }
        });
    }

    _updateEditorLabel(challenge) {
        if (!this.editorLabel) return;
        if (challenge.type === 'fill_blank') {
            const count = (challenge.prompt_code.match(/___/g) || []).length;
            this.editorLabel.innerHTML =
                `Your Code &mdash; replace each <span class="blank-highlight">___</span> with the correct value` +
                (count > 0
                    ? `<span class="blank-count">(${count} blank${count > 1 ? 's' : ''})</span>`
                    : '') +
                ':';
        } else if (challenge.type === 'bug_fix') {
            this.editorLabel.textContent = 'Your Code - edit below to fix the bug(s):';
        } else if (challenge.type === 'boss') {
            this.editorLabel.textContent = 'Your Solution - write your complete code below:';
        } else {
            this.editorLabel.textContent = 'Your Code:';
        }
    }

    async _submit() {
        if (!this.currentChallenge || this.submitting) return;

        const code    = this.editorEl.value;
        const runner  = window.ARIA_GAME.pyodideRunner;

        // Blank check (instant, before async work)
        if (code.includes('___')) {
            this._showResult('error', '✗ Fill in all the blanks before submitting.');
            return;
        }

        // Show loading state while Pyodide runs
        this.submitting         = true;
        this.submitBtn.disabled = true;

        const wasReady = runner.ready;
        this.submitBtn.textContent = wasReady ? '⏳ Running…' : '⏳ Loading Python…';

        this._clearResult();
        this._clearOutput();

        let result;
        try {
            result = await this._validate(code, this.currentChallenge, runner);
        } finally {
            this.submitting         = false;
            this.submitBtn.disabled = false;
            this.submitBtn.textContent = '▶ Submit';
        }

        const attemptMeta = await this._recordAttempt(this.currentChallenge, result.correct);
        if (attemptMeta && typeof attemptMeta.chances === 'number') {
            window.ARIA_GAME.events.emit('chance:set', { count: attemptMeta.chances });
        }

        if (result.correct) {
            this._onCorrect(result, attemptMeta);
        } else {
            this._onWrong(result, attemptMeta);
        }
    }

    /**
     * Layer 5 validation - executes the player's code in Pyodide, captures
     * stdout, and compares it to the challenge's expected output.
     *
     * Two validation modes:
     *   Standard     - stdout.trim() must equal challenge.expected_output.trim()
     *   Sentinel     - challenge has validation_code; stdout must end with __VALID__
     *
     * @returns {{ correct: boolean, message?: string, stdout?: string }}
     */
    async _validate(code, challenge, runner) {
        const bugProgress = this._countUnfixedBugs(challenge, code);
        if (bugProgress && bugProgress.remaining > 0) {
            return {
                correct: false,
                message: this._buildBugProgressMessage(bugProgress),
                bugProgress,
            };
        }

        const { stdout, error } = await runner.run(
            code,
            challenge.validation_code || '',
        );

        // Show whatever the code printed (educational feedback)
        const displayOut = stdout.replace('__VALID__', '').replace('__INVALID__', '').trim();
        if (displayOut) this._showOutput(displayOut);

        // Python raised an error
        if (error) {
            return {
                correct: false,
                message: `Python error: ${error}`,
                stdout,
            };
        }

        // Sentinel mode - challenge has validation_code appended
        if (challenge.validation_code) {
            const valid = stdout.endsWith('__VALID__');
            if (valid) return { correct: true, stdout };

            // Extract the failure message from validation output if present
            const invalidLine = stdout.split('\n').find(l => l.startsWith('__INVALID__'));
            const msg = invalidLine
                ? invalidLine.replace('__INVALID__:', '').trim()
                : 'Check your data types and values.';
            return { correct: false, message: msg, stdout };
        }

        // Standard mode - compare stdout to expected_output
        const expected = (challenge.expected_output || '').trim();
        const got      = stdout.trim();

        if (got === expected) return { correct: true, stdout };

        return {
            correct: false,
            message: expected
                ? `Output was: "${got}" - expected: "${expected}"`
                : 'Output did not match. Check your values.',
            stdout,
        };
    }

    _onCorrect(result, attemptMeta) {
        const AG = window.ARIA_GAME;
        const ch = this.currentChallenge;

        this._showResult('success', '✓ Correct!');
        AG.events.emit('aria:speak', { text: ch.aria_success });

        // Update gate progress and emit appropriate events
        setTimeout(() => {
            // Close first so event-handler errors can never trap the panel open.
            this.close();
            if (ch.category === 'gate' && this.gatePos) {
                AG.events.emit('challenge:solved', {
                    challengeId: ch.id,
                    gatePos:     this.gatePos,
                    ariaSuccess: ch.aria_success,
                });
            } else if (ch.category === 'boss_bug') {
                AG.events.emit('boss_bug:solved');
            } else if (ch.category === 'boss_chamber') {
                AG.events.emit('boss:solved');
            } else if (ch.category === 'roaming_bug') {
                // Route through challenge:solved so main.js can despawn the bug
                // and schedule respawn. gatePos carries { type:'roaming_bug', bugId }.
                AG.events.emit('challenge:solved', {
                    challengeId: ch.id,
                    gatePos:     this.gatePos,
                });
            }
        }, 1200);
    }

    _onWrong(result, attemptMeta) {
        const AG  = window.ARIA_GAME;
        const ch  = this.currentChallenge;
        const msg = result.message || 'That is not right. Review the concept and try again.';

        const firstWrongFree = attemptMeta?.first_wrong_free === true;
        const chanceLost = attemptMeta?.chance_lost === true;
        const outOfChances = attemptMeta?.out_of_chances === true;

        // First wrong attempt: show hint automatically, no Chance deducted
        if (firstWrongFree) {
            this._showResult('error', `✗ ${msg}`);
            this._showHint(/*auto=*/true);
            AG.events.emit('aria:speak', { text: ch.aria_hint });
        } else {
            // Second+ attempt: deduct a Chance
            this._showResult('error', `✗ ${msg}`);
            AG.events.emit('aria:speak', { text: ch.aria_fail });
            if (!attemptMeta) {
                // Fallback when API unavailable - preserve legacy behavior.
                AG.events.emit('chance:lose');
            }
        }

        if (chanceLost && outOfChances) {
            AG.events.emit('aria:speak', {
                text: 'That was close. Very close. In the wrong direction. Go review your library and try again.',
            });
            setTimeout(() => this.close(), 2200);
        }
    }

    _getCsrfToken() {
        const c = document.cookie.split(';').find(s => s.trim().startsWith('csrftoken='));
        return c ? decodeURIComponent(c.trim().split('=')[1]) : '';
    }

    async _recordAttempt(challenge, correct) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2500);
        try {
            const response = await fetch('/api/challenges/attempt/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken': this._getCsrfToken(),
                },
                signal: controller.signal,
                body: JSON.stringify({
                    challenge_id: challenge.id,
                    category: challenge.category || '',
                    correct: !!correct,
                }),
            });
            clearTimeout(timeoutId);
            if (!response.ok) return null;
            const data = await response.json();
            return data?.ok ? data : null;
        } catch (err) {
            clearTimeout(timeoutId);
            return null;
        }
    }

    _showHint(auto = false) {
        const AG = window.ARIA_GAME;
        const ch = this.currentChallenge;
        if (!ch) return;

        this.hintText.textContent  = ch.hint_text;
        this.hintBox.style.display = 'block';

        // Emit hint:shown only on the first reveal for this challenge,
        // so the Tablet logs each unique hint once.
        if (!this.hintShown) {
            AG.events.emit('hint:shown', { text: ch.hint_text, title: ch.title });
        }

        this.hintShown = true;
        if (!auto) {
            this.hintBtn.disabled    = true;
            this.hintBtn.textContent = '💡 Hint shown';
        }
    }

    _showResult(type, message) {
        this.resultEl.textContent  = message;
        this.resultEl.className    = `cp-result cp-result--${type}`;
        this.resultEl.style.display = 'block';
    }

    _clearResult() {
        this.resultEl.textContent   = '';
        this.resultEl.style.display = 'none';
        this.resultEl.className     = 'cp-result';
    }

    _showOutput(text) {
        if (!this.outputSection || !this.outputEl) return;
        this.outputEl.textContent      = text;
        this.outputSection.style.display = 'block';
    }

    _clearOutput() {
        if (!this.outputSection || !this.outputEl) return;
        this.outputEl.textContent        = '';
        this.outputSection.style.display = 'none';
    }

    _countUnfixedBugs(challenge, code) {
        if (!challenge || !Array.isArray(challenge.bug_checks) || challenge.bug_checks.length === 0) {
            return null;
        }

        const remainingChecks = challenge.bug_checks.filter((check) => {
            try {
                const regex = new RegExp(check.pattern, 'm');
                return !regex.test(code);
            } catch (err) {
                return true;
            }
        });

        return {
            total: challenge.bug_checks.length,
            fixed: challenge.bug_checks.length - remainingChecks.length,
            remaining: remainingChecks.length,
        };
    }

    _buildBugProgressMessage(progress) {
        if (!progress) return 'Check the script and try again.';
        const noun = progress.remaining === 1 ? 'error remains' : 'errors remain';
        return `${progress.total} errors found. You fixed ${progress.fixed}. ${progress.remaining} ${noun}. Keep looking.`;
    }

    _typeLabel(type) {
        return {
            fill_blank: 'Fill in the Blank',
            bug_fix:    'Bug Fix',
            open_code:  'Open Code',
            boss:       'Boss Challenge',
        }[type] ?? type;
    }
}

window.ARIA_GAME.ChallengePanel = ChallengePanel;
