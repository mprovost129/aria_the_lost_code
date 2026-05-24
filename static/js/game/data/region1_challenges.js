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


    // ── GATE 1: Variables (3 tabs, 2 pieces each) ──────────────────────────
    // Shrine 1 covered: variable assignment, naming, = vs ==
    // Tabs escalate: assign → update → fix a naming error

    ch1_t1: {
        id: 'ch1_t1', title: 'Gate 1 — Tab 1: Restore the Node Record',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 1, tab_label: 'Node Record',
        prompt_code:
`# A node record needs three variables
# Assign the correct values to bring it online

node_id       = ___
region        = ___
is_registered = ___

print(node_id, "registered in", region, ":", is_registered)`,
        validation_code:
`_ok = (
    isinstance(node_id, str) and len(node_id) > 0 and
    isinstance(region, str) and len(region) > 0 and
    isinstance(is_registered, bool)
)
print("__VALID__" if _ok else "__INVALID__: node_id and region must be strings, is_registered must be True or False")`,
        hint_text: 'node_id and region are text values — wrap them in quote marks. is_registered is True or False with a capital letter.',
        lesson_reference: 'Code Library: Variables and Assignment',
        aria_intro:   'The node record is empty. Three variables, three types. Fill them in.',
        aria_hint:    'Text values need quote marks. True or False needs a capital first letter and no quotes.',
        aria_success: 'Node record written. Tab 1 clear.',
        aria_fail:    'Check your types. String needs quotes. Boolean needs capital T or F.',
    },

    ch1_t2: {
        id: 'ch1_t2', title: 'Gate 1 — Tab 2: Update the Status',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 2, tab_label: 'Status Update',
        prompt_code:
`# The node status needs to be updated
# Change both variables to reflect the new state

node_status   = "offline"
error_count   = 12

# Update node_status to "online"
node_status   = ___

# Reset error_count to zero
error_count   = ___

print("Status:", node_status, "Errors:", error_count)`,
        validation_code:
`_ok = node_status == "online" and error_count == 0
print("__VALID__" if _ok else "__INVALID__: node_status must be the string 'online' and error_count must be the integer 0")`,
        hint_text: 'Reassign node_status to the string "online". Reassign error_count to the integer 0 — no quotes.',
        lesson_reference: 'Code Library: Variables and Assignment',
        aria_intro:   'Status is stale. Update both variables to reflect the node coming back online.',
        aria_hint:    'Variables can be reassigned. The new value replaces the old one.',
        aria_success: 'Status updated. Tab 2 clear.',
        aria_fail:    'node_status needs to be the text online in quotes. error_count needs to be the number zero with no quotes.',
    },

    ch1_t3: {
        id: 'ch1_t3', title: 'Gate 1 — Tab 3: Fix the Variable Names',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 3, tab_label: 'Name Fix',
        prompt_code:
`# These variable names break Python rules
# Fix each one so the code runs correctly

1node = "Alpha"
node label = "Control"
node-region = "Origin"

print(1node, node label, node-region)`,
        validation_code:
`# Any valid snake_case names accepted as long as the values are preserved
_names = [k for k in dir() if not k.startswith('_')]
_strings = [v for k,v in locals().items() if isinstance(v, str) and v in ("Alpha","Control","Origin")]
_ok = len(_strings) == 3
print("__VALID__" if _ok else "__INVALID__: fix all three variable names so the values Alpha, Control, and Origin are stored")`,
        hint_text: 'Variable names cannot start with a number, contain spaces, or use hyphens. Use underscores instead: node_one, node_label, node_region.',
        lesson_reference: 'Code Library: Variables and Assignment',
        aria_intro:   'Three broken variable names. Python will reject all of them. Fix each one.',
        aria_hint:    'Replace the number start with a letter, replace spaces with underscores, replace the hyphen with an underscore.',
        aria_success: 'Names corrected. All three stored. Tab 3 clear. Gate 1 open.',
        aria_fail:    'At least one name still breaks a rule. No numbers at the start, no spaces, no hyphens.',
    },

    // ── GATE 2: Strings (3 tabs, 2 pieces each) ─────────────────────────────
    // Shrine 2 covered: string creation, concatenation, len(), common errors

    ch2_t1: {
        id: 'ch2_t1', title: 'Gate 2 — Tab 1: Build the Signal Message',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 1, tab_label: 'Signal Message',
        prompt_code:
`# Build a complete signal message from parts
# Both blanks must be strings

sender    = ___
recipient = ___

message = "Signal from " + sender + " to " + recipient
print(message)
print("Message length:", len(message))`,
        validation_code:
`_ok = (
    isinstance(sender, str) and len(sender) > 0 and
    isinstance(recipient, str) and len(recipient) > 0
)
print("__VALID__" if _ok else "__INVALID__: sender and recipient must both be non-empty strings")`,
        hint_text: 'Both sender and recipient are text values. Wrap them in quote marks. Any names you choose will work.',
        lesson_reference: 'Code Library: Strings',
        aria_intro:   'The signal has no sender and no recipient. Assign two string values to complete it.',
        aria_hint:    'Any text in quotes works. "ARIA" and "Node-01" for example.',
        aria_success: 'Signal routed. Tab 1 clear.',
        aria_fail:    'Both values need to be text wrapped in quote marks.',
    },

    ch2_t2: {
        id: 'ch2_t2', title: 'Gate 2 — Tab 2: Predict the Concatenation',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 2, tab_label: 'Concatenation',
        prompt_code:
`# Two strings are being joined
# What does each print statement produce?

part1 = "Origin"
part2 = "Node"

# Predict and write what these two lines print
result1 = part1 + part2
result2 = part1 + " " + part2

print(result1)   # ___
print(result2)   # ___`,
        validation_code:
`_ok = result1 == "OriginNode" and result2 == "Origin Node"
print("__VALID__" if _ok else f"__INVALID__: result1 should be 'OriginNode' and result2 should be 'Origin Node' — got '{result1}' and '{result2}'")`,
        hint_text: 'Concatenation joins strings exactly as they are. result1 has no space between the words. result2 has a space string in the middle.',
        lesson_reference: 'Code Library: Strings',
        aria_intro:   'Two strings. Two join operations. One has a space, one does not. Assign the correct result to each variable.',
        aria_hint:    'result1 = "Origin" + "Node" produces OriginNode. result2 adds a space string in between.',
        aria_success: 'Concatenation confirmed. Tab 2 clear.',
        aria_fail:    'Think carefully about the space. One join has it, one does not.',
    },

    ch2_t3: {
        id: 'ch2_t3', title: 'Gate 2 — Tab 3: Fix the Broken Strings',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 3, tab_label: 'String Fix',
        prompt_code:
`# Three string errors are blocking the signal
# Find and fix all three

signal_id = 'SIG-004"
frequency = "14.3 MHz
channel   = "Alpha' + "Bravo"

print(signal_id)
print(frequency)
print(channel)`,
        validation_code:
`_ok = (
    signal_id == "SIG-004" and
    frequency == "14.3 MHz" and
    channel   == "AlphaBravo"
)
print("__VALID__" if _ok else "__INVALID__: all three strings must be correctly closed with matching quote types")`,
        hint_text: 'signal_id opens with single quote but closes with double. frequency is missing its closing quote. channel mixes quote types in the concatenation.',
        lesson_reference: 'Code Library: Strings',
        aria_intro:   'Three corrupted strings. Each has a different quote error. Fix them all.',
        aria_hint:    'Open and close with the same quote type. Check each string carefully.',
        aria_success: 'All three strings repaired. Tab 3 clear. Gate 2 open.',
        aria_fail:    'At least one string still has mismatched or missing quotes.',
    },

    // ── GATE 3: Integers and Floats (3 tabs, 2 pieces each) ─────────────────
    // Shrine 3 covered: int vs float, arithmetic, numbers vs strings, O vs 0

    ch3_t1: {
        id: 'ch3_t1', title: 'Gate 3 — Tab 1: Power Calculations',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 1, tab_label: 'Power Calc',
        prompt_code:
`# Fill in the values and complete the calculation

max_power       = ___    # integer: total available power
efficiency      = ___    # float: between 0.0 and 1.0
regions_active  = ___    # integer: number of active regions

actual_power    = max_power * efficiency
power_per_region = actual_power / regions_active

print("Actual power:", actual_power)
print("Per region:", power_per_region)`,
        validation_code:
`_ok = (
    isinstance(max_power, int) and max_power > 0 and
    isinstance(efficiency, float) and 0.0 < efficiency <= 1.0 and
    isinstance(regions_active, int) and regions_active > 0
)
print("__VALID__" if _ok else "__INVALID__: max_power and regions_active must be integers greater than zero, efficiency must be a float between 0.0 and 1.0")`,
        hint_text: 'Integers have no decimal point. Floats need one. efficiency = 0.8 not 0 or 1.',
        lesson_reference: 'Code Library: Integers and Floats',
        aria_intro:   'Three values needed for the power grid. One integer, one float, one integer. Fill them in.',
        aria_hint:    'max_power = 500, efficiency = 0.8, regions_active = 4 for example.',
        aria_success: 'Power grid calculated. Tab 1 clear.',
        aria_fail:    'Check your types. Integers have no decimal point. Floats need one.',
    },

    ch3_t2: {
        id: 'ch3_t2', title: 'Gate 3 — Tab 2: Spot the Type Trap',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 2, tab_label: 'Type Trap',
        prompt_code:
`# These calculations will fail because of type mistakes
# Fix the values so the maths works

node_count = "8"
signal_boost = 1.5
base_output = node_count * signal_boost

sector_power = 200
drain = "45"
net_power = sector_power - drain

print(base_output)
print(net_power)`,
        validation_code:
`_ok = (
    base_output == 12.0 and
    net_power == 155
)
print("__VALID__" if _ok else f"__INVALID__: base_output should be 12.0 and net_power should be 155 — got {base_output} and {net_power}")`,
        hint_text: 'node_count is a string but needs to be an integer. drain is a string but needs to be an integer. Remove the quote marks from both.',
        lesson_reference: 'Code Library: Integers and Floats',
        aria_intro:   'Two calculations are failing. The values look right but they are the wrong type.',
        aria_hint:    'Quote marks make a value a string. Remove them from node_count and drain so they become numbers.',
        aria_success: 'Both calculations running. Tab 2 clear.',
        aria_fail:    'Find the values that have unnecessary quote marks and remove them.',
    },

    ch3_t3: {
        id: 'ch3_t3', title: 'Gate 3 — Tab 3: Zero vs Letter O',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 3, tab_label: 'Zero vs O',
        prompt_code:
`# Three values contain the letter O where the number zero should be
# Find and fix all three

sector_id    = 1O3
memory_banks = 10O
packet_size  = 5OO

total = sector_id + memory_banks + packet_size
print("Total:", total)`,
        validation_code:
`_ok = sector_id == 103 and memory_banks == 100 and packet_size == 500 and total == 703
print("__VALID__" if _ok else f"__INVALID__: sector_id should be 103, memory_banks 100, packet_size 500 — check every digit")`,
        hint_text: 'In each value, the letter O is being used where the number 0 belongs. Look at every digit character carefully.',
        lesson_reference: 'Code Library: Integers and Floats',
        aria_intro:   'Three values look right at first glance. Look again. The letter O and the number zero are not the same.',
        aria_hint:    '1O3 should be 103. 10O should be 100. 5OO should be 500.',
        aria_success: 'All zeros corrected. Tab 3 clear. Gate 3 open.',
        aria_fail:    'Still finding letters. Go character by character through each number.',
    },

    // ── GATE 4: Booleans (3 tabs, 2 pieces each) ─────────────────────────────
    // Shrine 4 covered: True/False, comparisons, = vs ==

    ch4_t1: {
        id: 'ch4_t1', title: 'Gate 4 — Tab 1: System Status Board',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 1, tab_label: 'Status Board',
        prompt_code:
`# Fill in the status board with boolean values
# Each system is either active or not

power_grid    = ___
cooling_array = ___
network_link  = ___
backup_core   = ___

active_count = sum([power_grid, cooling_array, network_link, backup_core])
print("Active systems:", active_count, "of 4")`,
        validation_code:
`_ok = all(isinstance(v, bool) for v in [power_grid, cooling_array, network_link, backup_core])
print("__VALID__" if _ok else "__INVALID__: all four variables must be True or False — capital T or F, no quote marks")`,
        hint_text: 'True and False must have a capital first letter. No quote marks. Any combination of True and False values is accepted.',
        lesson_reference: 'Code Library: Booleans',
        aria_intro:   'Four systems. Each is either active or not. Assign True or False to each.',
        aria_hint:    'power_grid = True, cooling_array = False for example. Capital T or F, no quotes.',
        aria_success: 'Status board filled. Tab 1 clear.',
        aria_fail:    'Boolean values are True or False. Capital first letter. No quotes.',
    },

    ch4_t2: {
        id: 'ch4_t2', title: 'Gate 4 — Tab 2: Comparison Results',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 2, tab_label: 'Comparisons',
        prompt_code:
`# Complete these comparison results
# Assign True or False based on the comparison

power    = 150
minimum  = 100
maximum  = 200

above_minimum = ___    # is power greater than minimum?
below_maximum = ___    # is power less than maximum?
at_minimum    = ___    # is power equal to minimum?
not_maximum   = ___    # is power not equal to maximum?

print(above_minimum, below_maximum, at_minimum, not_maximum)`,
        validation_code:
`_ok = (
    above_minimum is True  and
    below_maximum is True  and
    at_minimum    is False and
    not_maximum   is True
)
print("__VALID__" if _ok else "__INVALID__: evaluate each comparison using the values given: power=150, minimum=100, maximum=200")`,
        hint_text: '150 > 100 is True. 150 < 200 is True. 150 == 100 is False. 150 != 200 is True.',
        lesson_reference: 'Code Library: Booleans',
        aria_intro:   'Four comparisons. Evaluate each one using the values given and assign the result.',
        aria_hint:    'Work through each: is 150 greater than 100? Is 150 less than 200? Is 150 equal to 100?',
        aria_success: 'All comparisons correct. Tab 2 clear.',
        aria_fail:    'Evaluate each comparison manually using the given numbers.',
    },

    ch4_t3: {
        id: 'ch4_t3', title: 'Gate 4 — Tab 3: Fix the Boolean Errors',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 3, tab_label: 'Boolean Fix',
        prompt_code:
`# Four boolean errors are in this script
# Find and fix all of them

shield_up   = TRUE
backup_on   = false
link_active = 1
in_danger   = "False"

if shield_up == True:
    print("Shield active")
if backup_on == False:
    print("Backup offline")
print("Link:", link_active)
print("Danger:", in_danger)`,
        validation_code:
`_ok = (
    shield_up   is True  and
    backup_on   is False and
    isinstance(link_active, bool) and
    isinstance(in_danger,   bool)
)
print("__VALID__" if _ok else "__INVALID__: all four must be actual booleans: True/False, not TRUE/false/1/strings")`,
        hint_text: 'TRUE should be True. false should be False. 1 should be True or False not a number. "False" in quotes is a string not a boolean — remove the quotes.',
        lesson_reference: 'Code Library: Booleans',
        aria_intro:   'Four boolean values, all written incorrectly. Fix each one.',
        aria_hint:    'Python booleans are exactly True or False. Capital first letter only. No quotes. No numbers.',
        aria_success: 'All four corrected. Tab 3 clear. Gate 4 open.',
        aria_fail:    'Check each one: correct capitalisation, no quotes, no numbers as substitutes.',
    },

    // ── GATE 5: Type Conversion (3 tabs, 2 pieces each) ─────────────────────
    // Shrine 5 covered: int(), float(), str(), bool(), when conversion fails

    ch5_t1: {
        id: 'ch5_t1', title: 'Gate 5 — Tab 1: Convert the Incoming Data',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 1, tab_label: 'Data Convert',
        prompt_code:
`# Sensor data arrived as the wrong types
# Convert each value using int(), float(), str(), or bool()

raw_power     = "240"     # should be int
raw_temp      = 98        # should be float
raw_status    = 1         # should be bool
raw_label     = 3.14      # should be str

power  = ___
temp   = ___
status = ___
label  = ___

print(power, temp, status, label)`,
        validation_code:
`_ok = (
    isinstance(power,  int)   and power  == 240   and
    isinstance(temp,   float) and temp   == 98.0  and
    isinstance(status, bool)  and status is True   and
    isinstance(label,  str)   and label  == "3.14"
)
print("__VALID__" if _ok else "__INVALID__: use int(), float(), bool(), str() to convert each raw value to the correct type")`,
        hint_text: 'int("240") gives 240. float(98) gives 98.0. bool(1) gives True. str(3.14) gives "3.14".',
        lesson_reference: 'Code Library: Type Conversion',
        aria_intro:   'Four values, four wrong types. One conversion function call each.',
        aria_hint:    'int() for whole numbers, float() for decimals, bool() for True/False, str() for text.',
        aria_success: 'All four converted correctly. Tab 1 clear.',
        aria_fail:    'Match each conversion function to the target type.',
    },

    ch5_t2: {
        id: 'ch5_t2', title: 'Gate 5 — Tab 2: Fix the Type Crash',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 2, tab_label: 'Type Crash',
        prompt_code:
`# This script raises a TypeError when it runs
# Fix it so the calculation completes

node_power    = "180"
signal_boost  = 20
efficiency    = "0.75"

boosted_power = node_power + signal_boost
final_output  = boosted_power * efficiency

print("Final output:", final_output)`,
        validation_code:
`_ok = (
    abs(final_output - 150.0) < 0.001
)
print("__VALID__" if _ok else f"__INVALID__: final_output should be 150.0 — got {final_output}. Convert strings to numbers before the maths")`,
        hint_text: 'node_power is a string. Convert it with int() before adding. efficiency is a string. Convert it with float() before multiplying.',
        lesson_reference: 'Code Library: Type Conversion',
        aria_intro:   'The calculation crashes immediately. Two values are strings pretending to be numbers.',
        aria_hint:    'Use int(node_power) and float(efficiency) before the maths operations.',
        aria_success: 'TypeError resolved. Tab 2 clear.',
        aria_fail:    'Find the string values and convert them before they are used in calculations.',
    },

    ch5_t3: {
        id: 'ch5_t3', title: 'Gate 5 — Tab 3: Build the Status String',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 3, tab_label: 'Status String',
        prompt_code:
`# Build a status string from mixed-type values
# You must convert before concatenating

node_id    = 7          # integer
power      = 92.5       # float
is_active  = True       # boolean

# Convert all three to strings and join them
status_line = ___ + " | Power: " + ___ + " | Active: " + ___

print(status_line)`,
        validation_code:
`_ok = (
    "7" in status_line and
    "92.5" in status_line and
    "True" in status_line and
    isinstance(status_line, str)
)
print("__VALID__" if _ok else "__INVALID__: status_line must contain 7, 92.5, and True as text — use str() to convert each value")`,
        hint_text: 'You cannot concatenate integers, floats, or booleans with strings. Use str(node_id), str(power), str(is_active) to convert each one first.',
        lesson_reference: 'Code Library: Type Conversion',
        aria_intro:   'Three values need to be joined into one string. They are all different types. Convert them first.',
        aria_hint:    'str(7) gives "7". str(92.5) gives "92.5". str(True) gives "True".',
        aria_success: 'Status line built. Tab 3 clear. Gate 5 open.',
        aria_fail:    'Use str() around each non-string value before the + concatenation.',
    },

    // ── GATE 6: f-strings (3 tabs, 2 pieces each) ───────────────────────────
    // Shrine 6 covered: f-string syntax, variables in braces, expressions, formatting

    ch6_gate_t1: {
        id: 'ch6_gate_t1', title: 'Gate 6 — Tab 1: Write the Signal Report',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 1, tab_label: 'Signal Report',
        prompt_code:
`# Write a single f-string that includes all four variables
node_name     = "Origin Node"
signal_level  = 14.3
terminals_up  = 3
aria_state    = "reconnecting"

# Your f-string must reference all four variables
report = ___

print(report)`,
        validation_code:
`_ok = (
    isinstance(report, str) and
    "Origin Node"    in report and
    "14.3"           in report and
    "3"              in report and
    "reconnecting"   in report
)
print("__VALID__" if _ok else "__INVALID__: report must be an f-string that includes node_name, signal_level, terminals_up, and aria_state")`,
        hint_text: 'Start with f before the quote. Put each variable name in curly braces: f"{node_name} signal {signal_level}..."',
        lesson_reference: 'Code Library: f-strings',
        aria_intro:   'Four variables. One f-string. Reference all four in a single formatted message.',
        aria_hint:    'report = f"{node_name} | Signal: {signal_level} | Terminals: {terminals_up} | ARIA: {aria_state}"',
        aria_success: 'Signal report formatted. Tab 1 clear.',
        aria_fail:    'Make sure the f-string starts with f and uses curly braces for all four variable names.',
    },

    ch6_gate_t2: {
        id: 'ch6_gate_t2', title: 'Gate 6 — Tab 2: f-string Expressions',
        type: 'fill_blank', category: 'gate', difficulty: 'beginner',
        tab: 2, tab_label: 'Expressions',
        prompt_code:
`# f-strings can contain expressions, not just variable names
max_power  = 400
efficiency = 0.75
regions    = 4

# Write f-strings using expressions inside the curly braces
line1 = ___    # show max_power * efficiency as the actual power
line2 = ___    # show (max_power * efficiency) / regions as power per region

print(line1)
print(line2)`,
        validation_code:
`_ok = (
    isinstance(line1, str) and str(max_power * efficiency)  in line1 and
    isinstance(line2, str) and str((max_power * efficiency) / regions) in line2
)
print("__VALID__" if _ok else f"__INVALID__: line1 must contain 300.0 and line2 must contain 75.0")`,
        hint_text: 'Expressions go directly inside the curly braces: f"Actual: {max_power * efficiency}" calculates and inserts the result.',
        lesson_reference: 'Code Library: f-strings',
        aria_intro:   'f-strings can do the maths for you inside the braces. Write both lines using expressions.',
        aria_hint:    'line1 = f"Actual power: {max_power * efficiency}" for example.',
        aria_success: 'Both expressions evaluated and formatted. Tab 2 clear.',
        aria_fail:    'Put the full calculation inside the curly braces of the f-string.',
    },

    ch6_gate_t3: {
        id: 'ch6_gate_t3', title: 'Gate 6 — Tab 3: Fix the f-string Errors',
        type: 'bug_fix', category: 'gate', difficulty: 'beginner',
        tab: 3, tab_label: 'f-string Fix',
        prompt_code:
`# Three f-string errors are blocking the final gate
# Fix all three

name    = "ARIA"
version = 2.1
active  = True

line1 = "{name} is version {version}"
line2 = f"Status: {aktiv}"
line3 = f"System: {"name"} v{version} active: {active}"

print(line1)
print(line2)
print(line3)`,
        validation_code:
`_ok = (
    line1 == "ARIA is version 2.1" and
    line2 == "Status: True"        and
    line3 == "System: ARIA v2.1 active: True"
)
print("__VALID__" if _ok else "__INVALID__: check all three lines — missing f prefix, misspelled variable, and quoted variable name inside braces")`,
        hint_text: 'line1 is missing the f prefix. line2 has a misspelled variable name (aktiv should be active). line3 has the variable name in quotes inside the braces — remove the quotes.',
        lesson_reference: 'Code Library: f-strings',
        aria_intro:   'Three f-strings. Three different errors. Fix them all to open the final gate.',
        aria_hint:    'Missing f prefix. Wrong variable name. Variable name in quotes inside braces.',
        aria_success: 'All three corrected. Tab 3 clear. Gate 6 open.',
        aria_fail:    'One error per line. Different mistake on each.',
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
        title:       'Boss Bug: Origin Node Reboot',
        type:        'bug_fix',
        category:    'boss_bug',
        difficulty:  'intermediate',

        // Six errors, one per shrine, hidden in one connected reboot script.
        // The script attempts to reboot the Origin Node after the power surge.
        // Every line has a purpose in the narrative. Six lines contain one bug each.
        //
        // Error 1 (Shrine 1 - Variables):      region_id = Origin Node
        //                                       Missing quotes. Python reads two names.
        // Error 2 (Shrine 2 - Strings):         node_label = "Root Shrine
        //                                       Unclosed string literal.
        // Error 3 (Shrine 3 - Integers/Floats): power_core = 10O
        //                                       Letter O instead of zero.
        // Error 4 (Shrine 4 - Booleans):        shield_active = true
        //                                       Lowercase boolean.
        // Error 5 (Shrine 5 - Type Conversion): total_energy = energy_stored + boost
        //                                       energy_stored is a string. Must convert first.
        // Error 6 (Shrine 6 - f-strings):       print("{region_id} | ...")
        //                                       Missing f before the quote mark.

        prompt_code:
`# Origin Node reboot sequence
# Fix all six bugs to bring the node back online

region_id     = Origin Node
node_label    = "Root Shrine
power_core    = 10O
shield_active = true

energy_stored = "87"
boost         = 13
total_energy  = energy_stored + boost

status = "rebooting"
print("{region_id} | {node_label} | Power: {power_core} | Shield: {shield_active} | Energy: {total_energy} | Status: {status}")`,

        expected_output: 'Origin Node | Root Shrine | Power: 100 | Shield: True | Energy: 100 | Status: rebooting',

        // Static analysis: regex patterns that detect each correct fix.
        // _countUnfixedBugs() in challenge.js uses these to report progress
        // without revealing which lines are still broken.
        bug_checks: [
            {
                id:      'variables',
                label:   'Shrine 1 — Variables',
                pattern: String.raw`region_id\s*=\s*["']Origin Node["']`,
            },
            {
                id:      'strings',
                label:   'Shrine 2 — Strings',
                pattern: String.raw`node_label\s*=\s*["']Root Shrine["']`,
            },
            {
                id:      'numbers',
                label:   'Shrine 3 — Integers and Floats',
                pattern: String.raw`power_core\s*=\s*100\b`,
            },
            {
                id:      'booleans',
                label:   'Shrine 4 — Booleans',
                pattern: String.raw`shield_active\s*=\s*True\b`,
            },
            {
                id:      'type_conversion',
                label:   'Shrine 5 — Type Conversion',
                // Accepts int(energy_stored) + boost or int(energy_stored)+boost
                pattern: String.raw`total_energy\s*=\s*int\(\s*energy_stored\s*\)\s*\+\s*boost`,
            },
            {
                id:      'f_strings',
                label:   'Shrine 6 — f-strings',
                // f" or f' before the string that contains {region_id}
                pattern: String.raw`print\s*\(\s*f["'][\s\S]*\{region_id\}[\s\S]*["']\s*\)`,
            },
        ],

        // Pyodide validation: runs after all six regex checks pass.
        // Confirms the actual values are correct, not just the syntax shape.
        validation_code:
`_ok = (
    region_id     == "Origin Node" and
    node_label    == "Root Shrine" and
    power_core    == 100           and
    shield_active is True          and
    isinstance(energy_stored, str) and energy_stored == "87" and
    boost         == 13            and
    total_energy  == 100           and
    status        == "rebooting"
)
print("__VALID__" if _ok else "__INVALID__: check all six fixes — values must match exactly")`,

        shard_reward: 30,

        hint_text:        'Six errors, one per shrine. Work through the script top to bottom: variable quotes, string close, zero vs O, boolean capital, type conversion before math, f-string prefix.',
        lesson_reference: 'Code Library: Region 1 — All Concepts',

        aria_intro:   'Six bugs. One from each shrine you repaired. This is not random corruption — something placed them here deliberately. I can tell you how many remain. I will not tell you which lines.',
        aria_hint:    'Go shrine by shrine. Variables: missing quotes. Strings: unclosed. Numbers: check every digit carefully. Booleans: capitalisation. Type conversion: check before the math. f-strings: check before the print.',
        aria_success: 'All six removed. That was not luck. Full Chance restoration. The Boss Chamber is open. Whatever placed those bugs is still in there.',
        aria_fail:    'Still broken somewhere. Do not fixate on one area. Sweep top to bottom, shrine by shrine. The counter will tell you how many are left.',
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

    // ── SIDE CHALLENGES: OPTIONAL MASTERY CHECKS ───────────────────────────
    // These are intentionally about concepts already taught by Region 1 shrines.
    // They should reward Code Shards/lore, not block main progression.

    ch10: {
        id:          'ch10',
        title:       'Side Challenge - Output Prediction',
        type:        'open_code',
        category:    'side_challenge',
        difficulty:  'beginner',
        shard_reward: 18,

        prompt_code:
`name = "ARIA"
level = 1
print(f"{name} restored level {level}")`,

        expected_output: 'ARIA restored level 1',
        hint_text:        'Read the f-string exactly. Curly braces are replaced with the current variable values.',
        lesson_reference: 'Code Library: Variables + f-strings',

        aria_intro:   'Optional side signal detected. Predict what this code prints. This tests what you already repaired.',
        aria_hint:    'Replace {name} with ARIA and {level} with 1.',
        aria_success: 'Side signal stabilized. Code Shards awarded.',
        aria_fail:    'Trace the variables first, then read the f-string left to right.',
    },

    ch11: {
        id:          'ch11',
        title:       'Side Challenge - Type Repair',
        type:        'bug_fix',
        category:    'side_challenge',
        difficulty:  'beginner',
        shard_reward: 20,

        prompt_code:
`stored_energy = "40"
bonus_energy = 2
final_energy = stored_energy + bonus_energy
print(final_energy)`,

        expected_output: '42',
        validation_code:
`_ok = final_energy == 42 and isinstance(final_energy, int)
print("__VALID__" if _ok else "__INVALID__: convert the stored text before adding")`,

        hint_text:        'stored_energy is text. Convert it with int() before adding bonus_energy.',
        lesson_reference: 'Code Library: Type Conversion',

        aria_intro:   'Optional side signal detected. The system stored a number as text. Repair the calculation.',
        aria_hint:    'Use int(stored_energy) + bonus_energy.',
        aria_success: 'Side signal stabilized. Code Shards awarded.',
        aria_fail:    'The value looks like a number, but quotes make it a string.',
    },

};

