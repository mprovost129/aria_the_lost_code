/**
 * ARIA: The Lost Code — Tablet UI
 *
 * Layer 7. A right-side drawer with three tabs:
 *
 *   challenge  — Reference view of the active challenge (read-only; the
 *                code editor stays in the challenge panel overlay).
 *   library    — Region 1 lesson cards. Grows with shrine unlocks in Layer 10.
 *   aria       — Chances count, received hints log, tools (Layer 9 placeholder).
 *
 * Events consumed (wired in main.js):
 *   challenge:opened  { challenge }   → setActiveChallenge()
 *   hint:shown        { text, title } → addHint()
 *   chance:lose / chance:restore      → updateChances()  (via updateChancesDisplay)
 */

window.ARIA_GAME = window.ARIA_GAME || {};

// ─────────────────────────────────────────────────────────────────────────────
// Region 1 — Library Content
// Each lesson has an id, title, and sections array.
// Section types: 'text' | 'code' | 'list'
// ─────────────────────────────────────────────────────────────────────────────
const _REGION1_LESSONS = [
    {
        id:    'variables',
        title: 'Variables',
        sections: [
            { type: 'text', content: 'A variable stores a value under a name you choose.' },
            { type: 'code', content: 'name = "ARIA"\nlevel = 1\nis_active = True' },
            { type: 'text', content: 'Naming rules:' },
            { type: 'list', items: [
                'Case-sensitive &mdash; <code>Name</code> and <code>name</code> are different',
                'No spaces &mdash; use underscores: <code>my_var</code>',
                'Assign with <code>=</code>; compare with <code>==</code>',
            ]},
        ],
    },
    {
        id:    'data-types',
        title: 'Data Types',
        sections: [
            { type: 'text', content: 'Python has four core types in Region 1.' },
            { type: 'code', content: 'str   →  "text in quotes"\nint   →  42\nfloat →  3.14\nbool  →  True  or  False' },
            { type: 'text', content: 'Check any value\'s type with <code>type()</code>:' },
            { type: 'code', content: "type('hello')  # <class 'str'>\ntype(7)        # <class 'int'>" },
            { type: 'text', content: 'Boolean literals are capitalized in Python: <code>True</code>, <code>False</code>.' },
        ],
    },
    {
        id:    'type-conversion',
        title: 'Type Conversion',
        sections: [
            { type: 'text', content: 'Convert between types using built-in functions.' },
            { type: 'code', content: 'int("42")      # → 42\nstr(100)       # → "100"\nfloat("3.14")  # → 3.14\nbool(0)        # → False\nbool(1)        # → True' },
            { type: 'text', content: 'Falsy values: <code>0</code>, <code>""</code>, <code>[]</code>, <code>None</code>. Everything else is truthy.' },
        ],
    },
    {
        id:    'strings',
        title: 'Strings',
        sections: [
            { type: 'text', content: 'Strings hold text. Single or double quotes work identically.' },
            { type: 'code', content: 'msg = "Hello, ARIA!"\nmsg = \'Hello, ARIA!\'' },
            { type: 'text', content: 'Combine with <code>+</code>:' },
            { type: 'code', content: 'first = "Aria"\nlast  = "Code"\nfull  = first + " " + last  # "Aria Code"' },
            { type: 'text', content: 'Or embed values with an f-string:' },
            { type: 'code', content: 'name = "ARIA"\nmsg  = f"Hello, {name}!"  # "Hello, ARIA!"' },
            { type: 'text', content: 'Get string length:' },
            { type: 'code', content: 'len("ARIA")  # 4' },
        ],
    },
    {
        id:    'lists',
        title: 'Lists',
        sections: [
            { type: 'text', content: 'A list holds multiple values in order, inside square brackets.' },
            { type: 'code', content: 'regions = ["Origin Node", "Data Stream", "Memory Core"]' },
            { type: 'text', content: 'Access by index (starts at <code>0</code>):' },
            { type: 'code', content: 'regions[0]   # "Origin Node"\nregions[-1]  # "Memory Core"  (last item)' },
            { type: 'text', content: 'Common operations:' },
            { type: 'list', items: [
                '<code>len(regions)</code> &mdash; number of items',
                '<code>regions.append("Hub")</code> &mdash; add to end',
                '<code>regions[0] = "Root"</code> &mdash; replace an item',
            ]},
        ],
    },
];

// ─────────────────────────────────────────────────────────────────────────────
// Tablet class
// ─────────────────────────────────────────────────────────────────────────────
class Tablet {

