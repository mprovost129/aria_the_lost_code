/**
 * ARIA: The Lost Code — Shrine Modal (Layer 10)
 *
 * Displays Learning Shrine content when the player bumps a shrine tile.
 * Opens a centered modal with topic cards; ESC or the close button dismisses it.
 *
 * Usage (from main.js):
 *   AG.shrineModal = new AG.ShrineModal();
 *   AG.shrineModal.open(AG.SHRINES.shrine1);
 *
 * Data shape expected (from region1_shrines.js):
 *   {
 *     id:         string,
 *     name:       string,
 *     aria_intro: string,
 *     topics: [
 *       {
 *         id:    string,
 *         title: string,
 *         sections: [
 *           { type: 'text', content: string },
 *           { type: 'code', content: string },
 *           { type: 'list', items: string[] },
 *         ],
 *       },
 *       ...
 *     ],
 *   }
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class ShrineModal {
    constructor() {
        this._overlay   = document.getElementById('shrine-overlay');
        this._backdrop  = document.getElementById('shrine-backdrop');
        this._titleEl   = document.getElementById('shrine-title');
        this._bodyEl    = document.getElementById('shrine-body');
        this._closeBtn  = document.getElementById('shrine-close');

        // Close handlers
        this._closeBtn.addEventListener('click',  () => this.close());
        this._backdrop.addEventListener('click',  () => this.close());

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape' && this._overlay.classList.contains('open')) {
                this.close();
            }
        });
    }

    /** Open the shrine modal with the given shrine data object. */
    open(shrine) {
        this._titleEl.textContent = shrine.name;
        this._bodyEl.innerHTML    = this._renderShrine(shrine);
        this._overlay.classList.add('open');

        // ARIA speaks the shrine intro — interrupts any ambient dialogue
        const AG = window.ARIA_GAME;
        if (AG.events) {
            AG.events.emit('aria:speak', { text: shrine.aria_intro });
        }
    }

    /** Close the shrine modal. */
    close() {
        this._overlay.classList.remove('open');
    }

    // ── Private rendering ─────────────────────────────────────────────────

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
        if (s.type === 'text') {
            // Allow inline <code> tags in text (they come pre-escaped from the data)
            return `<p class="shrine-text">${s.content}</p>`;
        }
        if (s.type === 'code') {
            return `<pre class="shrine-code">${this._escHtml(s.content)}</pre>`;
        }
        if (s.type === 'list') {
            const items = s.items.map(item => `<li>${item}</li>`).join('');
            return `<ul class="shrine-list">${items}</ul>`;
        }
        return '';
    }

    /** Escape HTML special chars — used for code blocks only (not text/list which embed tags). */
    _escHtml(str) {
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;');
    }
}

window.ARIA_GAME.ShrineModal = ShrineModal;