// ---------------------------------------------------------------------------
// Gate-to-challenge mapping
// Each gate position (col,row) maps to an ordered list of challenge IDs.
// ---------------------------------------------------------------------------

// ---------------------------------------------------------------------------
// Gate-to-challenge mapping (tab-based structure)
// Each gate maps to an array of tab arrays.
// All tabs must be completed before the gate opens.
// Tabs can be attempted in any order.
// ---------------------------------------------------------------------------

window.ARIA_GAME.GATE_CHALLENGES = {
    '42,26':  [['ch1_t1',       'ch1_t2',       'ch1_t3'      ]],  // Gate 1: Variables
    '64,27':  [['ch2_t1',       'ch2_t2',       'ch2_t3'      ]],  // Gate 2: Strings
    '88,24':  [['ch3_t1',       'ch3_t2',       'ch3_t3'      ]],  // Gate 3: Integers/Floats
    '106,27': [['ch4_t1',       'ch4_t2',       'ch4_t3'      ]],  // Gate 4: Booleans
    '128,24': [['ch5_t1',       'ch5_t2',       'ch5_t3'      ]],  // Gate 5: Type Conversion
    '148,27': [['ch6_gate_t1',  'ch6_gate_t2',  'ch6_gate_t3' ]],  // Gate 6: f-strings
};

// Tab labels for the challenge panel UI
// Used to render the tab headers: Challenge 1 | Challenge 2 | Challenge 3
window.ARIA_GAME.GATE_TAB_LABELS = {
    '42,26':  ['Node Record',   'Status Update', 'Name Fix'     ],
    '64,27':  ['Signal Message','Concatenation', 'String Fix'   ],
    '88,24':  ['Power Calc',    'Type Trap',     'Zero vs O'    ],
    '106,27': ['Status Board',  'Comparisons',   'Boolean Fix'  ],
    '128,24': ['Data Convert',  'Type Crash',    'Status String'],
    '148,27': ['Signal Report', 'Expressions',   'f-string Fix' ],
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
