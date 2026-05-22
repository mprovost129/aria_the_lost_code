/**
 * ARIA: The Lost Code - Region 1 Shrine Data (Layer 10)
 *
 * Six learning shrines in the Origin Node map. Each shrine covers one focused
 * lesson from BIBLE Section XIV. When the player bumps a shrine tile,
 * _identifyShrine(col, row) in main.js matches against these positions and
 * opens the correct content.
 *
 * Shrine positions (origin_node.js):
 *   Shrine 1 (Variables):       cols  4– 5, rows  8– 9
 *   Shrine 2 (Strings):         cols 11–12, rows  5– 6
 *   Shrine 3 (Integers/Floats): cols 19–20, rows  5– 6
 *   Shrine 4 (Booleans):        cols 27–28, rows 12–13
 *   Shrine 5 (Type Conversion): cols 18–19, rows 14–15
 *   Shrine 6 (f-strings):       cols 10–11, rows 14–15
 *
 * Topic section types:
 *   { type: 'text', content: '…' }       — HTML supported
 *   { type: 'code', content: '…' }       — rendered in <pre>, HTML-escaped
 *   { type: 'list', items: ['…', '…'] }  — HTML supported in items
 */

window.ARIA_GAME = window.ARIA_GAME || {};

window.ARIA_GAME.SHRINES = {

    // ── Shrine 1: Variables and Assignment ───────────────────────────────────
    shrine1: {
        id:           'shrine1',
        name:         'Shrine of Variables',
        aria_intro:   'The terminals are dark because they have forgotten who they are. Learn to name things. Everything in code starts there.',
        aria_complete: 'Variable assignment confirmed. The terminals have names again. That is how all of this begins.',
        cols:       [4, 5],
        rows:       [8, 9],
        topics: [
            {
                id:    'variables-assignment',
                title: 'Variables and Assignment',
                sections: [
                    {
                        type:    'text',
                        content: 'Welcome to your first lesson. Everything you learn here is saved to your Tablet Library. You can come back and read it any time.',
                    },
                    {
                        type:    'text',
                        content: 'A <strong>variable</strong> is a named container that holds a piece of information. Think of it like a labeled box. You give the box a name, and you put a value inside it. Whenever you need that value, you use the name of the box.',
                    },
                    {
                        type:    'text',
                        content: 'In Python, you create a variable like this: write the name, then an equals sign, then the value. The equals sign means <em>store this</em>. It is not the same as the equals sign in maths.',
                    },
                    {
                        type:    'code',
                        content:
`terminal_name = "Terminal A"
status = "online"
print(terminal_name, "is", status)
# Output: Terminal A is online`,
                    },
                    {
                        type:    'text',
                        content: 'Once created, a variable can be used anywhere by writing its name. You can also change its value at any time. The new value replaces the old one.',
                    },
                    {
                        type:    'code',
                        content:
`status = "offline"
print(status)    # Output: offline
status = "online"
print(status)    # Output: online`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Naming Rules</strong> — Break these and Python will refuse to run.',
                    },
                    {
                        type:  'list',
                        items: [
                            'Start with a letter or underscore. Never a number.',
                            'Use only letters, numbers, and underscores. No spaces or hyphens.',
                            'Names are case sensitive — <code>status</code> and <code>Status</code> are different variables.',
                            'Use lowercase with underscores for multi-word names. This is called <strong>snake_case</strong>.',
                            'Choose descriptive names — <code>x</code> tells you nothing; <code>terminal_name</code> is clear.',
                        ],
                    },
                    {
                        type:    'code',
                        content:
`# Valid names:
terminal_name = "Terminal A"
region1 = "Origin Node"
_status = "online"

# These cause errors:
# 1terminal = "bad"      starts with a number
# terminal name = "bad"  space in name
# terminal-name = "bad"  hyphen not allowed`,
                    },
                    {
                        type:    'text',
                        content: 'Lines starting with <code>#</code> are <strong>comments</strong>. Python ignores them. They are notes for the programmer.',
                    },
                    {
                        type:    'text',
                        content: '<strong>Common Mistakes</strong>',
                    },
                    {
                        type:  'list',
                        items: [
                            '<strong>Forgetting the equals sign</strong> — <code>terminal_name</code> alone does nothing; you need <code>terminal_name = "..."</code>.',
                            '<strong>Space in the name</strong> — <code>terminal name</code> is two separate tokens. Use <code>terminal_name</code>.',
                            '<strong>Using a reserved word</strong> — <code>print</code>, <code>if</code>, <code>for</code>, <code>True</code> are claimed by Python.',
                            '<strong>= vs ==</strong> — A single <code>=</code> stores a value. Double <code>==</code> compares two values. They are completely different.',
                        ],
                    },
                    {
                        type:   'shrine_challenge',
                        prompt: 'The three terminals are dark because they have no identity. Fill in the missing values to restore them.',
                        starter:
`# Fill in the three missing values
terminal_id = ___
region = ___
is_operational = ___
print(terminal_id, "is in", region, "and operational:", is_operational)`,
                        hint: 'terminal_id and region need text values — wrap them in quote marks like "Terminal-A". is_operational needs True or False (capital T or F, no quotes).',
                        solution:
`# Fill in the three missing values
terminal_id = "Terminal-A"
region = "Origin Node"
is_operational = True
print(terminal_id, "is in", region, "and operational:", is_operational)`,
                        validation_code:
`assert isinstance(terminal_id, str), "terminal_id must be a string — wrap the value in quote marks"
assert isinstance(region, str), "region must be a string — wrap the value in quote marks"
assert isinstance(is_operational, bool), "is_operational must be True or False — capital T or F, no quotes"
print("__PASS__")`,
                    },
                ],
            },
        ],
    },

    // ── Shrine 2: Strings ─────────────────────────────────────────────────────
    shrine2: {
        id:           'shrine2',
        name:         'Shrine of Strings',
        aria_intro:   'Text. Strings. Quote marks. One of those things that looks simple until you forget to close the quote. Then nothing works and the error message is unhelpful. Study carefully.',
        aria_complete: 'Strings repaired. No unclosed quotes, no mismatched delimiters. The network can read the output now.',
        cols:       [11, 12],
        rows:       [5, 6],
        topics: [
            {
                id:    'strings',
                title: 'Strings',
                sections: [
                    {
                        type:    'text',
                        content: 'In Python, any piece of text is called a <strong>string</strong>. A string is a sequence of characters wrapped in quote marks. The quote marks are not part of the string — they tell Python where the string starts and ends.',
                    },
                    {
                        type:    'code',
                        content:
`message = "Hello, programmer"
print(message)
# Output: Hello, programmer`,
                    },
                    {
                        type:    'text',
                        content: 'You can use single quotes or double quotes. Both work. But you must <strong>open and close with the same kind</strong>.',
                    },
                    {
                        type:    'code',
                        content:
`message1 = "This uses double quotes"
message2 = 'This uses single quotes'
print(message1)
print(message2)`,
                    },
                    {
                        type:    'text',
                        content: 'A string can contain letters, numbers, spaces, punctuation, and symbols. Everything between the quote marks is part of the string.',
                    },
                    {
                        type:    'code',
                        content:
`node_id = "Origin-01"
signal  = "14.3 MHz"
message = "ARIA is back online!"
print(node_id)
print(signal)
print(message)`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Combining Strings</strong><br>You can join two strings together with the <code>+</code> sign. This is called <strong>concatenation</strong>. Concatenation joins strings exactly as they are — spaces are not added automatically.',
                    },
                    {
                        type:    'code',
                        content:
`first = "Origin"
second = " Node"
full_name = first + second
print(full_name)
# Output: Origin Node

# Without the space you get:
result = "Origin" + "Node"
print(result)
# Output: OriginNode`,
                    },
                    {
                        type:    'text',
                        content: '<strong>String Length</strong><br>Use <code>len()</code> to count the characters in a string. Every character counts, including spaces.',
                    },
                    {
                        type:    'code',
                        content:
`message = "Terminal A"
print(len(message))   # 10

region = "Origin Node"
print(len(region))    # 11`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Common Mistakes</strong>',
                    },
                    {
                        type:  'list',
                        items: [
                            '<strong>Forgetting the closing quote mark</strong> — Python keeps reading until it finds one or runs out of code. This causes a SyntaxError.',
                            '<strong>Mixing quote types</strong> — <code>"Hello\'</code> is an error. Open and close must match.',
                            '<strong>Maths with string numbers</strong> — <code>"10" + "20"</code> gives <code>"1020"</code>, not <code>30</code>. Quotes make it a string, not a number.',
                        ],
                    },
                    {
                        type:    'code',
                        content:
`a = "10"
b = "20"
print(a + b)
# Output: 1020  (string join, not addition)`,
                    },
                    {
                        type:   'shrine_challenge',
                        prompt: 'One terminal is displaying broken output. The strings have errors. Find them, fix them.',
                        starter:
`# Fix the errors in these strings
terminal_id = "Origin-01
location = 'Server Room"
message = terminal_id + " is located in " + location
print(message)`,
                        hint: 'Two errors: terminal_id is missing its closing double quote — add a " after Origin-01. location opens with a single quote but closes with a double quote — they must match.',
                        solution:
`# Fix the errors in these strings
terminal_id = "Origin-01"
location = "Server Room"
message = terminal_id + " is located in " + location
print(message)`,
                        validation_code:
`assert isinstance(message, str), "message must be a valid string — check your quote marks"
assert len(message) > 0, "message must not be empty"
print("__PASS__")`,
                    },
                ],
            },
        ],
    },

    // ── Shrine 3: Integers and Floats ─────────────────────────────────────────
    shrine3: {
        id:           'shrine3',
        name:         'Shrine of Numbers',
        aria_intro:   'Numbers. Two kinds. One without a decimal point, one with. Simple distinction with significant consequences. The letter O and the number zero look identical in most fonts. I mention this for reasons that will become apparent.',
        aria_complete: 'Integer and float, correct types, actual math working. The power systems are responding. Good.',
        cols:       [19, 20],
        rows:       [5, 6],
        topics: [
            {
                id:    'integers-floats',
                title: 'Integers and Floats',
                sections: [
                    {
                        type:    'text',
                        content: 'Python has two main types of numbers. An <strong>integer</strong> (<code>int</code>) is a whole number — no decimal point, no quote marks, just the number. A <strong>float</strong> (<code>float</code>) is a number with a decimal point.',
                    },
                    {
                        type:    'code',
                        content:
`# Integers - whole numbers
power_level   = 100
region_number = 1
error_count   = 0
temperature   = -12

# Floats - decimal numbers
signal_strength = 14.3
version         = 1.0
completion      = 87.5
temperature     = -2.5`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Arithmetic</strong><br>Numbers can be used in calculations. Python supports all basic arithmetic. Notice that regular division always produces a float, even when the answer divides evenly.',
                    },
                    {
                        type:    'code',
                        content:
`a = 100
b = 25
print(a + b)    # 125   addition
print(a - b)    # 75    subtraction
print(a * b)    # 2500  multiplication
print(a / b)    # 4.0   division (always float)
print(a // b)   # 4     floor division (drops decimal)
print(a % b)    # 0     modulo (remainder)
print(a ** 2)   # 10000 exponent`,
                    },
                    {
                        type:    'text',
                        content: 'You can mix integers and floats in calculations. Python handles the conversion automatically.',
                    },
                    {
                        type:    'code',
                        content:
`power      = 100
efficiency = 0.85
actual     = power * efficiency
print(actual)   # 85.0`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Numbers Are Not Strings</strong><br>This is critical. A number and a string that <em>looks</em> like a number are completely different things. Quote marks make it a string.',
                    },
                    {
                        type:    'code',
                        content:
`a = 10      # integer
b = "10"    # string

print(a + a)   # 20   (maths)
print(b + b)   # 1010 (string join)`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Common Mistakes</strong>',
                    },
                    {
                        type:  'list',
                        items: [
                            '<strong>Putting a number in quotes</strong> — <code>power = "100"</code> is a string. You cannot do maths with it.',
                            '<strong>The letter O vs the number zero</strong> — <code>10O</code> is not <code>100</code>. In most fonts they look identical. Look carefully at every character.',
                            '<strong>Mixing a number and a string</strong> — <code>"Level: " + 5</code> raises a TypeError. Convert the number first: <code>"Level: " + str(5)</code>.',
                        ],
                    },
                    {
                        type:    'code',
                        content:
`count = 10O    # Wrong: last character is letter O
count = 100    # Correct: three digits

power = 100
label = "Power: "
# This causes TypeError:
# print(label + power)
# Convert first:
print(label + str(power))   # Power: 100`,
                    },
                    {
                        type:   'shrine_challenge',
                        prompt: 'The power systems need values before the terminals can reboot. Fill in the missing values and complete the calculation.',
                        starter:
`# Fill in the missing values
max_power      = ___     # integer greater than zero
efficiency     = ___     # float between 0.0 and 1.0
regions_online = ___     # integer greater than zero

actual_power     = max_power * efficiency
power_per_region = actual_power / regions_online
print(actual_power)
print(power_per_region)`,
                        hint: 'Integers are whole numbers with no decimal: max_power = 200. Floats need a decimal point: efficiency = 0.75. regions_online is another whole number: regions_online = 4.',
                        solution:
`# Fill in the missing values
max_power      = 200
efficiency     = 0.75
regions_online = 4

actual_power     = max_power * efficiency
power_per_region = actual_power / regions_online
print(actual_power)
print(power_per_region)`,
                        validation_code:
`assert isinstance(max_power, int), "max_power must be an integer — no decimal point, e.g. 200"
assert max_power > 0, "max_power must be greater than zero"
assert isinstance(efficiency, float), "efficiency must be a float — include a decimal point, e.g. 0.75"
assert 0.0 < efficiency <= 1.0, "efficiency must be between 0.0 and 1.0"
assert isinstance(regions_online, int), "regions_online must be an integer — no decimal point"
assert regions_online > 0, "regions_online must be greater than zero"
print("__PASS__")`,
                    },
                ],
            },
        ],
    },

    // ── Shrine 4: Booleans ────────────────────────────────────────────────────
    shrine4: {
        id:           'shrine4',
        name:         'Shrine of Booleans',
        aria_intro:   'True or False. Exactly two options. No middle ground, no maybe, no it depends. I find this deeply satisfying. You will too once you understand how much of programming comes down to yes or no.',
        aria_complete: 'Boolean states confirmed. True and False, not maybe. The status board is reading correctly.',
        cols:       [27, 28],
        rows:       [12, 13],
        topics: [
            {
                id:    'booleans',
                title: 'Booleans',
                sections: [
                    {
                        type:    'text',
                        content: 'A <strong>boolean</strong> (<code>bool</code>) has exactly two possible values: <code>True</code> or <code>False</code>. That is it. Nothing else. Think of it like a switch — on or off, connected or not, active or inactive.',
                    },
                    {
                        type:    'code',
                        content:
`is_active             = True
backup_running        = False
connection_established = True
has_errors            = False
print(is_active)               # True
print(backup_running)          # False`,
                    },
                    {
                        type:    'text',
                        content: 'The capital letter on <code>True</code> and <code>False</code> is <strong>not optional</strong>. Python is case sensitive. Writing <code>true</code> in lowercase is not a boolean — Python will look for a variable called <code>true</code> and when it cannot find one it will raise a NameError.',
                    },
                    {
                        type:    'code',
                        content:
`# Correct:
is_active = True
is_active = False

# These cause NameError:
# is_active = true
# is_active = false
# is_active = TRUE`,
                    },
                    {
                        type:    'text',
                        content: '<strong>What Booleans Are Used For</strong><br>Booleans are the language of decisions in programming. Every yes/no question is a boolean. Region 2 will show how booleans drive conditions (<code>if</code> statements). Here is a preview — you do not need to fully understand it yet:',
                    },
                    {
                        type:    'code',
                        content:
`is_active = True
if is_active:
    print("Terminal is online")
else:
    print("Terminal is offline")
# Output: Terminal is online
# Change is_active to False and run again.`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Booleans from Comparisons</strong><br>You can produce a boolean by comparing two values. Python evaluates the comparison and gives you <code>True</code> or <code>False</code>.',
                    },
                    {
                        type:    'code',
                        content:
`power   = 100
minimum = 50
print(power > minimum)    # True
print(power < minimum)    # False
print(power == minimum)   # False  (double equals: comparison)
print(power != minimum)   # True   (not equal)`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Common Mistakes</strong>',
                    },
                    {
                        type:  'list',
                        items: [
                            '<strong>Lowercase true or false</strong> — Always <code>True</code> and <code>False</code> with capital first letter.',
                            '<strong>= vs ==</strong> — A single <code>=</code> stores a value. Double <code>==</code> compares two values. <code>power = 50</code> changes power. <code>power == 50</code> checks if power equals 50.',
                            '<strong>0 and False are different types</strong> — Python treats them similarly in some contexts but they are not the same. Use <code>True</code>/<code>False</code> for yes/no states, not <code>1</code>/<code>0</code>.',
                        ],
                    },
                    {
                        type:   'shrine_challenge',
                        prompt: 'The status board needs to be completed. Each system needs a boolean status.',
                        starter:
`# Complete the status board
power_system       = ___
cooling_system     = ___
backup_generator   = ___
network_connection = ___
print("Power:",   power_system)
print("Cooling:", cooling_system)
print("Backup:",  backup_generator)
print("Network:", network_connection)`,
                        hint: 'Assign True or False to each variable — capital T or F, no quote marks. The values are up to you. Any combination of True/False is accepted.',
                        solution:
`# Complete the status board
power_system       = True
cooling_system     = True
backup_generator   = False
network_connection = True
print("Power:",   power_system)
print("Cooling:", cooling_system)
print("Backup:",  backup_generator)
print("Network:", network_connection)`,
                        validation_code:
`assert isinstance(power_system, bool), "power_system must be True or False — capital T or F, no quotes"
assert isinstance(cooling_system, bool), "cooling_system must be True or False"
assert isinstance(backup_generator, bool), "backup_generator must be True or False"
assert isinstance(network_connection, bool), "network_connection must be True or False"
print("__PASS__")`,
                    },
                ],
            },
        ],
    },

    // ── Shrine 5: Type Conversion ─────────────────────────────────────────────
    shrine5: {
        id:           'shrine5',
        name:         'Shrine of Conversion',
        aria_intro:   'Type conversion. This is where the four data types stop being separate silos and start working together. Also where most beginner bugs are born. Read this one carefully.',
        aria_complete: 'Type conversion complete. Data arriving clean, calculations running. That one required actual understanding.',
        cols:       [18, 19],
        rows:       [14, 15],
        topics: [
            {
                id:    'type-conversion',
                title: 'Type Conversion',
                sections: [
                    {
                        type:    'text',
                        content: 'You now know four data types: strings, integers, floats, and booleans. Each type has rules about what you can do with it. Sometimes you need to <strong>convert</strong> a value from one type to another. This is called <strong>type conversion</strong>.',
                    },
                    {
                        type:    'text',
                        content: 'Consider this: a terminal sends you its power level as text: <code>"87"</code>. You want to do maths with it.',
                    },
                    {
                        type:    'code',
                        content:
`power_text = "87"
boosted = power_text + 10
print(boosted)
# TypeError: can only concatenate str (not "int") to str`,
                    },
                    {
                        type:    'text',
                        content: 'Python stops because you cannot add a string and an integer. The fix is to explicitly convert the string to an integer first.',
                    },
                    {
                        type:    'code',
                        content:
`power_text   = "87"
power_number = int(power_text)    # convert str → int
boosted      = power_number + 10
print(boosted)    # 97`,
                    },
                    {
                        type:    'text',
                        content: '<strong>The Four Conversion Functions</strong>',
                    },
                    {
                        type:    'code',
                        content:
`# str() - converts anything to a string
print(str(100))     # "100"
print(str(True))    # "True"

# int() - converts to a whole number (truncates floats)
print(int("42"))    # 42
print(int(3.99))    # 3  (not rounded, truncated)

# float() - converts to a decimal number
print(float(5))     # 5.0
print(float("3.14"))# 3.14

# bool() - converts to True or False
print(bool(0))      # False  (zero is False)
print(bool(1))      # True   (non-zero is True)
print(bool(""))     # False  (empty string is False)
print(bool("hi"))   # True   (non-empty is True)`,
                    },
                    {
                        type:    'text',
                        content: '<strong>When Conversion Fails</strong><br>You can only convert a string to a number if the string actually looks like a number. Otherwise Python raises a ValueError.',
                    },
                    {
                        type:    'code',
                        content:
`print(int("42"))       # 42 - works
print(int("hello"))    # ValueError - "hello" is not a number
print(float("3.14"))   # 3.14 - works
print(float("ARIA"))   # ValueError - not a number`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Checking the Type</strong><br>Use <code>type()</code> to see what type a value actually is. Even though <code>42</code>, <code>"42"</code>, and <code>42.0</code> all look similar, Python sees them as three completely different types.',
                    },
                    {
                        type:    'code',
                        content:
`a = 42
b = "42"
c = 42.0
d = True
print(type(a))    # <class 'int'>
print(type(b))    # <class 'str'>
print(type(c))    # <class 'float'>
print(type(d))    # <class 'bool'>`,
                    },
                    {
                        type:   'shrine_challenge',
                        prompt: 'Data arrived from the network in the wrong types. Convert each value to the correct type so the calculations work.',
                        starter:
`# Values arrived in the wrong type
power_raw   = "95"    # should be int
version_raw = 2       # should be float
signal_raw  = "14.7"  # should be float

# Convert each to the correct type
power   = ___
version = ___
signal  = ___

# These calculations must work after conversion
total         = power + 5
full_version  = version + 0.1
strong_signal = signal > 10.0
print(total)
print(full_version)
print(strong_signal)`,
                        hint: 'Use int() to convert a string to an integer: int("95") gives 95. Use float() to convert to decimal: float(2) gives 2.0, float("14.7") gives 14.7.',
                        solution:
`# Values arrived in the wrong type
power_raw   = "95"
version_raw = 2
signal_raw  = "14.7"

# Convert each to the correct type
power   = int(power_raw)
version = float(version_raw)
signal  = float(signal_raw)

# These calculations must work after conversion
total         = power + 5
full_version  = version + 0.1
strong_signal = signal > 10.0
print(total)
print(full_version)
print(strong_signal)`,
                        validation_code:
`assert isinstance(power, int), "power must be converted to int — use int(power_raw)"
assert isinstance(version, float), "version must be converted to float — use float(version_raw)"
assert isinstance(signal, float), "signal must be converted to float — use float(signal_raw)"
assert power + 5 == 100, "power has the wrong value after conversion — int('95') should give 95"
assert abs(full_version - 2.1) < 0.001, "full_version is wrong — float(2) + 0.1 should give 2.1"
print("__PASS__")`,
                    },
                ],
            },
        ],
    },

    // ── Shrine 6: f-strings and String Formatting ─────────────────────────────
    shrine6: {
        id:           'shrine6',
        name:         'Shrine of Expression',
        aria_complete: 'f-string formatted correctly. All four values in the output. ARIA signal strength is improving.',
        aria_intro: 'You have learned to store things. Now learn to say them clearly. A terminal that cannot communicate is just an expensive box. Gate 3 will ask you to write my announcement. Make it sound good.',
        cols:       [10, 11],
        rows:       [14, 15],
        topics: [
            {
                id:    'fstrings',
                title: 'f-strings and String Formatting',
                sections: [
                    {
                        type:    'text',
                        content: 'You know how to store values and how to print them. But combining variables with text in a single readable message is awkward with basic concatenation. An <strong>f-string</strong> is the clean solution.',
                    },
                    {
                        type:    'text',
                        content: 'Here is the problem with concatenation for multi-variable messages:',
                    },
                    {
                        type:    'code',
                        content:
`terminal = "Terminal A"
status   = "online"
power    = 100
# Works but awkward — plus signs everywhere, manual str() conversion:
print("Terminal: " + terminal + " Status: " + status + " Power: " + str(power))`,
                    },
                    {
                        type:    'text',
                        content: '<strong>What Is an f-string?</strong><br>An f-string is a string with a lowercase <code>f</code> placed immediately before the opening quote. Inside the string, wrap any variable name in <code>{curly braces}</code> and Python will insert its value automatically.',
                    },
                    {
                        type:    'code',
                        content:
`terminal = "Terminal A"
status   = "online"
power    = 100
message  = f"Terminal: {terminal} Status: {status} Power: {power}"
print(message)
# Output: Terminal: Terminal A Status: online Power: 100`,
                    },
                    {
                        type:    'text',
                        content: 'The <code>f</code> tells Python: this is a formatted string. When Python sees <code>{variable}</code> inside it, it evaluates the variable and inserts the value. No <code>+</code> signs. No <code>str()</code> calls.',
                    },
                    {
                        type:    'text',
                        content: '<strong>Multiple Variables and Expressions</strong><br>Any valid Python expression works inside the curly braces — not just variable names.',
                    },
                    {
                        type:    'code',
                        content:
`name   = "ARIA"
region = "Origin Node"
signal = 14.3
active = True
print(f"{name} is operating in {region}")
print(f"Signal strength: {signal}")
print(f"System active: {active}")

# Expressions work too:
max_power  = 200
efficiency = 0.85
print(f"Actual power: {max_power * efficiency}")
# Output: Actual power: 170.0`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Number Formatting</strong><br>Control how numbers look by adding a format specifier after the variable name, separated by a colon.',
                    },
                    {
                        type:    'code',
                        content:
`signal     = 14.3456789
completion = 0.875
print(f"Signal: {signal:.2f}")       # Signal: 14.35
print(f"Complete: {completion:.1%}") # Complete: 87.5%`,
                    },
                    {
                        type:    'text',
                        content: '<strong>Common Mistakes</strong>',
                    },
                    {
                        type:  'list',
                        items: [
                            '<strong>Forgetting the f</strong> — Without the <code>f</code> before the quote, the curly braces print literally as text instead of inserting the variable.',
                            '<strong>Quotes around the variable name</strong> — <code>{"name"}</code> inserts the literal text <em>name</em>, not the value of the variable.',
                            '<strong>Misspelling inside the braces</strong> — Python raises a NameError if it cannot find a variable with that exact spelling.',
                        ],
                    },
                    {
                        type:    'code',
                        content:
`name = "ARIA"
# Without f — curly braces are literal:
print("{name} is online")      # {name} is online
# With f — value is inserted:
print(f"{name} is online")     # ARIA is online

# Misspelling causes NameError:
# print(f"{nme} is online")    NameError: nme
# Correct spelling:
print(f"{name} is online")     # ARIA is online`,
                    },
                    {
                        type:   'shrine_challenge',
                        prompt: 'The main display terminal needs a status report written as one formatted message. You have all the variables. Write the f-string.',
                        starter:
`# Variables already set - do not change these
node_name        = "Origin Node"
terminals_online = 3
signal_strength  = 14.3
aria_status      = "reconnecting"

# Write ONE f-string that includes all four variables
report = ___
print(report)`,
                        hint: 'An f-string starts with f before the opening quote: report = f"...". Put each variable name inside curly braces to include its value: {node_name}, {terminals_online}, {signal_strength}, {aria_status}.',
                        solution:
`# Variables already set - do not change these
node_name        = "Origin Node"
terminals_online = 3
signal_strength  = 14.3
aria_status      = "reconnecting"

# Write ONE f-string that includes all four variables
report = f"Node: {node_name} | Online: {terminals_online} | Signal: {signal_strength} | Status: {aria_status}"
print(report)`,
                        validation_code:
`assert isinstance(report, str), "report must be a string"
assert "Origin Node" in report, "report must include the value of node_name"
assert str(terminals_online) in report, "report must include the value of terminals_online"
assert str(signal_strength) in report, "report must include the value of signal_strength"
assert aria_status in report, "report must include the value of aria_status"
print("__PASS__")`,
                    },
                ],
            },
        ],
    },

};
