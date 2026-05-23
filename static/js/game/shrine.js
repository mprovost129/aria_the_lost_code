/**
 * ARIA: The Lost Code - Shrine Modal (Layer 10)
 *
 * Displays Learning Shrine content when the player bumps a shrine tile.
 * Opens a centered modal with topic cards; ESC or the close button dismisses it.
 *
 * Usage (from main.js):
 *   AG.shrineModal = new AG.ShrineModal();
 *   AG.shrineModal.open(AG.SHRINES.shrine1);
 *
 * Section types (from region1_shrines.js):
 *   { type: 'text',    content: string }          — prose, HTML allowed
 *   { type: 'code',    content: string }          — read-only example with Run button
 *   { type: 'list',    items:   string[] }        — bullet list, HTML allowed
 *   { type: 'shrine_challenge', prompt, starter,  — editable challenge editor
 *            hint, solution, validation_code }
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class ShrineModal {
    constructor() {
        this._overlay   = document.getElementById('shrine-overlay');
        this._backdrop  = document.getElementById('shrine-backdrop');
        this._titleEl   = document.getElementById('shrine-title');
        this._bodyEl    = document.getElementById('shrine-body');
        this._closeBtn  = document.getElementById('shrine-close');
        this._rewardOverlay = document.getElementById('shrine-reward-overlay');
        this._rewardText = document.getElementById('shrine-reward-text');
        this._rewardCloseBtn = document.getElementById('shrine-reward-close');
        this._rewardDownloadBtn = document.getElementById('shrine-reward-download');

        // ── Close handlers ──────────────────────────────────────────────────
        this._closeBtn.addEventListener('click',  () => this.close());
        this._backdrop.addEventListener('click',  () => this.close());
        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this._overlay.classList.contains('open')) {
                this.close();
            }
        });
        if (this._rewardCloseBtn) {
            this._rewardCloseBtn.addEventListener('click', () => this._closeRewardPrompt());
        }
        if (this._rewardDownloadBtn) {
            this._rewardDownloadBtn.addEventListener('click', () => {
                this._downloadShrinePdf();
                this._closeRewardPrompt();
            });
        }

        // ── Delegated button handlers (work on dynamically rendered content) ─
        this._bodyEl.addEventListener('click', e => {
            // Read-only code block Run
            const runBtn = e.target.closest('.shrine-run-btn');
            if (runBtn && !runBtn.classList.contains('shrine-challenge-run')) {
                this._runCode(runBtn); return;
            }
            // Challenge Run
            const chalRun = e.target.closest('.shrine-challenge-run');
            if (chalRun) { this._runChallenge(chalRun); return; }
            // Hint toggle
            const hintBtn = e.target.closest('.shrine-hint-btn');
            if (hintBtn) { this._toggleHint(hintBtn); return; }
            // Solution reveal
            const solBtn = e.target.closest('.shrine-solution-btn');
            if (solBtn && !solBtn.disabled) { this._showSolution(solBtn); return; }
        });

        // ── Tab key → 4 spaces in challenge editor ───────────────────────────
        this._bodyEl.addEventListener('keydown', e => {
            if (e.key === 'Tab' && e.target.classList.contains('shrine-challenge-editor')) {
                e.preventDefault();
                const ta    = e.target;
                const start = ta.selectionStart;
                const end   = ta.selectionEnd;
                ta.value = ta.value.substring(0, start) + '    ' + ta.value.substring(end);
                ta.selectionStart = ta.selectionEnd = start + 4;
            }
        });
    }

    // ── Public ──────────────────────────────────────────────────────────────

    /** Open the shrine modal with the given shrine data object. */
    open(shrine) {
        this._currentShrine       = shrine;   // stored for challenge completion
        this._titleEl.textContent = shrine.name;
        this._bodyEl.innerHTML    = this._renderShrine(shrine);
        this._overlay.classList.add('open');

        const AG = window.ARIA_GAME;
        if (AG.events) {
            AG.events.emit('aria:speak', { text: shrine.aria_intro });
        }
    }

    /** Close the shrine modal. */
    close() {
        this._overlay.classList.remove('open');
    }

    // ── Rendering ────────────────────────────────────────────────────────────

    _renderShrine(shrine) {
        return shrine.topics.map((topic, i) => this._renderTopic(topic, i)).join('');
    }

    _renderTopic(topic, index) {
        const sections = topic.sections.map(s => this._renderSection(s)).join('');
        return `
<div class="shrine-topic">
    <div class="shrine-topic-number">/ ${String(index + 1).padStart(2, '0')}</div>
    <div class="shrine-topic-title">${this._escHtml(topic.title)}</div>
    <div class="shrine-topic-body">${sections}</div>
</div>`;
    }

    _renderSection(s) {
        // ── Prose text ──────────────────────────────────────────────────────
        if (s.type === 'text') {
            return `<p class="shrine-text">${s.content}</p>`;
        }

        // ── Read-only example code block with Run button ────────────────────
        if (s.type === 'code') {
            const clean    = this._stripOutputComments(s.content);
            const escaped  = this._escHtml(clean);
            const dataCode = encodeURIComponent(clean);
            return `
<div class="shrine-code-block">
    <div class="shrine-code-header">
        <span class="shrine-code-lang">python</span>
        <button class="shrine-run-btn" data-code="${this._escHtml(dataCode)}" type="button">▶ Run</button>
    </div>
    <pre class="shrine-code">${escaped}</pre>
    <div class="shrine-code-output">
        <div class="shrine-code-output-label">▶ Output</div>
        <pre class="shrine-code-output-text">press Run to execute</pre>
    </div>
</div>`;
        }

        // ── Bullet list ─────────────────────────────────────────────────────
        if (s.type === 'list') {
            const items = s.items.map(item => `<li>${item}</li>`).join('');
            return `<ul class="shrine-list">${items}</ul>`;
        }

        // ── Interactive shrine challenge ─────────────────────────────────────
        if (s.type === 'shrine_challenge') {
            const starterEsc = this._escHtml(s.starter || '');
            const dataVal    = this._escHtml(encodeURIComponent(s.validation_code || ''));
            const dataSol    = this._escHtml(encodeURIComponent(s.solution || ''));
            const dataHint   = this._escHtml(s.hint || '');
            return `
<div class="shrine-challenge-block" data-fails="0">
    <div class="shrine-challenge-header">
        <span class="shrine-challenge-icon">⚡</span>
        <span class="shrine-challenge-title">Shrine Challenge</span>
    </div>
    <p class="shrine-challenge-prompt">${s.prompt || ''}</p>
    <div class="shrine-code-header shrine-challenge-editor-header">
        <span class="shrine-code-lang">python</span>
        <div class="shrine-challenge-btns">
            <button class="shrine-run-btn shrine-challenge-run"
                    data-validation="${dataVal}" type="button">▶ Run</button>
            <button class="shrine-hint-btn"
                    data-hint="${dataHint}" type="button">💡 Hint</button>
            <button class="shrine-solution-btn"
                    data-solution="${dataSol}" type="button" disabled>Solution</button>
        </div>
    </div>
    <textarea
        class="shrine-challenge-editor"
        spellcheck="false"
        autocomplete="off"
        autocorrect="off"
        autocapitalize="off"
    >${starterEsc}</textarea>
    <div class="shrine-challenge-hint-box" hidden>
        <div class="shrine-hint-label">💡 Hint</div>
        <div class="shrine-hint-text">${dataHint}</div>
    </div>
    <div class="shrine-challenge-result"></div>
</div>`;
        }

        return '';
    }

    // ── Button handlers ──────────────────────────────────────────────────────

    /** Run a read-only example code block. */
    async _runCode(btn) {
        const block      = btn.closest('.shrine-code-block');
        const outputText = block.querySelector('.shrine-code-output-text');
        const code       = decodeURIComponent(btn.dataset.code);

        btn.disabled     = true;
        btn.textContent  = '⏳';
        outputText.textContent = 'Running…';
        outputText.className   = 'shrine-code-output-text';

        const runner = window.ARIA_GAME.pyodideRunner;
        let stdout, error;
        try {
            ({ stdout, error } = await runner.run(code));
        } catch (e) {
            error = 'Python runtime not ready yet. Try again in a moment.';
        }

        btn.disabled    = false;
        btn.textContent = '▶ Run';

        if (error) {
            outputText.textContent = error;
            outputText.className   = 'shrine-code-output-text has-error';
        } else {
            outputText.textContent = stdout || '(no output)';
            outputText.className   = 'shrine-code-output-text has-output';
        }
    }

    /** Run the player's code in a shrine challenge and validate it. */
    async _runChallenge(btn) {
        const block      = btn.closest('.shrine-challenge-block');
        const editor     = block.querySelector('.shrine-challenge-editor');
        const result     = block.querySelector('.shrine-challenge-result');
        const solBtn     = block.querySelector('.shrine-solution-btn');
        const playerCode = editor.value;
        const validCode  = decodeURIComponent(btn.dataset.validation);

        btn.disabled       = true;
        btn.textContent    = '⏳';
        result.textContent = '';
        result.className   = 'shrine-challenge-result';

        const runner = window.ARIA_GAME.pyodideRunner;
        let stdout = '', error = null;
        try {
            ({ stdout, error } = await runner.run(playerCode, validCode));
        } catch (e) {
            error = 'Python runtime not ready yet. Try again in a moment.';
        }

        const passed = !error && stdout && stdout.includes('__PASS__');

        if (passed) {
            btn.textContent = '✓ Passed';
            // Leave btn disabled - challenge is complete
            result.textContent = '✓ Correct. Shrine challenge complete.';
            result.classList.add('pass');
            const AG      = window.ARIA_GAME;
            const shrine  = this._currentShrine;
            const ariaMsg = shrine?.aria_complete || 'Correct. That is exactly right.';
            if (AG && AG.events) {
                AG.events.emit('aria:speak', { text: ariaMsg });
                AG.events.emit('shrine:complete', { shrineId: shrine.id, shrine });
            }
            this._openRewardPrompt(shrine);
        } else {
            btn.disabled    = false;
            btn.textContent = '▶ Run';

            // Extract readable error from assertion or syntax error
            let msg = error || 'Output did not match. Check your code and try again.';
            if (msg.startsWith('AssertionError:')) {
                msg = msg.replace(/^AssertionError:\s*/, '');
            }
            result.textContent = '✗ ' + msg;
            result.classList.add('fail');

            // Count failures and unlock Solution after 3
            const fails = parseInt(block.dataset.fails || '0') + 1;
            block.dataset.fails = fails;
            if (fails >= 3 && solBtn) {
                solBtn.disabled = false;
                solBtn.title    = 'View a working solution';
            }
        }
    }

    /** Toggle the hint box open/closed. */
    _toggleHint(btn) {
        const block   = btn.closest('.shrine-challenge-block');
        const hintBox = block.querySelector('.shrine-challenge-hint-box');
        if (hintBox.hasAttribute('hidden')) {
            hintBox.removeAttribute('hidden');
            btn.classList.add('active');
        } else {
            hintBox.setAttribute('hidden', '');
            btn.classList.remove('active');
        }
    }

    /** Fill the editor with the solution code. */
    _showSolution(btn) {
        const block  = btn.closest('.shrine-challenge-block');
        const editor = block.querySelector('.shrine-challenge-editor');
        editor.value = decodeURIComponent(btn.dataset.solution);
        btn.textContent = '✓ Solution shown';
        btn.disabled    = true;
    }

    _openRewardPrompt(shrine) {
        if (!this._rewardOverlay || !this._rewardText) {
            this.close();
            return;
        }
        const name = shrine?.name || 'this shrine';
        this._rewardText.textContent =
            `Congratulations. You completed ${name}. ARIA archived your lesson notes. Download the PDF for your study library.`;
        this._rewardOverlay.classList.add('open');
        this._rewardOverlay.setAttribute('aria-hidden', 'false');
    }

    _closeRewardPrompt() {
        if (this._rewardOverlay) {
            this._rewardOverlay.classList.remove('open');
            this._rewardOverlay.setAttribute('aria-hidden', 'true');
        }
        this.close();
    }

    _downloadShrinePdf() {
        const shrine = this._currentShrine;
        if (!shrine) return;

        const lines = [];
        lines.push(shrine.name || 'Learning Shrine');
        lines.push('');
        (shrine.topics || []).forEach((topic, i) => {
            lines.push(`${i + 1}. ${topic.title || 'Topic'}`);
            lines.push('');
            (topic.sections || []).forEach((s) => {
                if (s.type === 'text' && s.content) {
                    lines.push(this._toPlainText(s.content));
                    lines.push('');
                } else if (s.type === 'list' && Array.isArray(s.items)) {
                    s.items.forEach((item) => lines.push(`- ${this._toPlainText(item)}`));
                    lines.push('');
                } else if ((s.type === 'code' || s.type === 'shrine_challenge') && s.content) {
                    lines.push('Code:');
                    lines.push(String(s.content));
                    lines.push('');
                }
            });
        });

        const escaped = this._escHtml(lines.join('\n'));
        const html = `<!doctype html><html><head><meta charset="utf-8"><title>${this._escHtml(shrine.name || 'Shrine')}</title>
<style>body{font-family:"Courier New",monospace;padding:24px;line-height:1.45;color:#0f1720}h1{font-size:20px}pre{white-space:pre-wrap}</style>
</head><body><h1>${this._escHtml(shrine.name || 'Learning Shrine')}</h1><pre>${escaped}</pre><script>window.onload=function(){window.print();};</script></body></html>`;

        const w = window.open('', '_blank', 'width=900,height=700');
        if (!w) return;
        w.document.open();
        w.document.write(html);
        w.document.close();
    }

    _toPlainText(value) {
        const div = document.createElement('div');
        div.innerHTML = String(value || '');
        return (div.textContent || div.innerText || '').trim();
    }

    // ── Helpers ──────────────────────────────────────────────────────────────

    /**
     * Remove # Output: annotations from code before display/execution.
     * Handles both standalone lines and inline suffixes.
     */
    _stripOutputComments(code) {
        return code
            .split('\n')
            .filter(line => !/^\s*#\s*[Oo]utput:/.test(line))
            .map(line => line.replace(/\s*#\s*[Oo]utput:.*$/, ''))
            .join('\n')
            .trim();
    }

    /** Escape HTML special chars (used for code/attribute content). */
    _escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

window.ARIA_GAME.ShrineModal = ShrineModal;