    constructor() {
        // Overlay roots
        this._overlay  = document.getElementById('tablet-overlay');
        this._backdrop = document.getElementById('tablet-backdrop');
        this._closeBtn = document.getElementById('tablet-close');

        // Tab bar buttons and panels
        this._tabBtns = document.querySelectorAll('.tablet-tab-btn');
        this._panels  = document.querySelectorAll('.tablet-panel');

        // ── Challenge tab ────────────────────────────────────────────────
        this._chEmpty   = document.getElementById('tab-ch-empty');
        this._chContent = document.getElementById('tab-ch-content');
        this._chTitle   = document.getElementById('tab-ch-title');
        this._chBadge   = document.getElementById('tab-ch-badge');
        this._chAria    = document.getElementById('tab-ch-aria');
        this._chPrompt  = document.getElementById('tab-ch-prompt');
        this._chLesson  = document.getElementById('tab-ch-lesson');

        // ── ARIA tab ─────────────────────────────────────────────────────
        this._chanceDots   = document.querySelectorAll('.tablet-chance-dot');
        this._chancesLabel = document.querySelector('.tablet-chances-label');
        this._noHints      = document.getElementById('tab-aria-no-hints');
        this._hintsList    = document.getElementById('tab-aria-hints-list');

        // State
        this._activeTab = 'challenge';
        this._hints     = [];   // { text, title } — hints received this session
        this._chances   = 3;
        this._onKeyDown = null; // bound in open()

        this._buildLibrary();
        this._bindEvents();
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Open the drawer.  Optionally switch to a specific tab first.
     * @param {string|null} tab  — 'challenge' | 'library' | 'aria'
     */
    open(tab = null) {
        if (!this._overlay) return;
        this._overlay.classList.add('open');
        if (tab) this.switchTab(tab);

        // Stable handler reference so we can remove it on close
        this._onKeyDown = (e) => { if (e.key === 'Escape') this.close(); };
        document.addEventListener('keydown', this._onKeyDown);
    }

    close() {
        if (!this._overlay) return;
        this._overlay.classList.remove('open');
        if (this._onKeyDown) {
            document.removeEventListener('keydown', this._onKeyDown);
            this._onKeyDown = null;
        }
    }

    switchTab(name) {
        this._activeTab = name;
        this._tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === name));
        this._panels.forEach(p   => p.classList.toggle('active',   p.id  === `tab-${name}`));
    }

    /**
     * Populate the Challenge tab when a gate opens.
     * @param {object} challenge — from ARIA_GAME.CHALLENGES
     */
    setActiveChallenge(challenge) {
        if (!challenge || !this._chContent) return;

        this._chEmpty.style.display   = 'none';
        this._chContent.style.display = 'block';

        this._chTitle.textContent  = challenge.title;
        this._chBadge.textContent  = this._typeLabel(challenge.type);
        this._chBadge.className    = `cp-badge cp-badge--${challenge.type}`;
        this._chAria.textContent   = `ARIA: "${challenge.aria_intro}"`;
        this._chPrompt.textContent = challenge.prompt_code || '';

        if (challenge.lesson_reference) {
            this._chLesson.textContent   = challenge.lesson_reference;
            this._chLesson.style.display = '';
        } else {
            this._chLesson.style.display = 'none';
        }
    }

    /**
     * Log a hint in the ARIA tab.
     * @param {{ text: string, title: string }} data
     */
    addHint({ text, title }) {
        this._hints.push({ text, title: title || 'Challenge' });
        this._renderHints();
    }

    /**
     * Sync the Tablet's Chances dots with the HUD.
     * @param {number} count  — 0..3
     */
    updateChances(count) {
        this._chances = count;
        this._chanceDots.forEach((dot, i) => {
            dot.classList.toggle('lost', i >= count);
        });
        if (this._chancesLabel) {
            this._chancesLabel.textContent = `${count} / 3`;
        }
    }

    // ── Private ───────────────────────────────────────────────────────────────

    _bindEvents() {
        if (this._closeBtn) this._closeBtn.addEventListener('click', () => this.close());
        if (this._backdrop) this._backdrop.addEventListener('click', () => this.close());
        this._tabBtns.forEach(btn => {
            btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
        });
    }

    _renderHints() {
        if (this._hints.length === 0) {
            this._noHints.style.display   = '';
            this._hintsList.style.display = 'none';
            return;
        }
        this._noHints.style.display   = 'none';
        this._hintsList.style.display = '';

        // Newest hint first
        this._hintsList.innerHTML = [...this._hints].reverse().map((h, i) => `
            <div class="tablet-hint-item">
                <div class="tablet-hint-title">${this._hints.length - i}. ${h.title}</div>
                <div class="tablet-hint-text">${h.text}</div>
            </div>
        `).join('');
    }

    _buildLibrary() {
        const container = document.getElementById('tab-library-cards');
        if (!container) return;
        container.innerHTML = _REGION1_LESSONS.map(lesson => `
            <div class="lib-card">
                <div class="lib-card-header">
                    <span class="lib-card-title">${lesson.title}</span>
                    <span class="lib-card-region">Region 1</span>
                </div>
                <div class="lib-card-body">
                    ${lesson.sections.map(s => this._buildSection(s)).join('')}
                </div>
            </div>
        `).join('');
    }

    _buildSection(s) {
        if (s.type === 'text') {
            return `<p class="lib-text">${s.content}</p>`;
        }
        if (s.type === 'code') {
            return `<pre class="lib-code">${this._escHtml(s.content)}</pre>`;
        }
        if (s.type === 'list') {
            const items = s.items.map(item => `<li>${item}</li>`).join('');
            return `<ul class="lib-list">${items}</ul>`;
        }
        return '';
    }

    /** Escape HTML entities for safe insertion into <pre> blocks. */
    _escHtml(str) {
        return str
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;');
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

window.ARIA_GAME.Tablet = Tablet;
