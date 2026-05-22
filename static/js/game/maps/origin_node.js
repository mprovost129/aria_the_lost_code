/**
 * ARIA: The Lost Code - Origin Node Tile Map (Region 1)
 *
 * Strict shrine-gate-shrine-gate progression through six pockets.
 * Each pocket is walled except for the gate chokepoint that leads forward.
 *
 * Tile IDs:
 *   0 = WALL      (impassable solid boundary)
 *   1 = FLOOR     (passable interior space)
 *   2 = ROAD      (passable path, different visual)
 *   3 = SHRINE    (impassable, bumping triggers shrine modal)
 *   4 = GATE      (impassable until challenge solved)
 *   5 = BOSS_CHAMBER (impassable until boss bug defeated)
 *   6 = TERMINAL  (decorative, impassable)
 *   7 = BOSS_BUG  (triggers boss bug battle on contact)
 *   8 = SPAWN     (passable, player start tile)
 *
 * Progression:
 *   Pocket 1: Spawn → Shrine 1 (Variables)
 *   Gate 1 (Variables) → col 10, row 10
 *   Pocket 2: Shrine 2 (Strings)
 *   Gate 2 (Strings) → col 21, row 15
 *   Pocket 3: Shrine 3 (Integers/Floats)
 *   Gate 3 (Integers) → col 33, row 7
 *   Pocket 4: Shrine 4 (Booleans)
 *   Gate 4 (Booleans) → col 22, row 17
 *   Pocket 5: Shrine 5 (Type Conversion)
 *   Gate 5 (Type Conversion) → col 11, row 17
 *   Pocket 6: Shrine 6 (f-strings) + roaming bugs
 *   Gate 6 (f-strings) → col 11, row 19
 *   Boss Bug → col 33, row 19
 *   Boss Chamber → cols 36-37, rows 15-16
 */

window.ARIA_GAME = window.ARIA_GAME || {};
window.ARIA_GAME.MAPS = window.ARIA_GAME.MAPS || {};

window.ARIA_GAME.MAPS.ORIGIN_NODE = [
//   0  1  2  3  4  5  6  7  8  9 10 11 12 13 14 15 16 17 18 19 20 21 22 23 24 25 26 27 28 29 30 31 32 33 34 35 36 37 38 39
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  0
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  1  intro room top
  [0, 1,11, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  2  tablet at col 2
  [0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  3
  [0, 1, 8, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  4  SPAWN at col 2
  [0, 0,12, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  5  ARIA_GATE at col 2
  [0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //  6  corridor tile
  [0, 1, 1, 1, 1, 1, 1, 6, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 6, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 6, 1, 2, 2, 2, 0, 0, 0, 0, 0], //  7
  [0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 0, 0, 0], //  8
  [0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 0, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 0, 0, 0], //  9
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 0, 2, 0, 0, 0, 0, 0], // 10
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 6, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 0, 0, 0], // 11
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 0, 0, 0, 0, 0], // 12
  [0, 1, 1, 1, 1, 6, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 6, 2, 0, 2, 0, 0, 0, 0, 0], // 13
  [0, 1, 1, 1, 1, 1, 1, 1, 6, 2, 0, 0, 1, 1, 1, 6, 1, 1, 1, 1, 1, 2, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 2, 0, 2, 1, 1, 6, 1, 0], // 14
  [0, 6, 1, 1, 1, 1, 1, 1, 6, 2, 1, 0, 1, 1, 1, 1, 1, 1, 1, 6, 1, 2, 2, 6, 1, 1, 1, 1, 1, 1, 6, 1, 2, 0, 2, 1, 5, 5, 1, 0], // 15
  [0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 1, 3, 3, 1, 1, 1, 1, 1, 1, 1, 0, 2, 1, 5, 5, 1, 0], // 16
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 1, 1, 1, 0], // 17
  [0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 6, 0], // 18
  [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 4, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 7, 2, 2, 2, 2, 2, 0], // 19
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 20
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], // 21
];

window.ARIA_GAME.MAPS.ORIGIN_NODE_SPAWN = { col: 2, row: 4 };

window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS = {
    tabletItem: { col: 2, row: 2 },
    ariaGate:   { col: 2, row: 5 },

    shrine1: [{ col: 2, row: 8 }, { col: 3, row: 8 }, { col: 2, row: 9 }, { col: 3, row: 9 }],
    shrine2: [{ col: 13, row: 8 }, { col: 14, row: 8 }, { col: 13, row: 9 }, { col: 14, row: 9 }],
    shrine3: [{ col: 24, row: 8 }, { col: 25, row: 8 }, { col: 24, row: 9 }, { col: 25, row: 9 }],
    shrine4: [{ col: 24, row: 16 }, { col: 25, row: 16 }, { col: 24, row: 17 }, { col: 25, row: 17 }],
    shrine5: [{ col: 13, row: 16 }, { col: 14, row: 16 }, { col: 13, row: 17 }, { col: 14, row: 17 }],
    shrine6: [{ col: 2, row: 16 }, { col: 3, row: 16 }, { col: 2, row: 17 }, { col: 3, row: 17 }],

    gate1: [{ col: 10, row: 10 }],
    gate2: [{ col: 21, row: 15 }],
    gate3: [{ col: 33, row: 7 }],
    gate4: [{ col: 22, row: 17 }],
    gate5: [{ col: 11, row: 17 }],
    gate6: [{ col: 11, row: 19 }],

    bossBug:     [{ col: 33, row: 19 }],
    bossChamber: [{ col: 36, row: 15 }, { col: 37, row: 15 }, { col: 36, row: 16 }, { col: 37, row: 16 }],

    chancePickups: [
        { id: 'heart_01', col: 6, row: 12 },
        { id: 'heart_02', col: 18, row: 12 },
        { id: 'heart_03', col: 29, row: 12 },
        { id: 'heart_04', col: 29, row: 18 },
        { id: 'heart_05', col: 18, row: 18 },
        { id: 'heart_06', col: 5, row: 18 },
    ],
};