"""
Management command: load_region1

Populates the database with Region 1 (The Origin Node) content:
  - Region record
  - 2 Learning Shrines with their ShrineTopic records
  - 8 Challenges (gates, boss bug, boss chamber)

Run once after migrations:
    python manage.py load_region1

Re-running is safe — uses get_or_create throughout, then updates
fields in-place via save(). Run again any time challenge text changes.
"""

from django.core.management.base import BaseCommand
from django.db import transaction

from game.models import Challenge, LearningShrine, Region, ShrineTopic


# ---------------------------------------------------------------------------
# Region 1 master record
# ---------------------------------------------------------------------------

REGION_1 = {
    'name':                'The Origin Node',
    'slug':                'origin-node',
    'concept':             'Variables and Data Types',
    'order':               1,
    'description': (
        'The first region. A dark, half-alive grid of data terminals and broken gates. '
        'Restore signal by solving Python challenges about variables, data types, '
        'string formatting, and type conversion.'
    ),
    'aria_tagline':        'Signal lost. Origin Node offline. Restore the connection.',
    'visual_theme':        'origin',
    'unlocked_by_default': True,
}


# ---------------------------------------------------------------------------
# Learning Shrines
# ---------------------------------------------------------------------------

SHRINES = [
    {
        'name':  'Shrine of Origins',
        'order': 1,
        'topics': [
            {
                'order': 1,
                'title': 'Variables & Assignment',
                'content': (
                    '## Variables & Assignment\n\n'
                    'A variable is a named storage container. '
                    'You create one by writing a name, an equals sign (`=`), and a value.\n\n'
                    'Variable names must start with a letter or underscore. '
                    'No spaces — use underscores for multi-word names.\n\n'
                    '```python\n'
                    'terminal_name = "Terminal A"\n'
                    'status = "online"\n'
                    'print(terminal_name, "is", status)\n'
                    '# → Terminal A is online\n'
                    '```'
                ),
                'code_example': (
                    'terminal_name = "Terminal A"\n'
                    'status = "online"\n'
                    'print(terminal_name, "is", status)'
                ),
            },
            {
                'order': 2,
                'title': 'Data Types',
                'content': (
                    '## Data Types\n\n'
                    'Every value in Python has a type. The four you need for Region 1:\n\n'
                    '- **str** — text, wrapped in quotes: `"Hello"` or `\'Hello\'`\n'
                    '- **int** — whole number, no quotes: `42`\n'
                    '- **float** — decimal number: `3.14`\n'
                    '- **bool** — either `True` or `False` (capital first letter)\n\n'
                    '```python\n'
                    'name    = "ARIA"   # str\n'
                    'power   = 100      # int\n'
                    'version = 1.0      # float\n'
                    'active  = True     # bool\n'
                    '```'
                ),
                'code_example': (
                    'name    = "ARIA"   # str\n'
                    'power   = 100      # int\n'
                    'version = 1.0      # float\n'
                    'active  = True     # bool\n'
                    'print(type(name), type(power), type(version), type(active))'
                ),
            },
            {
                'order': 3,
                'title': 'Type Conversion',
                'content': (
                    '## Type Conversion\n\n'
                    'You can convert between types using built-in functions. '
                    'This is called **casting**.\n\n'
                    '```python\n'
                    'x    = "42"       # str\n'
                    'y    = int(x)     # → 42    (int)\n'
                    'z    = float(x)   # → 42.0  (float)\n'
                    'back = str(y)     # → "42"  (str)\n'
                    '```\n\n'
                    'Common conversions:\n'
                    '- `int("5")` → `5`\n'
                    '- `float("3.14")` → `3.14`\n'
                    '- `str(100)` → `"100"`\n'
                    '- `bool(0)` → `False`\n'
                ),
                'code_example': (
                    'x = "42"\n'
                    'y = int(x)\n'
                    'z = float(x)\n'
                    'print(y, type(y))\n'
                    'print(z, type(z))'
                ),
            },
        ],
    },
    {
        'name':  'Shrine of Expression',
        'order': 2,
        'topics': [
            {
                'order': 1,
                'title': 'String Formatting — f-strings',
                'content': (
                    '## String Formatting — f-strings\n\n'
                    'An f-string lets you embed variable values directly inside a string. '
                    'Start the string with the letter `f`, then use `{curly braces}` '
                    'to insert variables.\n\n'
                    '```python\n'
                    'name    = "ARIA"\n'
                    'status  = "online"\n'
                    'message = f"{name} is now {status}"\n'
                    'print(message)   # → ARIA is now online\n'
                    '```\n\n'
                    'Rules:\n'
                    '- f-string starts with `f` before the opening quote\n'
                    '- `{variable_name}` inserts the variable\'s value\n'
                    '- Any Python expression works inside `{}`\n'
                    '- Works with single or double quotes: `f"..."` or `f\'...\'`\n'
                ),
                'code_example': (
                    'name   = "ARIA"\n'
                    'status = "online"\n'
                    'print(f"{name} is now {status}")'
                ),
            },
            {
                'order': 2,
                'title': 'Lists',
                'content': (
                    '## Lists\n\n'
                    'A list is an ordered, mutable sequence of values. '
                    'Create one with square brackets.\n\n'
                    '```python\n'
                    'nodes = ["Alpha", "Beta", "Gamma"]\n'
                    'print(nodes[0])    # → Alpha\n'
                    'print(nodes[2])    # → Gamma\n'
                    'nodes.append("Delta")\n'
                    'print(len(nodes))  # → 4\n'
                    '```\n\n'
                    '- Index starts at `0`, not 1\n'
                    '- `len(list)` returns the number of items\n'
                    '- `list.append(x)` adds x to the end\n'
                    '- `list[i]` accesses item at position i\n'
                ),
                'code_example': (
                    'nodes = ["Alpha", "Beta", "Gamma"]\n'
                    'print(nodes[0])\n'
                    'nodes.append("Delta")\n'
                    'print(len(nodes))'
                ),
            },
        ],
    },
]


