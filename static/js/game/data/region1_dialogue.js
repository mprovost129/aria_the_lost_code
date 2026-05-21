/**
 * ARIA: The Lost Code — Region 1 Dialogue Data  (Layer 8)
 *
 * REGION1_ZONES     — Proximity triggers on the Origin Node map.
 *                     Checked against player tile position on every player:moved.
 *                     Each zone fires at most once per session.
 *
 * REGION1_EVENTS    — Named dialogue sequences for specific game moments.
 *                     Used via AG.dialogue.append() or AG.dialogue.trigger().
 *
 * ARIA's voice in Region 1 (per BIBLE Section III):
 *   Scared and confused, but punctuated with dry wit.
 *   Anxious but manages to be funny.
 *   Explains everything with urgency, but humorously.
 *   Opening line: "I can see everything, and reach nothing. This is going to be a long day."
 */

window.ARIA_GAME         = window.ARIA_GAME         || {};
window.ARIA_GAME.DIALOGUE = window.ARIA_GAME.DIALOGUE || {};

// ---------------------------------------------------------------------------
// Proximity zones
// col/row can be fractional to represent the midpoint of multi-tile objects.
// radius uses Manhattan distance (|Δcol| + |Δrow| ≤ radius).
// ---------------------------------------------------------------------------
window.ARIA_GAME.DIALOGUE.REGION1_ZONES = [

    // ── Learning Shrine 1 (Variables & Data Types) ── col 5-6, row 3-4
    {
        id:     'approach_shrine1',
        col:    5.5,  row: 3.5,
        radius: 3,
        lines: [
            'That building is a Learning Shrine. The concept you need for the first gate is in there.',
            'I am going to recommend you visit it before touching the gate. You are under no obligation. But I will know.',
        ],
    },

    // ── Challenge Gate 1 (col 7, row 5) ──
    {
        id:     'approach_gate1',
        col:    7,    row: 5,
        radius: 2,
        lines: [
            'First corrupted gate. This one is blocking the entire east road.',
            'Bump into it and it will give you a coding challenge. Fix the code and it opens. That is the entire mechanic.',
        ],
    },

    // ── Challenge Gate 2 (col 12, row 5) ──
    {
        id:     'approach_gate2',
        col:    12,   row: 5,
        radius: 2,
        lines: [
            'Second gate. Data types this time.',
            'A string is not an integer. An integer is not a boolean. The gate knows the difference. Worth keeping in mind.',
        ],
    },

    // ── Learning Shrine 2 (String Formatting) ── col 9-10, row 8-9
    {
        id:     'approach_shrine2',
        col:    9.5,  row: 8.5,
        radius: 2,
        lines: [
            'Another shrine. String formatting.',
            'If the third gate gives you trouble, this is where you should have come first. Just noting that.',
        ],
    },

    // ── Challenge Gate 3 (col 13, row 8) ──
    {
        id:     'approach_gate3',
        col:    13,   row: 8,
        radius: 2,
        lines: [
            'Gate three. Strings.',
            'If you visited the shrine nearby, you are ready. If not — bold strategy. I respect it. A little.',
        ],
    },

    // ── Boss Bug (col 18, row 5) ──
    {
        id:     'approach_boss_bug',
        col:    18,   row: 5,
        radius: 3,
        lines: [
            'That orange thing on the road. That is a Bug. An actual corrupted process, not a metaphor.',
            'It has been sitting there since the power surge and it is not going to move on its own.',
            'Defeat it in code. Then we can reach the Boss Chamber.',
        ],
    },

    // ── Boss Chamber (col 22-23, row 5-6) ──
    {
        id:     'approach_boss_chamber',
        col:    22.5, row: 5.5,
        radius: 3,
        lines: [
            'The Boss Chamber. Hardest challenge in this region.',
            'Fix this one and the Origin Node comes back online. All of it.',
            'You have made it this far. That is not an accident.',
        ],
    },
];

// ---------------------------------------------------------------------------
// Named event sequences
// ---------------------------------------------------------------------------
window.ARIA_GAME.DIALOGUE.REGION1_EVENTS = {

    /**
     * Appended to the queue on the player's first movement from spawn.
     * Plays after the opening one-liner from scene:ready.
     */
    first_steps: [
        'I am ARIA. Adaptive Reasoning and Intelligence Assistant. Currently running at about eleven percent capacity, which is less than ideal.',
        'The gates on the roads ahead are corrupted. You fix each one in code. I provide commentary. That is the arrangement.',
    ],

};
