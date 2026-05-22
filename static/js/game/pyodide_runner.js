/**
 * ARIA: The Lost Code - PyodideRunner
 *
 * Loads Pyodide (Python via WebAssembly) in the background and exposes
 * a single async run() method used by ChallengePanel for code validation.
 *
 * Design decisions:
 *   - Loads eagerly on page load (not on first submission) to hide latency.
 *   - Runs on the main thread in V1. Post-V1: move to a Web Worker.
 *   - Stdout is captured via sys.stdout redirect; returned as a plain string.
 *   - Each run() call gets a clean stdout buffer (previous output discarded).
 *   - No timeout / infinite-loop protection in V1 (Region 1 challenges cannot
 *     produce infinite loops). Post-V1 add-on.
 *
 * Validation protocol (see ChallengePanel._validate):
 *   Regular challenges   → stdout.trim() === challenge.expected_output.trim()
 *   Validation-code chgs → stdout.trim().endsWith('__VALID__')
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class PyodideRunner {

    constructor() {
        this.pyodide  = null;
        this.ready    = false;
        this.loading  = false;
        this._promise = null;
    }

    /**
     * Begin loading Pyodide. Safe to call multiple times - returns the same
     * promise. Called automatically from load(), but can be triggered early
     * (e.g. on page load) to pre-warm the runtime.
     */
    async load() {
        if (this.ready)    return this.pyodide;
        if (this._promise) return this._promise;

        this.loading  = true;
        this._promise = this._doLoad();
        return this._promise;
    }

    /**
     * Execute Python code and return { stdout, error }.
     *
     * @param {string} playerCode      - the code the player wrote
     * @param {string} [validationCode] - optional code appended for type checking
     * @returns {{ stdout: string, error: string|null }}
     */
    async run(playerCode, validationCode = '') {
        if (!this.ready) {
            try {
                await this.load();
            } catch (e) {
                return {
                    stdout: '',
                    error:  'Python runtime failed to load. Check your connection and refresh.',
                };
            }
        }

        const py       = this.pyodide;
        const fullCode = validationCode ? `${playerCode}\n${validationCode}` : playerCode;

        try {
            // Reset stdout capture buffer for this run
            py.runPython('_aria_buf.truncate(0); _aria_buf.seek(0)');

            // Execute the player's code (plus optional validation appendage)
            py.runPython(fullCode);

            const stdout = py.runPython('_aria_buf.getvalue()');
            return { stdout: stdout.trim(), error: null };

        } catch (e) {
            // Recover any partial stdout before the error
            let partialOut = '';
            try { partialOut = py.runPython('_aria_buf.getvalue()').trim(); } catch (_) {}
            return {
                stdout: partialOut,
                error:  this._cleanTraceback(String(e)),
            };
        }
    }

    // -------------------------------------------------------------------------
    // Private
    // -------------------------------------------------------------------------

    async _doLoad() {
        try {
            // loadPyodide is provided by the Pyodide CDN script tag
            const py = await loadPyodide();     // eslint-disable-line no-undef

            // Redirect sys.stdout to a StringIO buffer we can read back
            py.runPython(`
import sys, io
_aria_buf = io.StringIO()
sys.stdout = _aria_buf
`);

            this.pyodide = py;
            this.ready   = true;
            this.loading = false;

            // Notify the UI that Python is ready
            if (window.ARIA_GAME && window.ARIA_GAME.events) {
                window.ARIA_GAME.events.emit('pyodide:ready');
            }

            return py;

        } catch (e) {
            this.loading  = false;
            this._promise = null;  // allow retry
            throw e;
        }
    }

    /**
     * Strip the verbose Pyodide/WebAssembly preamble from Python tracebacks,
     * leaving only the line that's actually useful to a beginner.
     *
     * Before: "PythonError: Traceback (most recent call last):\n  File ...\nSyntaxError: ..."
     * After:  "SyntaxError: EOL while scanning string literal"
     */
    _cleanTraceback(msg) {
        if (!msg) return 'An unknown error occurred.';

        // Strip the "PythonError: " prefix Pyodide adds
        msg = msg.replace(/^PythonError:\s*/i, '');

        // Keep only the last non-empty line (the actual error class + message)
        const lines = msg.split('\n').map(l => l.trim()).filter(Boolean);
        return lines[lines.length - 1] || msg;
    }
}

window.ARIA_GAME.PyodideRunner = PyodideRunner;