# ---------------------------------------------------------------------------
# Challenge data
# ---------------------------------------------------------------------------

CHALLENGES = [
    # ── GATE 1 ──────────────────────────────────────────────────────────────
    {
        'order':          1,
        'title':          'Power Up Terminal A',
        'challenge_type': Challenge.TYPE_FILL_BLANK,
        'category':       Challenge.CATEGORY_GATE,
        'difficulty':     Challenge.DIFFICULTY_BEGINNER,
        'prompt_code': (
            'terminal_name = ___\n'
            'status = ___\n'
            'print(terminal_name, "is", status)'
        ),
        'solution_code': (
            'terminal_name = "Terminal A"\n'
            'status = "online"\n'
            'print(terminal_name, "is", status)'
        ),
        'expected_output':   'Terminal A is online',
        'hint_text':         'Every terminal needs a name and a status. Assign them as text values.',
        'lesson_reference':  'Code Library: Strings and Variable Assignment',
        'aria_intro':        'The terminal is dark because it has no identity. Give it a name and tell it what it is.',
        'aria_hint':         'Strings need quotes around them. "Terminal A" is a string. "online" is a string.',
        'aria_success':      "Terminal A is online. That's one down. Keep moving.",
        'aria_fail':         'Something is wrong. Check your quotes. Strings need to be wrapped in quote marks.',
    },
    {
        'order':          2,
        'title':          'Power Up Terminal B',
        'challenge_type': Challenge.TYPE_FILL_BLANK,
        'category':       Challenge.CATEGORY_GATE,
        'difficulty':     Challenge.DIFFICULTY_BEGINNER,
        'prompt_code': (
            'power_level = ___\n'
            'is_active = ___\n'
            'print("Power:", power_level, "Active:", is_active)'
        ),
        'solution_code': (
            'power_level = 100\n'
            'is_active = True\n'
            'print("Power:", power_level, "Active:", is_active)'
        ),
        'expected_output':   'Power: 100 Active: True',
        'hint_text':         'Power level is a whole number. Active status is either True or False.',
        'lesson_reference':  'Code Library: Integers, Booleans',
        'aria_intro':        'Numbers for quantities. True or False for states. Keep it simple.',
        'aria_hint':         'An integer has no quotes. A boolean is exactly True or False — capital T or F.',
        'aria_success':      'Both terminals online. Gate 1 is open. Good work.',
        'aria_fail':         'Not quite. Remember: integers have no quotes, and True needs a capital T.',
    },

    # ── GATE 2 ──────────────────────────────────────────────────────────────
    {
        'order':          3,
        'title':          'Identify the Data Types',
        'challenge_type': Challenge.TYPE_FILL_BLANK,
        'category':       Challenge.CATEGORY_GATE,
        'difficulty':     Challenge.DIFFICULTY_BEGINNER,
        'prompt_code': (
            'programmer_name = ___\n'
            'years_coding = ___\n'
            'has_coffee = ___\n'
            'favorite_number = ___'
        ),
        'solution_code': (
            'programmer_name = "Ada"\n'
            'years_coding = 5\n'
            'has_coffee = True\n'
            'favorite_number = 3.14'
        ),
        'expected_output':   '',
        'hint_text':         'One of each type: string, integer, boolean, and float.',
        'lesson_reference':  'Code Library: All Data Types',
        'aria_intro':        'Four variables. Four types. You know all of them. Do not overthink it.',
        'aria_hint':         'String needs quotes. Integer is a whole number. Boolean is True or False. Float has a decimal point.',
        'aria_success':      'Four types, all correct. You know the basics. Moving on.',
        'aria_fail':         'Check your types. String: quotes. Integer: no quotes, whole number. Boolean: True or False. Float: decimal.',
    },
    {
        'order':          4,
        'title':          'Fix the Broken Variable',
        'challenge_type': Challenge.TYPE_BUG_FIX,
        'category':       Challenge.CATEGORY_GATE,
        'difficulty':     Challenge.DIFFICULTY_BEGINNER,
        'prompt_code': (
            'node_id = "Origin-01\n'
            'power = 10O\n'
            'is_connected = true'
        ),
        'solution_code': (
            'node_id = "Origin-01"\n'
            'power = 100\n'
            'is_connected = True'
        ),
        'expected_output':   '',
        'hint_text':         'Three errors. One is a missing closing quote. One is a letter O instead of zero. One is wrong capitalisation.',
        'lesson_reference':  'Code Library: Variable Assignment',
        'aria_intro':        'Something is wrong on every line. Find all three before you submit.',
        'aria_hint':         'Line 1: the string needs a closing quote mark. Line 2: that O is not a zero. Line 3: Python booleans are capitalised.',
        'aria_success':      'All three fixed. That is exactly how bugs hide — one per line, waiting.',
        'aria_fail':         'Still broken somewhere. Check all three lines. Closing quote, zero vs letter O, capital True.',
    },

    # ── GATE 3 ──────────────────────────────────────────────────────────────
    {
        'order':          5,
        'title':          'String Formatting',
        'challenge_type': Challenge.TYPE_FILL_BLANK,
        'category':       Challenge.CATEGORY_GATE,
        'difficulty':     Challenge.DIFFICULTY_BEGINNER,
        'prompt_code': (
            'name = "ARIA"\n'
            'status = "online"\n'
            'message = ___\n'
            'print(message)'
        ),
        'solution_code': (
            'name = "ARIA"\n'
            'status = "online"\n'
            'message = f"{name} is now {status}"\n'
            'print(message)'
        ),
        'expected_output':   'ARIA is now online',
        'hint_text':         'Use an f-string to combine the name and status into one message.',
        'lesson_reference':  'Code Library: String Formatting',
        'aria_intro':        'I need you to announce my return. Make it sound good.',
        'aria_hint':         'An f-string starts with f and uses curly braces to insert variable values. f"{name} is now {status}"',
        'aria_success':      'Perfect. ARIA is now online. That is the most satisfying output I have ever seen.',
        'aria_fail':         'Not quite. You need an f-string. Start with the letter f before the opening quote, then use {name} and {status} inside.',
    },

    # ── ROAMING BUG ─────────────────────────────────────────────────────────
    {
        'order':          6,
        'title':          'Syntax Gnat',
        'challenge_type': Challenge.TYPE_BUG_FIX,
        'category':       Challenge.CATEGORY_ROAMING_BUG,
        'difficulty':     Challenge.DIFFICULTY_BEGINNER,
        'prompt_code': (
            'greeting = "Hello World\n'
            'print(greeting)'
        ),
        'solution_code': (
            'greeting = "Hello World"\n'
            'print(greeting)'
        ),
        'expected_output':   'Hello World',
        'hint_text':         'A closing quote mark is missing.',
        'lesson_reference':  'Code Library: Variable Assignment',
        'aria_intro':        'Syntax Gnat. Missing quote mark. Squash it fast.',
        'aria_hint':         'The string "Hello World needs a closing quotation mark at the end.',
        'aria_success':      'Squashed. One Chance Fragment earned.',
        'aria_fail':         'Still broken. Find the unclosed string.',
    },

    # ── BOSS BUG ────────────────────────────────────────────────────────────
    {
        'order':          7,
        'title':          'Boss Bug — Gate to Boss Chamber',
        'challenge_type': Challenge.TYPE_BUG_FIX,
        'category':       Challenge.CATEGORY_BOSS_BUG,
        'difficulty':     Challenge.DIFFICULTY_INTERMEDIATE,
        'prompt_code': (
            'node_name = Origin Node\n'
            'power_remaining = "87"\n'
            'backup_active = False\n'
            'print(f"Node: {node_name}, Power: {power_remaining}")'
        ),
        'solution_code': (
            'node_name = "Origin Node"\n'
            'power_remaining = 87\n'
            'backup_active = False\n'
            'print(f"Node: {node_name}, Power: {power_remaining}")'
        ),
        'expected_output':   'Node: Origin Node, Power: 87',
        'hint_text':         'Two errors. One value is missing quotes. One value has the wrong type.',
        'lesson_reference':  'Code Library: Region 1 — All Concepts',
        'aria_intro':        'This one has two errors hiding in it. Take your time. We are close to the Boss Chamber.',
        'aria_hint':         'node_name needs quote marks — it is a string. power_remaining should be the integer 87, not the string "87".',
        'aria_success':      'Both errors found. Full Chance restoration. The Boss Chamber is open.',
        'aria_fail':         'Two errors, not one. Look at both the name and the power level carefully.',
    },

    # ── BOSS CHALLENGE ───────────────────────────────────────────────────────
    {
        'order':          8,
        'title':          'Who Are You — Boss Challenge',
        'challenge_type': Challenge.TYPE_BOSS,
        'category':       Challenge.CATEGORY_BOSS_CHAMBER,
        'difficulty':     Challenge.DIFFICULTY_INTERMEDIATE,
        'prompt_code': (
            '# Your name as a string\n'
            'your_name = ___\n\n'
            '# Your age as an integer\n'
            'your_age = ___\n\n'
            '# Are you a programmer? True or False\n'
            'is_programmer = ___\n\n'
            '# Your version number as a float\n'
            'version = ___\n\n'
            '# Print a summary using an f-string\n'
            'print(___)'
        ),
        'solution_code': (
            'your_name     = "Ada"\n'
            'your_age      = 30\n'
            'is_programmer = True\n'
            'version       = 1.0\n'
            'print(f"I am {your_name}, age {your_age}, programmer: {is_programmer}, v{version}")'
        ),
        'expected_output':   '',
        'hint_text':         'All four data types. String, integer, boolean, float. Then an f-string that uses at least two of the variables.',
        'lesson_reference':  'Code Library: Region 1 — All Concepts',
        'aria_intro':        'Tell the system who you are. All of it. This is how we prove you belong here.',
        'aria_hint':         'Four variables, one f-string. The f-string should reference at least your_name and one other variable.',
        'aria_success':      'The Origin Node is restored. Signal expanding. Region 2 unlocked. We are just getting started.',
        'aria_fail':         'Not complete yet. All four types, and an f-string with at least two variables inside curly braces.',
    },
]


