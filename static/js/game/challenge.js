/**
 * ARIA: The Lost Code - ChallengePanel
 *
 * Manages the challenge overlay: renders a coding challenge, accepts player
 * input, validates the submission, and emits results to the event bus.
 *
 * TAB MODE (gate challenges):
 *   Gate challenges have 3 independent tabs. The panel opens with a tab bar.
 *   Each tab tracks its own editor content, solved state, and hint state.
 *   The player can switch tabs freely at any time.
 *   All tabs must be solved before the gate opens.
 *   Solved tabs persist if the player is ejected and returns.
 *
 * SINGLE MODE (boss bug, boss chamber, roaming bugs, side challenges):
 *   No tab bar. Behaves exactly as before.
 *
 * Events emitted:
 *   aria:speak         { text }
 *   challenge:open
 *   challenge:close
 *   challenge:opened   { challenge }
 *   challenge:solved   { challengeId, gatePos }
 *   boss_bug:solved
 *   boss:solved
 *   hint:shown         { text, title }
 *   chance:set         { count }
 *   chance:lose
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class ChallengePanel {

    constructor() {
        // ── DOM refs ─────────────────────────────────────────────────────────
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
        this.tabBar        = document.getElementById('cp-tab-bar');
        this.tabProgress   = document.getElementById('cp-tab-progress');

        // ── Tab state ────────────────────────────────────────────────────────
        this.tabChallenges  = null;   // array of challenge objects (tab mode)
        this.activeTabIndex = 0;
        this.tabStates      = [];     // per-tab: { code, hintShown, solved }

        // ── Single mode state ────────────────────────────────────────────────
        this.currentChallenge = null;
        this.hintShown        = false;
        this.submitting       = false;
        this.gatePos          = null;

        this._bindEvents();
    }

    // =========================================================================
    // Public API
    // =========================================================================

    /**
     * Open in TAB MODE for gate challenges.
     * @param {object[]} challenges  Array of 3 challenge objects for this gate
     * @param {object}   gatePos     { col, row }
     * @param {Set}      solvedIds   Set of already-solved challenge IDs (persisted)
     */
    openTabs(challenges, gatePos, solvedIds = new Set()) {
        const AG = window.ARIA_GAME;

        this.tabChallenges  = challenges;
        this.gatePos        = gatePos;
        this.activeTabIndex = 0;
        this.submitting     = false;

        // Initialise per-tab state (preserve editor content and solved state)
        this.tabStates = challenges.map((ch, i) => ({
            code:      this.tabStates[i]?.code ?? ch.prompt_code,
            hintShown: this.tabStates[i]?.hintShown ?? false,
            solved:    solvedIds.has(ch.id),
        }));

        // Jump to first unsolved tab
        const firstUnsolved = this.tabStates.findIndex(t => !t.solved);
        this.activeTabIndex = firstUnsolved >= 0 ? firstUnsolved : 0;

        this._renderTabBar();
        this._loadActiveTab();

        this.overlay.classList.add('open');
        this.editorEl.focus();

        AG.events.emit('challenge:open');
        AG.events.emit('challenge:opened', { challenge: challenges[this.activeTabIndex] });
        AG.events.emit('aria:speak', { text: challenges[this.activeTabIndex].aria_intro });
    }

    /**
     * Open in SINGLE MODE for non-gate challenges.
     * @param {object}      challenge
     * @param {object|null} gatePos
     */
    open(challenge, gatePos = null) {
        const AG = window.ARIA_GAME;

        // Clear tab mode
        this.tabChallenges  = null;
        this.tabStates      = [];
        this.activeTabIndex = 0;

        this.currentChallenge = challenge;
        this.gatePos          = gatePos;
        this.hintShown        = false;
        this.submitting       = false;

        // Hide tab UI
        if (this.tabBar)      { this.tabBar.style.display      = 'none'; this.tabBar.innerHTML = ''; }
        if (this.tabProgress) { this.tabProgress.style.display = 'none'; }

        this._populateSingleChallenge(challenge);

        this.overlay.classList.add('open');
        this.editorEl.focus();

        AG.events.emit('challenge:open');
        AG.events.emit('challenge:opened', { challenge });
        AG.events.emit('aria:speak', { text: challenge.aria_intro });
    }

    close() {
        const AG = window.ARIA_GAME;

        // Save editor content back to tab state before closing
        if (this.tabChallenges) {
            this.tabStates[this.activeTabIndex].code = this.editorEl.value;
        }

        this.overlay.classList.remove('open');
        this.currentChallenge = null;

        // Clear ARIA banner
        const bannerText = document.getElementById('cp-aria-banner-text');
        if (bannerText) bannerText.textContent = '';
        const banner = document.getElementById('cp-aria-banner');
        if (banner) banner.classList.remove('has-text');

        AG.events.emit('challenge:close');
    }

    // =========================================================================
    // Tab rendering
    // =========================================================================

    _renderTabBar() {
        if (!this.tabBar || !this.tabChallenges) return;
        this.tabBar.style.display = 'flex';

        const AG = window.ARIA_GAME;
        const labels = AG.GATE_TAB_LABELS?.[`${this.gatePos.col},${this.gatePos.row}`]
                    || this.tabChallenges.map((_, i) => `Challenge ${i + 1}`);

        this.tabBar.innerHTML = this.tabChallenges.map((ch, i) => {
            const solved = this.tabStates[i].solved;
            const active = i === this.activeTabIndex;
            const cls    = ['cp-tab', active ? 'active' : '', solved ? 'solved' : ''].filter(Boolean).join(' ');
            return `<button class="${cls}" data-tab="${i}" type="button">${labels[i]}</button>`;
        }).join('');

        // Bind tab clicks
        this.tabBar.querySelectorAll('.cp-tab').forEach(btn => {
            btn.addEventListener('click', () => this._switchTab(parseInt(btn.dataset.tab)));
        });
    }

    _switchTab(index) {
        if (!this.tabChallenges || index === this.activeTabIndex) return;

        // Save current editor state
        this.tabStates[this.activeTabIndex].code = this.editorEl.value;

        this.activeTabIndex = index;
        this._renderTabBar();
        this._loadActiveTab();

        const ch = this.tabChallenges[index];
        window.ARIA_GAME.events.emit('aria:speak', { text: ch.aria_intro });
    }

    _loadActiveTab() {
        if (!this.tabChallenges) return;

        const ch    = this.tabChallenges[this.activeTabIndex];
        const state = this.tabStates[this.activeTabIndex];

        // Update title and type badge
        const tabLabel = this.tabChallenges.length > 1
            ? ` — Tab ${this.activeTabIndex + 1} of ${this.tabChallenges.length}`
            : '';
        this.titleEl.textContent = ch.title.replace(/ — Tab \d+ of \d+/, '') + tabLabel;
        this.typeEl.textContent  = this._typeLabel(ch.type);
        this.typeEl.className    = `cp-badge cp-badge--${ch.type}`;

        // ARIA intro text
        this.ariaEl.textContent = `ARIA: "${ch.aria_intro}"`;

        // Editor — restore saved content or use prompt
        this.editorEl.value = state.solved
            ? (state.code || ch.prompt_code)
            : (state.code || ch.prompt_code);

        // Editor label
        this._updateEditorLabel(ch);

        // Expected output
        const hasExpected = ch.expected_output && ch.expected_output.trim();
        if (this.expectedHint) {
            if (hasExpected) {
                this.expectedValue.textContent  = ch.expected_output.trim();
                this.expectedHint.style.display = 'block';
            } else {
                this.expectedHint.style.display = 'none';
            }
        }

        // Bug fix banner
        if (this.bugfixBanner) {
            this.bugfixBanner.style.display = ch.type === 'bug_fix' ? 'block' : 'none';
        }

        // Hint state
        this.hintShown = state.hintShown;
        if (state.hintShown) {
            this.hintText.textContent  = ch.hint_text;
            this.hintBox.style.display = 'block';
            this.hintBtn.disabled      = true;
            this.hintBtn.textContent   = '💡 Hint shown';
        } else {
            this.hintBox.style.display = 'none';
            this.hintBtn.disabled      = false;
            this.hintBtn.textContent   = '💡 Hint';
        }

        // Lesson ref
        this.refEl.textContent   = ch.lesson_reference || '';
        this.refEl.style.display = ch.lesson_reference ? 'block' : 'none';

        // If solved, show a green result message and disable submit
        if (state.solved) {
            this._showResult('success', '✓ This tab is complete.');
            this.submitBtn.disabled    = true;
            this.submitBtn.textContent = '✓ Done';
        } else {
            this._clearResult();
            this.submitBtn.disabled    = false;
            this.submitBtn.textContent = '▶ Submit';
        }

        this._clearOutput();

        // Tab progress summary
        this._renderTabProgress();
    }

    _renderTabProgress() {
        if (!this.tabProgress || !this.tabChallenges) return;

        const AG     = window.ARIA_GAME;
        const labels = AG.GATE_TAB_LABELS?.[`${this.gatePos.col},${this.gatePos.row}`]
                    || this.tabChallenges.map((_, i) => `Tab ${i + 1}`);

        const solved  = this.tabStates.filter(t => t.solved).length;
        const total   = this.tabChallenges.length;

        const items = this.tabChallenges.map((_, i) => {
            const state  = this.tabStates[i];
            const active = i === this.activeTabIndex;
            const cls    = ['tab-prog-item', state.solved ? 'solved' : '', active ? 'active' : ''].filter(Boolean).join(' ');
            const icon   = state.solved ? '✓' : (active ? '▶' : '○');
            return `<span class="${cls}">${icon} ${labels[i]}</span>`;
        }).join('');

        this.tabProgress.innerHTML    = `${items} &nbsp;|&nbsp; ${solved}/${total} complete`;
        this.tabProgress.style.display = 'block';
    }

    // =========================================================================
    // Single challenge rendering
    // =========================================================================

    _populateSingleChallenge(challenge) {
        this.titleEl.textContent = challenge.title;
        this.typeEl.textContent  = this._typeLabel(challenge.type);
        this.typeEl.className    = `cp-badge cp-badge--${challenge.type}`;
        this.ariaEl.textContent  = `ARIA: "${challenge.aria_intro}"`;
        this.editorEl.value      = challenge.prompt_code;
        this.refEl.textContent   = challenge.lesson_reference || '';
        this.refEl.style.display = challenge.lesson_reference ? 'block' : 'none';

        this._updateEditorLabel(challenge);

        const hasExpected = challenge.expected_output && challenge.expected_output.trim();
        if (this.expectedHint) {
            if (hasExpected) {
                this.expectedValue.textContent  = challenge.expected_output.trim();
                this.expectedHint.style.display = 'block';
            } else {
                this.expectedHint.style.display = 'none';
            }
        }

        if (this.bugfixBanner) {
            this.bugfixBanner.style.display = challenge.type === 'bug_fix' ? 'block' : 'none';
        }

        this._clearResult();
        this._clearOutput();
        this.hintBox.style.display = 'none';
        this.hintBtn.disabled      = false;
        this.hintBtn.textContent   = '💡 Hint';
        this.submitBtn.disabled    = false;
        this.submitBtn.textContent = '▶ Submit';
    }

    // =========================================================================
    // Events
    // =========================================================================

    _bindEvents() {
        this.submitBtn.addEventListener('click', () => this._submit());
        this.hintBtn.addEventListener('click',   () => this._showHint());
        this.closeBtn.addEventListener('click',  () => this.close());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.overlay.classList.contains('open')) {
                this.close();
            }
        });

        this.editorEl.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                e.preventDefault();
                this._submit();
                return;
            }
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

    // =========================================================================
    // Submission
    // =========================================================================

    async _submit() {
        if (this.submitting) return;

        // Determine which challenge we are submitting for
        const challenge = this.tabChallenges
            ? this.tabChallenges[this.activeTabIndex]
            : this.currentChallenge;

        if (!challenge) return;

        // If the active tab is already solved, do nothing
        if (this.tabChallenges && this.tabStates[this.activeTabIndex].solved) return;

        const code   = this.editorEl.value;
        const runner = window.ARIA_GAME.pyodideRunner;

        if (code.includes('___')) {
            this._showResult('error', '✗ Fill in all the blanks before submitting.');
            return;
        }

        this.submitting         = true;
        this.submitBtn.disabled = true;
        this.submitBtn.textContent = runner.ready ? '⏳ Running…' : '⏳ Loading Python…';

        this._clearResult();
        this._clearOutput();

        let result;
        try {
            result = await this._validate(code, challenge, runner);
        } finally {
            this.submitting = false;
            if (!result?.correct) {
                this.submitBtn.disabled    = false;
                this.submitBtn.textContent = '▶ Submit';
            }
        }

        const attemptMeta = await this._recordAttempt(challenge, result.correct);
        if (attemptMeta && typeof attemptMeta.chances === 'number') {
            window.ARIA_GAME.events.emit('chance:set', { count: attemptMeta.chances });
        }

        if (result.correct) {
            this._onCorrect(result, attemptMeta, challenge);
        } else {
            this._onWrong(result, attemptMeta, challenge);
        }
    }

    async _validate(code, challenge, runner) {
        // Boss bug: check regex patterns first for per-error progress feedback
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

        const displayOut = stdout.replace('__VALID__', '').replace('__INVALID__', '').trim();
        if (displayOut) this._showOutput(displayOut);

        if (error) {
            return { correct: false, message: `Python error: ${error}`, stdout };
        }

        if (challenge.validation_code) {
            const valid = stdout.endsWith('__VALID__');
            if (valid) return { correct: true, stdout };
            const invalidLine = stdout.split('\n').find(l => l.startsWith('__INVALID__'));
            const msg = invalidLine
                ? invalidLine.replace('__INVALID__:', '').trim()
                : 'Check your data types and values.';
            return { correct: false, message: msg, stdout };
        }

        const expected = (challenge.expected_output || '').trim();
        const got      = stdout.trim();
        if (got === expected) return { correct: true, stdout };

        return {
            correct: false,
            message: expected
                ? `Output was: "${got}" — expected: "${expected}"`
                : 'Output did not match. Check your values.',
            stdout,
        };
    }

    _onCorrect(result, attemptMeta, challenge) {
        const AG = window.ARIA_GAME;

        this._showResult('success', '✓ Correct!');
        AG.events.emit('aria:speak', { text: challenge.aria_success });

        // ── TAB MODE ─────────────────────────────────────────────────────────
        if (this.tabChallenges) {
            // Mark this tab solved and save its code
            this.tabStates[this.activeTabIndex].solved = true;
            this.tabStates[this.activeTabIndex].code   = this.editorEl.value;

            this.submitBtn.disabled    = true;
            this.submitBtn.textContent = '✓ Done';

            this._renderTabBar();
            this._renderTabProgress();

            // Emit solved for this individual tab challenge
            AG.events.emit('challenge:solved', {
                challengeId: challenge.id,
                gatePos:     this.gatePos,
            });

            // Check if all tabs are solved
            const allSolved = this.tabStates.every(t => t.solved);

            if (allSolved) {
                // All tabs done — close after a beat
                setTimeout(() => this.close(), 1400);
            } else {
                // Auto-advance to next unsolved tab after a short pause
                setTimeout(() => {
                    const nextUnsolved = this.tabStates.findIndex(t => !t.solved);
                    if (nextUnsolved >= 0) {
                        this._switchTab(nextUnsolved);
                        AG.events.emit('aria:speak', {
                            text: `Good. ${this.tabStates.filter(t => t.solved).length} of ${this.tabChallenges.length} complete. Move to the next tab.`,
                        });
                    }
                }, 1200);
            }
            return;
        }

        // ── SINGLE MODE ──────────────────────────────────────────────────────
        setTimeout(() => {
            this.close();
            if (challenge.category === 'gate' && this.gatePos) {
                AG.events.emit('challenge:solved', {
                    challengeId: challenge.id,
                    gatePos:     this.gatePos,
                    ariaSuccess: challenge.aria_success,
                });
            } else if (challenge.category === 'boss_bug') {
                AG.events.emit('boss_bug:solved');
            } else if (challenge.category === 'boss_chamber') {
                AG.events.emit('boss:solved');
            } else if (challenge.category === 'roaming_bug') {
                AG.events.emit('challenge:solved', {
                    challengeId: challenge.id,
                    gatePos:     this.gatePos,
                });
            } else if (challenge.category === 'side_challenge') {
                AG.events.emit('challenge:solved', {
                    challengeId: challenge.id,
                    gatePos:     null,
                });
            }
        }, 1200);
    }

    _onWrong(result, attemptMeta, challenge) {
        const AG  = window.ARIA_GAME;
        const msg = result.message || 'That is not right. Review the concept and try again.';

        const firstWrongFree = attemptMeta?.first_wrong_free === true;
        const chanceLost     = attemptMeta?.chance_lost     === true;
        const outOfChances   = attemptMeta?.out_of_chances  === true;

        if (firstWrongFree) {
            this._showResult('error', `✗ ${msg}`);
            this._showHint(true);
            AG.events.emit('aria:speak', { text: challenge.aria_hint });
        } else {
            this._showResult('error', `✗ ${msg}`);
            AG.events.emit('aria:speak', { text: challenge.aria_fail });
            if (!attemptMeta) AG.events.emit('chance:lose');
        }

        if (chanceLost && outOfChances) {
            AG.events.emit('aria:speak', {
                text: 'No chances remaining. Go review your library and come back.',
            });
            setTimeout(() => this.close(), 2200);
        }
    }

    // =========================================================================
    // Helpers
    // =========================================================================

    _updateEditorLabel(challenge) {
        if (!this.editorLabel) return;
        if (challenge.type === 'fill_blank') {
            const count = (challenge.prompt_code.match(/___/g) || []).length;
            this.editorLabel.innerHTML =
                `Your Code &mdash; replace each <span class="blank-highlight">___</span> with the correct value` +
                (count > 0
                    ? `<span class="blank-count">(${count} blank${count > 1 ? 's' : ''})</span>`
                    : '') + ':';
        } else if (challenge.type === 'bug_fix') {
            this.editorLabel.textContent = 'Your Code — edit to fix the bug(s):';
        } else if (challenge.type === 'boss') {
            this.editorLabel.textContent = 'Your Solution — write your complete code:';
        } else {
            this.editorLabel.textContent = 'Your Code:';
        }
    }

    _showHint(auto = false) {
        const AG = window.ARIA_GAME;
        const challenge = this.tabChallenges
            ? this.tabChallenges[this.activeTabIndex]
            : this.currentChallenge;
        if (!challenge) return;

        this.hintText.textContent  = challenge.hint_text;
        this.hintBox.style.display = 'block';

        const alreadyShown = this.tabChallenges
            ? this.tabStates[this.activeTabIndex].hintShown
            : this.hintShown;

        if (!alreadyShown) {
            AG.events.emit('hint:shown', { text: challenge.hint_text, title: challenge.title });
        }

        if (this.tabChallenges) {
            this.tabStates[this.activeTabIndex].hintShown = true;
        } else {
            this.hintShown = true;
        }

        if (!auto) {
            this.hintBtn.disabled    = true;
            this.hintBtn.textContent = '💡 Hint shown';
        }
    }

    _showResult(type, message) {
        this.resultEl.textContent   = message;
        this.resultEl.className     = `cp-result cp-result--${type}`;
        this.resultEl.style.display = 'block';
    }

    _clearResult() {
        this.resultEl.textContent   = '';
        this.resultEl.style.display = 'none';
        this.resultEl.className     = 'cp-result';
    }

    _showOutput(text) {
        if (!this.outputSection || !this.outputEl) return;
        this.outputEl.textContent        = text;
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
        const remaining = challenge.bug_checks.filter(check => {
            try {
                return !new RegExp(check.pattern, 'm').test(code);
            } catch (_) {
                return true;
            }
        });
        return {
            total:     challenge.bug_checks.length,
            fixed:     challenge.bug_checks.length - remaining.length,
            remaining: remaining.length,
        };
    }

    _buildBugProgressMessage(progress) {
        if (!progress) return 'Check the script and try again.';
        const noun = progress.remaining === 1 ? 'error remains' : 'errors remain';
        return `${progress.total} errors in total. You fixed ${progress.fixed}. ${progress.remaining} ${noun}. Keep looking.`;
    }

    _typeLabel(type) {
        return {
            fill_blank: 'Fill in the Blank',
            bug_fix:    'Bug Fix',
            open_code:  'Open Code',
            boss:       'Boss Challenge',
        }[type] ?? type;
    }

    async _recordAttempt(challenge, correct) {
        const controller = new AbortController();
        const timeoutId  = setTimeout(() => controller.abort(), 2500);
        try {
            const response = await fetch('/api/challenges/attempt/', {
                method:  'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRFToken':  this._getCsrfToken(),
                },
                signal: controller.signal,
                body: JSON.stringify({
                    challenge_id: challenge.id,
                    category:     challenge.category || '',
                    correct:      !!correct,
                }),
            });
            clearTimeout(timeoutId);
            if (!response.ok) return null;
            const data = await response.json();
            return data?.ok ? data : null;
        } catch (_) {
            clearTimeout(timeoutId);
            return null;
        }
    }

    _getCsrfToken() {
        const c = document.cookie.split(';').find(s => s.trim().startsWith('csrftoken='));
        return c ? decodeURIComponent(c.trim().split('=')[1]) : '';
    }
}

window.ARIA_GAME.ChallengePanel = ChallengePanel;
