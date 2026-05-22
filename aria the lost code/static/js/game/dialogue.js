/**
 * ARIA: The Lost Code — Dialogue System  (Layer 8)
 *
 * Manages the ARIA dialogue bar with a typewriter animation, a sequential
 * line queue, and named one-time proximity triggers.
 *
 * Public API
 * ──────────
 *   say(text)          Interrupt any current speech; type text immediately.
 *                      Used for all direct game-event responses (gate opens,
 *                      challenge results, boss defeated, etc.) via aria:speak.
 *
 *   append(lines)      Add lines to the queue without interrupting.
 *                      Used for the first-steps narrative sequence that should
 *                      follow the opening line rather than replace it.
 *
 *   trigger(id, lines) Fire a named trigger at most once per session.
 *                      If ARIA is already speaking the trigger is silently
 *                      skipped (ambient map dialogue should not interrupt a
 *                      player-initiated interaction).
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class DialogueSystem {
    /**
     * @param {HTMLElement} el — the #aria-text element
     */
    constructor(el) {
        this._el            = el;
        this._queue         = [];    // pending lines
        this._typing        = false; // true while a typewriter animation runs
        this._timer         = null;  // active setTimeout handle
        this._firedTriggers = new Set();

        // Timing
        this._CHAR_DELAY = 15;   // ms per character  (~67 char/s — snappy but visible)
        this._LINE_HOLD  = 2600; // ms to hold each fully-typed line before advancing
        this._PREFIX     = 'ARIA: "';
        this._SUFFIX     = '"';
    }

    // ── Public API ────────────────────────────────────────────────────────────

    /**
     * Interrupt any current speech and immediately start typing `text`.
     * Clears the queue — game events always take priority over ambient dialogue.
     */
    say(text) {
        this._interrupt();
        this._startTyping(text);
    }

    /**
     * Add `lines` to the queue.  Plays immediately if ARIA is idle; otherwise
     * lines will play in order after the current speech ends.
     * Does NOT interrupt; does NOT deduplicate.
     *
     * @param {string|string[]} lines
     */
    append(lines) {
        const arr = Array.isArray(lines) ? lines : [lines];
        this._queue.push(...arr);
        // If idle, kick off the queue now
        if (!this._typing) this._advanceQueue();
    }

    /**
     * Fire a named trigger at most once per session.
     *
     *   • If already fired   → no-op.
     *   • If ARIA is busy    → mark fired, skip lines silently.
     *                          (Proximity triggers should not stomp gameplay speech.)
     *   • If ARIA is idle    → play lines in sequence.
     *
     * @param {string}   id    — unique trigger identifier
     * @param {string[]} lines — one or more dialogue lines
     */
    trigger(id, lines) {
        if (this._firedTriggers.has(id)) return;
        this._firedTriggers.add(id);

        if (this._typing) return; // ARIA is already speaking — skip ambient trigger

        this._queue = Array.isArray(lines) ? [...lines] : [lines];
        this._advanceQueue();
    }

    // ── Private ───────────────────────────────────────────────────────────────

    _interrupt() {
        if (this._timer !== null) {
            clearTimeout(this._timer);
            this._timer = null;
        }
        this._queue  = [];
        this._typing = false;
    }

    _advanceQueue() {
        if (this._queue.length === 0) {
            this._typing = false;
            return;
        }
        const line = this._queue.shift();
        this._startTyping(line);
    }

    _startTyping(text) {
        this._typing = true;
        const full   = `${this._PREFIX}${text}${this._SUFFIX}`;
        let   i      = 0;

        if (this._el) {
            this._el.style.opacity = '1';
            this._el.textContent   = '';
        }

        const tick = () => {
            if (i < full.length) {
                if (this._el) this._el.textContent += full[i++];
                this._timer = setTimeout(tick, this._CHAR_DELAY);
            } else {
                // Line fully typed — hold, then advance queue
                this._timer = setTimeout(() => this._advanceQueue(), this._LINE_HOLD);
            }
        };

        tick();
    }
}

window.ARIA_GAME.DialogueSystem = DialogueSystem;
