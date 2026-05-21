/**
 * ARIA: The Lost Code — Region 1 Challenge Data (Hardcoded Stub)
 *
 * Source of truth: BIBLE.md Section X — Region 1 Challenge Specifications.
 *
 * In Layer 10, these will be fetched from the Django API (game.Challenge model).
 * For Layers 4–9, this file is the hardcoded data source.
 *
 * Validation strategy (Layer 4 — pre-Pyodide):
 *   required_keywords: every string in this list must appear in the submitted code.
 *   Layer 5 replaces this with Pyodide execution vs. expected_output.
 *
 * Gate-to-challenge mapping:
 *   Each gate position maps to an ordered list of challenge IDs.
 *   Challenges are presented sequentially. The gate opens when all are solved.
 */

window.ARIA_GAME = window.ARIA_GAME || {};

// ---------------------------------------------------------------------------
// Challenge definitions
// ---------------------------------------------------------------------------

window.ARIA_GAME.CHALLENGES = {

    // ── GATE 1 ─────────────────────────────────────────────────────────────

    ch1: {
        id:          'ch1',
        title:       'Power Up Terminal A',
        type:        'fill_blank',
        category:    'gate',
        difficulty:  'beginner',

        prompt_code:
`terminal_name = ___
status = ___
print(terminal_name, "is", status)`,

        expected_output: 'Terminal A is online',

        // Layer 4 validation: these strings must appear in the submitted code
        required_keywords: ['"Terminal A"', '"online"'],
        // Accept single quotes too
        required_keywords_alt: ["'Terminal A'", "'online'"],

        hint_text:        'Every terminal needs a name and a status. Assign them as text values.',
        lesson_reference: 'Code Library: Strings and Variable Assignment',

        aria_intro:   'The terminal is dark because it has no identity. Give it a name and tell it what it is.',
        aria_hint:    'Strings need quotes around them. "Terminal A" is a string. "online" is a string.',
        aria_success: 'Terminal A is online. That\'s one down. Keep moving.',
        aria_fail:    'Something is wrong. Check your quotes. Strings need to be wrapped in quote marks.',
    },

    ch2: {
        id:          'ch2',
        title:       'Power Up Terminal B',
        type:        'fill_blank',
        category:    'gate',
        difficulty:  'beginner',

        prompt_code:
`power_level = ___
is_active = ___
print("Power:", power_level, "Active:", is_active)`,

        expected_output: 'Power: 100 Active: True',

        required_keywords: ['100', 'True'],
        required_keywords_alt: ['100', 'True'],

        hint_text:        'Power level is a whole number. Active status is either True or False.',
        lesson_reference: 'Code Library: Integers, Booleans',

        aria_intro:   'Numbers for quantities. True or False for states. Keep it simple.',
        aria_hint:    'An integer has no quotes. A boolean is exactly True or False — capital T or F.',
        aria_success: 'Both terminals online. Gate 1 is open. Good work.',
        aria_fail:    'Not quite. Remember: integers have no quotes, and True needs a capital T.',
    },

    // ── GATE 2 ─────────────────────────────────────────────────────────────

    ch3: {
        id:          'ch3',
        title:       'Identify the Data Types',
        type:        'fill_blank',
        category:    'gate',
        difficulty:  'beginner',

        prompt_code:
`programmer_name = ___
years_coding = ___
has_coffee = ___
favorite_number = ___`,

        expected_output: '',   // no print — validation is type-correctness only

        required_keywords: ['"', '5', 'True', '3.14'],
        required_keywords_alt: ["'", '5', 'True', '3.14'],

        // No print in the player's code — Pyodide validates types directly
        validation_code:
`_ok = (
    isinstance(programmer_name, str) and
    isinstance(years_coding, int) and not isinstance(years_coding, bool) and
    isinstance(has_coffee, bool) and
    isinstance(favorite_number, float)
)
print("__VALID__" if _ok else f"__INVALID__: got {[type(programmer_name).__name__, type(years_coding).__name__, type(has_coffee).__name__, type(favorite_number).__name__]}")`,

        hint_text:        'One of each type: string, integer, boolean, and float.',
        lesson_reference: 'Code Library: All Data Types',

        aria_intro:   'Four variables. Four types. You know all of them. Do not overthink it.',
        aria_hint:    'String needs quotes. Integer is a whole number. Boolean is True or False. Float has a decimal point.',
        aria_success: 'Four types, all correct. You know the basics. Moving on.',
        aria_fail:    'Check your types. String: quotes. Integer: no quotes, whole number. Boolean: True or False. Float: decimal.',
    },

    ch4: {
        id:          'ch4',
        title:       'Fix the Broken Variable',
        type:        'bug_fix',
        category:    'gate',
        difficulty:  'beginner',

        prompt_code:
`node_id = "Origin-01
power = 10O
is_connected = true`,

        expected_output: '',   // validation: three specific fixes

        required_keywords: ['"Origin-01"', '100', 'True'],
        required_keywords_alt: ["'Origin-01'", '100', 'True'],

        // Validation: check all three fixes (no print in player's code)
        validation_code:
`_ok = (
    node_id == "Origin-01" and
    power == 100 and
    is_connected == True
)
print("__VALID__" if _ok else "__INVALID__: one or more of the three fixes is still wrong")`,

        hint_text:        'Three errors. One is a missing closing quote. One is a letter O instead of zero. One is wrong capitalisation.',
        lesson_reference: 'Code Library: Variable Assignment',

        aria_intro:   'Something is wrong on every line. Find all three before you submit.',
        aria_hint:    'Line 1: the string needs a closing quote mark. Line 2: that O is not a zero. Line 3: Python booleans are capitalised.',
        aria_success: 'All three fixed. That is exactly how bugs hide — one per line, waiting.',
        aria_fail:    'Still broken somewhere. Check all three lines. Closing quote, zero vs letter O, capital True.',
    },

    // ── GATE 3 ─────────────────────────────────────────────────────────────

    ch5: {
        id:          'ch5',
        title:       'String Formatting',
        type:        'fill_blank',
        category:    'gate',
        difficulty:  'beginner',

        prompt_code:
`name = "ARIA"
status = "online"
message = ___
print(message)`,

        expected_output: 'ARIA is now online',

        required_keywords: ['f"', '{name}', '{status}'],
        required_keywords_alt: ["f'", '{name}', '{status}'],

        hint_text:        'Use an f-string to combine the name and status into one message.',
        lesson_reference: 'Code Library: String Formatting',

        aria_intro:   'I need you to announce my return. Make it sound good.',
        aria_hint:    'An f-string starts with f and uses curly braces to insert variable values. f"{name} is now {status}"',
        aria_success: 'Perfect. ARIA is now online. That is the most satisfying output I have ever seen.',
        aria_fail:    'Not quite. You need an f-string. Start with the letter f before the opening quote, then use {name} and {status} inside.',
    },

    // ── BUG BATTLE (roaming Syntax Gnat) ───────────────────────────────────

    ch6: {
        id:          'ch6',
        title:       'Syntax Gnat',
        type:        'bug_fix',
        category:    'roaming_bug',
        difficulty:  'beginner',

        prompt_code:
`greeting = "Hello World
print(greeting)`,

        expected_output: 'Hello World',

        required_keywords: ['"Hello World"'],
        required_keywords_alt: ["'Hello World'"],

        hint_text:        'A closing quote mark is missing.',
        lesson_reference: 'Code Library: Variable Assignment',

        aria_intro:   'Syntax Gnat. Missing quote mark. Squash it fast.',
        aria_hint:    'The string "Hello World needs a closing quotation mark at the end.',
        aria_success: 'Squashed. One Chance Fragment earned.',
        aria_fail:    'Still broken. Find the unclosed string.',
    },

    // ── BOSS BUG ───────────────────────────────────────────────────────────

    ch7: {
        id:          'ch7',
        title:       'Boss Bug — Gate to Boss Chamber',
        type:        'bug_fix',
        category:    'boss_bug',
        difficulty:  'intermediate',

        prompt_code:
`node_name = Origin Node
power_remaining = "87"
backup_active = False
print(f"Node: {node_name}, Power: {power_remaining}")`,

        expected_output: 'Node: Origin Node, Power: 87',

        required_keywords: ['"Origin Node"', '87'],
        required_keywords_alt: ["'Origin Node'", '87'],

        hint_text:        'Two errors. One value is missing quotes. One value has the wrong type.',
        lesson_reference: 'Code Library: Region 1 — All Concepts',

        aria_intro:   'This one has two errors hiding in it. Take your time. We are close to the Boss Chamber.',
        aria_hint:    'node_name needs quote marks — it is a string. power_remaining should be the integer 87, not the string "87".',
        aria_success: 'Both errors found. Full Chance restoration. The Boss Chamber is open.',
        aria_fail:    'Two errors, not one. Look at both the name and the power level carefully.',
    },

    // ── BOSS CHALLENGE ─────────────────────────────────────────────────────

    ch8: {
        id:          'ch8',
        title:       'Who Are You — Boss Challenge',
        type:        'boss',
        category:    'boss_chamber',
        difficulty:  'intermediate',

        prompt_code:
`# Your name as a string
your_name = ___

# Your age as an integer
your_age = ___

# Are you a programmer? True or False
is_programmer = ___

# Your version number as a float
version = ___

# Print a summary using an f-string
print(___)`,

        expected_output: '',   // open-ended — validated by type checks + f-string presence

        // Must have all four types and an f-string
        required_keywords: ['f"', '{your_name}', 'True'],
        required_keywords_alt: ["f'", '{your_name}', 'True'],

        // Pyodide validates: all four variables exist with the right types
        // The player's print() runs first; then __VALID__ is appended.
        validation_code:
`_ok = (
    isinstance(your_name, str) and
    isinstance(your_age, int) and not isinstance(your_age, bool) and
    isinstance(is_programmer, bool) and
    isinstance(version, float)
)
print("__VALID__" if _ok else "__INVALID__: check your data types — string, integer, boolean, float")`,

        hint_text:        'All four data types. String, integer, boolean, float. Then an f-string that uses at least two of the variables.',
        lesson_reference: 'Code Library: Region 1 — All Concepts',

        aria_intro:   'Tell the system who you are. All of it. This is how we prove you belong here.',
        aria_hint:    'Four variables, one f-string. The f-string should reference at least your_name and one other variable.',
        aria_success: 'The Origin Node is restored. Signal expanding. Region 2 unlocked. We are just getting started.',
        aria_fail:    'Not complete yet. All four types, and an f-string with at least two variables inside curly braces.',
    },
};

// ---------------------------------------------------------------------------
// Gate-to-challenge mapping
// Each gate position (col,row) maps to an ordered list of challenge IDs.
// ---------------------------------------------------------------------------

window.ARIA_GAME.GATE_CHALLENGES = {
    '7,5':  ['ch1', 'ch2'],   // Gate 1 — Challenges 1 & 2
    '12,5': ['ch3', 'ch4'],   // Gate 2 — Challenges 3 & 4
    '13,8': ['ch5'],          // Gate 3 — Challenge 5
};

// Boss Bug and Boss Chamber have their own mappings
window.ARIA_GAME.BOSS_BUG_CHALLENGE  = 'ch7';
window.ARIA_GAME.BOSS_CHALLENGE      = 'ch8';