# ---------------------------------------------------------------------------
# Command
# ---------------------------------------------------------------------------

class Command(BaseCommand):
    help = 'Load Region 1 (The Origin Node) content into the database.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--reset',
            action='store_true',
            help='Delete all Region 1 content before reloading. USE WITH CARE.',
        )

    @transaction.atomic
    def handle(self, *args, **options):
        if options['reset']:
            Region.objects.filter(order=1).delete()
            self.stdout.write(self.style.WARNING('Region 1 data deleted.'))

        # ── Region ──────────────────────────────────────────────────────────
        region, created = Region.objects.get_or_create(
            slug=REGION_1['slug'],
            defaults=REGION_1,
        )
        if not created:
            for field, value in REGION_1.items():
                setattr(region, field, value)
            region.save()
        verb = 'Created' if created else 'Updated'
        self.stdout.write(f'{verb} Region 1: {region}')

        # ── Shrines ──────────────────────────────────────────────────────────
        for shrine_data in SHRINES:
            topics_data = shrine_data.pop('topics')
            shrine, created = LearningShrine.objects.get_or_create(
                region=region,
                name=shrine_data['name'],
                defaults={'order': shrine_data['order']},
            )
            shrine.order = shrine_data['order']
            shrine.save()
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'  {verb} shrine: {shrine.name}')

            for topic_data in topics_data:
                topic, created = ShrineTopic.objects.get_or_create(
                    shrine=shrine,
                    title=topic_data['title'],
                    defaults=topic_data,
                )
                if not created:
                    for field, value in topic_data.items():
                        setattr(topic, field, value)
                    topic.save()
                verb = 'Created' if created else 'Updated'
                self.stdout.write(f'    {verb} topic: {topic.title}')

            shrine_data['topics'] = topics_data   # restore for idempotency

        # ── Challenges ───────────────────────────────────────────────────────
        for ch_data in CHALLENGES:
            challenge, created = Challenge.objects.get_or_create(
                region=region,
                title=ch_data['title'],
                defaults=ch_data,
            )
            if not created:
                for field, value in ch_data.items():
                    setattr(challenge, field, value)
                challenge.save()
            verb = 'Created' if created else 'Updated'
            self.stdout.write(f'  {verb} challenge [{challenge.order}]: {challenge.title}')

        self.stdout.write(self.style.SUCCESS(
            f'\nRegion 1 loaded: '
            f'{len(SHRINES)} shrines, '
            f'{sum(len(s["topics"]) for s in SHRINES)} topics, '
            f'{len(CHALLENGES)} challenges.'
        ))
