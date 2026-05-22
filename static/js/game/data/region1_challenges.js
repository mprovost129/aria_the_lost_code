/**
 * ARIA: The Lost Code - Region 1 Challenge Data (Hardcoded Stub)
 *
 * Source of truth: BIBLE.md Section X - Region 1 Challenge Specifications.
 *
 * In Layer 10, these will be fetched from the Django API (game.Challenge model).
 * For Layers 4–9, this file is the hardcoded data source.
 *
 * Validation strategy (Layer 4 - pre-Pyodide):
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
        aria_hint:    'An integer has no quotes. A boolean is exactly True or False - capital T or F.',
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
favorite_number = ___
print(type(programmer_name), type(years_coding), type(has_coffee), type(favorite_number))`,

        expected_output: "<class 'str'> <class 'int'> <class 'bool'> <class 'float'>",

        required_keywords: ['"', '5', 'True', '3.14'],
        required_keywords_alt: ["'", '5', 'True', '3.14'],

        // No print in the player's code - Pyodide validates types directly
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
is_connected = true
print(node_id, power, is_connected)`,

        expected_output: 'Origin-01 100 True',

        required_keywords: ['"Origin-01"', '100', 'True'],
        required_keywords_alt: ["'Origin-01'", '100', 'True'],

        // Validation: check all three fixes
        validation_code:
`_ok = (
    node_id == "Origin-01" and
    power == 100 and
    is_connected == True
)
if not _ok: print("__INVALID__: one or more of the three fixes is still wrong")
else: print("__VALID__")`,

        hint_text:        'Three errors. One is a missing closing quote. One is a letter O instead of zero. One is wrong capitalisation.',
        lesson_reference: 'Code Library: Variable Assignment',

        aria_intro:   'Something is wrong on every line. Find all three before you submit.',
        aria_hint:    'Line 1: the string needs a closing quote mark. Line 2: that O is not a zero. Line 3: Python booleans are capitalised.',
        aria_success: 'All three fixed. That is exactly how bugs hide - one per line, waiting.',
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

    // ── GATES 4 – 5 (bottom road) ──────────────────────────────────────────

    ch9: {
        id:          'ch9',
        title:       'Convert the Values',
        type:        'fill_blank',
        category:    'gate',
        difficulty:  'beginner',

        prompt_code:
`score_text  = "42"
temperature = 98.6
is_active   = 1

score = ___(score_text)
label = ___(temperature)
flag  = ___(is_active)
print(score, label, flag)`,

        expected_output: '42 98.6 True',

        validation_code:
`_ok = (
    isinstance(score, int)  and score == 42    and
    isinstance(label, str)  and label == "98.6" and
    isinstance(flag,  bool) and flag  is True
)
print("__VALID__" if _ok else "__INVALID__: check int(), str(), bool() — one for each variable")`,

        hint_text:        'Use int() to turn a string into a whole number, str() to turn a number into text, and bool() to turn a value into True or False.',
        lesson_reference: 'Code Library: Type Conversion',

        aria_intro:   'Three values. Wrong types. Convert them. You have the tools now.',
        aria_hint:    'score_text needs int(). temperature needs str(). is_active needs bool(). One function call each.',
        aria_success: 'All three converted. Type functions work on any value. Gate open.',
        aria_fail:    'Not quite. int() converts strings to integers, str() converts to strings, bool() converts to booleans.',
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

    // Harder Syntax Gnat variants — unlocked as the player completes shrines.
    // _resolveChallenge() picks the appropriate tier automatically.

    ch6_v1: {
        id:          'ch6_v1',
        title:       'Syntax Gnat',
        type:        'bug_fix',
        category:    'roaming_bug',
        difficulty:  'beginner',

        prompt_code:
`system_label = Server Online
priority = 1
print(system_label, priority)`,

        expected_output: 'Server Online 1',

        validation_code:
`assert system_label == "Server Online", "system_label is a string — it needs quote marks around its value"
print("__VALID__")`,

        hint_text:        'system_label is being read as two variable names, not a string. Wrap the value in quote marks.',
        lesson_reference: 'Code Library: Variables, Strings',

        aria_intro:   'Syntax Gnat. The string has no quotes. Fix it.',
        aria_hint:    'Server Online needs to be inside quotes. Without them Python reads it as two separate names that do not exist.',
        aria_success: 'Squashed. One Chance Fragment earned.',
        aria_fail:    'Still broken. Wrap the value on the right side in quote marks.',
    },

    ch6_v2: {
        id:          'ch6_v2',
        title:       'Syntax Gnat',
        type:        'bug_fix',
        category:    'roaming_bug',
        difficulty:  'beginner',

        prompt_code:
`version = 3
label = "ARIA v" + version
print(label)`,

        expected_output: 'ARIA v3',

        validation_code:
`assert label == "ARIA v3", "label should be \\"ARIA v3\\" — check that version can be added to a string"
print("__VALID__")`,

        hint_text:        'You cannot add a string and an integer directly. version needs to be a string, not a number.',
        lesson_reference: 'Code Library: Strings, Data Types',

        aria_intro:   'Syntax Gnat. Type mismatch. The string and the number cannot combine like this.',
        aria_hint:    'version = 3 is an integer. String concatenation only works with strings. Make version a string by adding quote marks.',
        aria_success: 'Squashed. One Chance Fragment earned.',
        aria_fail:    'Still broken. You cannot add a string and a number. Version needs to be a string.',
    },

    ch6_v3: {
        id:          'ch6_v3',
        title:       'Syntax Gnat',
        type:        'bug_fix',
        category:    'roaming_bug',
        difficulty:  'beginner',

        prompt_code:
`device = Connected Device
count = 42
score = "98.6"
print(device, count, score + 1.4)`,

        expected_output: 'Connected Device 42 100.0',

        validation_code:
`assert device == "Connected Device", "device needs quote marks — it is a string value, not a variable name"
assert score == 98.6, "score should be the float 98.6, not the string \\"98.6\\" — remove the quote marks"
print("__VALID__")`,

        hint_text:        'Two errors. One value is missing quotes. One value has quotes it should not have.',
        lesson_reference: 'Code Library: Variables, Strings, Floats',

        aria_intro:   'Syntax Gnat. Two errors this time. One is missing quotes, one has too many.',
        aria_hint:    'Line 1: Connected Device is a string — add quotes. Line 3: 98.6 is a number — remove the quotes so it can be used in maths.',
        aria_success: 'Squashed. One Chance Fragment earned.',
        aria_fail:    'Two errors. One value needs quotes added, one needs quotes removed.',
    },

    // ── BOSS BUG ───────────────────────────────────────────────────────────

    ch7: {
        id:          'ch7',
        title:       'Boss Bug - Gate to Boss Chamber',
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
        lesson_reference: 'Code Library: Region 1 - All Concepts',

        aria_intro:   'This one has two errors hiding in it. Take your time. We are close to the Boss Chamber.',
        aria_hint:    'node_name needs quote marks - it is a string. power_remaining should be the integer 87, not the string "87".',
        aria_success: 'Both errors found. Full Chance restoration. The Boss Chamber is open.',
        aria_fail:    'Two errors, not one. Look at both the name and the power level carefully.',
    },

    // ── BOSS CHALLENGE ─────────────────────────────────────────────────────

    ch8: {
        id:          'ch8',
        title:       'Who Are You - Boss Challenge',
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

        expected_output: '',   // open-ended - validated by type checks + f-string presence

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
print("__VALID__" if _ok else "__INVALID__: check your data types - string, integer, boolean, float")`,

        hint_text:        'All four data types. String, integer, boolean, float. Then an f-string that uses at least two of the variables.',
        lesson_reference: 'Code Library: Region 1 - All Concepts',

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
    // Top road (left → right) — one challenge each, matching the shrine before the gate
    '7,5':   ['ch1'],   // Gate 1 — after Shrine 1 (Variables)      — variable/string fill
    '12,5':  ['ch2'],   // Gate 2 — after Shrine 2 (Strings)         — integer/boolean fill
    '17,5':  ['ch3'],   // Gate 3 — after Shrine 3 (Integers/Floats) — identify data types
    // Bottom road (right → left) — same pattern
    '18,11': ['ch4'],   // Gate 4 — after Shrine 4 (Booleans)        — fix broken variable (incl. bool)
    '13,11': ['ch9'],   // Gate 5 — after Shrine 5 (Type Conversion) — type conversion fill
    '8,11':  ['ch5'],   // Gate 6 — after Shrine 6 (f-strings)       — string formatting; blocks Boss
};

// Boss Bug and Boss Chamber have their own mappings
window.ARIA_GAME.BOSS_BUG_CHALLENGE  = 'ch7';
window.ARIA_GAME.BOSS_CHALLENGE      = 'ch8';

// ---------------------------------------------------------------------------
// Adaptive variant mapping
// _resolveChallenge(id) in main.js walks this list and picks the last tier
// whose requires_shrines entries are ALL in AG.completedShrines.
// A tier with requires_shrines: [] is always eligible (the baseline fallback).
// ---------------------------------------------------------------------------

// Gates are fixed knowledge checkpoints — no variants.
// ch6 (roaming Syntax Gnat) escalates as the player completes shrines.
// ch7 (Boss Bug) is always the hardest — no variants.
window.ARIA_GAME.CHALLENGE_VARIANTS = {
    ch6: [
        { requires_shrines: [],                                id: 'ch6'    },  // unclosed string
        { requires_shrines: ['shrine1'],                       id: 'ch6_v1' },  // unquoted value
        { requires_shrines: ['shrine1', 'shrine2'],            id: 'ch6_v2' },  // str+int type error
        { requires_shrines: ['shrine1', 'shrine2', 'shrine3'], id: 'ch6_v3' },  // multi-error
    ],
};
