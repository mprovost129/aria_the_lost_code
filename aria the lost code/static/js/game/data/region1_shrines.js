/**
 * ARIA: The Lost Code - Region 1 Shrine Data (Layer 10)
 *
 * Two learning shrines in the Origin Node map. Each shrine is identified
 * by its tile positions (cols × rows). When the player bumps a shrine tile,
 * _identifyShrine(col, row) in main.js matches against these positions and
 * opens the correct content.
 *
 * Tile positions from origin_node.js:
 *   Shrine 1 - cols 5–6, rows 3–4  (near Gate 1 / Gate 2)
 *   Shrine 2 - cols 9–10, rows 8–9 (near Gate 3)
 *
 * Topic sections use three types:
 *   { type: 'text', content: '…' }
 *   { type: 'code', content: '…' }   - rendered in a <pre>
 *   { type: 'list', items: ['…', '…'] }
 */

window.ARIA_GAME = window.ARIA_GAME || {};

window.ARIA_GAME.SHRINES = {

    // ── Shrine 1 ─────────────────────────────────────────────────────────
    shrine1: {
        id:         'shrine1',
        name:       'Shrine of Origins',
        aria_intro: 'A Learning Shrine. The basics are stored here - variables, types, conversions. Study before you approach the gates.',
        cols:       [5, 6],
        rows:       [3, 4],
        topics: [
            {
                id:    'variables',
                title: 'Variables & Assignment',
                sections: [
                    {
                        type:    'text',
                        content: 'A variable is a named container that holds a value. You create one with a name, an equals sign, and a value.',
                    },
                    {
                        type:    'code',
                        content:
`terminal_name = "Terminal A"
status = "online"
print(terminal_name, "is", status)
# → Terminal A is online`,
                    },
                    {
                        type:    'text',
                        content: 'Rules for variable names: start with a letter or underscore, no spaces, use underscores for multi-word names.',
                    },
                    {
                        type:  'list',
                        items: [
                            '<code>x = 10</code> - assigns the integer 10 to x',
                            '<code>name = "ARIA"</code> - assigns a string',
                            '<code>active = True</code> - assigns a boolean',
                            '<code>pi = 3.14</code> - assigns a float',
                        ],
                    },
                ],
            },

            {
                id:    'data-types',
                title: 'Data Types',
                sections: [
                    {
                        type:    'text',
                        content: 'Every value in Python has a type. The four types you need for Region 1:',
                    },
                    {
                        type:  'list',
                        items: [
                            '<code>str</code> - text wrapped in quotes: <code>"Hello"</code> or <code>\'Hello\'</code>',
                            '<code>int</code> - whole number, no quotes: <code>42</code>',
                            '<code>float</code> - decimal number: <code>3.14</code>',
                            '<code>bool</code> - either <code>True</code> or <code>False</code> (capital first letter)',
                        ],
                    },
                    {
                        type:    'code',
                        content:
`name    = "ARIA"   # str
power   = 100      # int
version = 1.0      # float
active  = True     # bool`,
                    },
                    {
                        type:    'text',
                        content: 'Use type() to check the type of any value: <code>print(type(name))</code> → <code>&lt;class \'str\'&gt;</code>',
                    },
                ],
            },

            {
                id:    'type-conversion',
                title: 'Type Conversion',
                sections: [
                    {
                        type:    'text',
                        content: 'You can convert between types using built-in functions. This is called casting.',
                    },
                    {
                        type:    'code',
                        content:
`x    = "42"       # str
y    = int(x)     # → 42     (int)
z    = float(x)   # → 42.0  (float)
back = str(y)     # → "42"  (str)`,
                    },
                    {
                        type:  'list',
                        items: [
                            '<code>int("5")</code> → <code>5</code>',
                            '<code>float("3.14")</code> → <code>3.14</code>',
                            '<code>str(100)</code> → <code>"100"</code>',
                            '<code>bool(0)</code> → <code>False</code>',
                            '<code>bool(1)</code> → <code>True</code>',
                        ],
                    },
                ],
            },
        ],
    },

    // ── Shrine 2 ─────────────────────────────────────────────────────────
    shrine2: {
        id:         'shrine2',
        name:       'Shrine of Expression',
        aria_intro: 'This shrine holds the language of expression. F-strings and lists. Gate 3 tests both. Study carefully.',
        cols:       [9, 10],
        rows:       [8, 9],
        topics: [
            {
                id:    'string-formatting',
                title: 'String Formatting - f-strings',
                sections: [
                    {
                        type:    'text',
                        content: 'An f-string lets you embed variable values inside a string. Add the letter <code>f</code> before the opening quote, then use <code>{curly braces}</code> to insert variables.',
                    },
                    {
                        type:    'code',
                        content:
`name    = "ARIA"
status  = "online"
message = f"{name} is now {status}"
print(message)   # → ARIA is now online`,
                    },
                    {
                        type:  'list',
                        items: [
                            'f-string starts with <code>f</code> before the opening quote',
                            '<code>{variable_name}</code> inserts the variable\'s value',
                            '<code>{2 + 2}</code> inserts <code>4</code> - any expression works',
                            'Works with single or double quotes: <code>f"..."</code> or <code>f\'...\'</code>',
                        ],
                    },
                    {
                        type:    'code',
                        content:
`node = "Alpha"
power = 87
print(f"Node: {node}, Power: {power}")
# → Node: Alpha, Power: 87`,
                    },
                ],
            },

            {
                id:    'lists',
                title: 'Lists',
                sections: [
                    {
                        type:    'text',
                        content: 'A list is an ordered, mutable sequence of values. Create one with square brackets.',
                    },
                    {
                        type:    'code',
                        content:
`nodes = ["Alpha", "Beta", "Gamma"]
print(nodes[0])    # → Alpha
print(nodes[2])    # → Gamma
nodes.append("Delta")
print(len(nodes))  # → 4`,
                    },
                    {
                        type:  'list',
                        items: [
                            'Index starts at <code>0</code>, not 1',
                            '<code>len(list)</code> returns the number of items',
                            '<code>list.append(x)</code> adds x to the end',
                            '<code>list[i]</code> accesses item at position i',
                            '<code>list[-1]</code> accesses the last item',
                        ],
                    },
                ],
            },
        ],
    },

};
