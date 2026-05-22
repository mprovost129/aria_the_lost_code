/**
 * ARIA: The Lost Code - Origin Node Tile Map (Region 1)
 * Concept: Variables and Data Types
 *
 * Dimensions: 25 columns × 18 rows at 32px per tile = 800 × 576 pixels
 *
 * Linear snake path (6 shrines, 6 gates):
 *
 *   TOP ROAD (row 5, left → right):
 *     Spawn @ col 2
 *     Shrine 1 (Variables)       cols 5–6,   rows 3–4   (above road)
 *     Gate 1 @ col 7
 *     Shrine 2 (Strings)         cols 9–10,  rows 3–4
 *     Gate 2 @ col 12
 *     Shrine 3 (Integers/Floats) cols 13–14, rows 3–4
 *     Gate 3 @ col 17
 *     Right connector @ col 22  (rows 5–11)
 *
 *   BOTTOM ROAD (row 11, right → left):
 *     Right connector joins here @ col 22
 *     Shrine 4 (Booleans)        cols 20–21, rows 12–13  (below road)
 *     Gate 4 @ col 18
 *     Shrine 5 (Type Conversion) cols 15–16, rows 12–13
 *     Gate 5 @ col 13
 *     Shrine 6 (f-strings)       cols 10–11, rows 12–13
 *     Gate 6 @ col 8   ← final gate; blocks Boss Bug and Boss Chamber
 *     Boss Bug @ col 6
 *     Boss Chamber @ cols 2–3
 *
 * Tile type key:
 *   0 WALL  1 FLOOR  2 ROAD  3 SHRINE  4 GATE  5 BOSS_CHAMBER
 *   6 TERMINAL  7 BOSS_BUG  8 SPAWN
 */

window.ARIA_GAME = window.ARIA_GAME || {};
window.ARIA_GAME.MAPS = window.ARIA_GAME.MAPS || {};

window.ARIA_GAME.MAPS.ORIGIN_NODE = [
//  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // row 0  outer wall
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 1  open above shrines
  [ 0,  1,  6,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  6,  0], // row 2  terminal clusters
  [ 0,  1,  6,  6,  1,  3,  3,  1,  1,  3,  3,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  6,  6,  0], // row 3  shrine tops: 1(5-6) 2(9-10) 3(13-14)
  [ 0,  1,  1,  1,  1,  3,  3,  1,  1,  3,  3,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 4  shrine bottoms
  [ 0,  1,  8,  2,  2,  2,  2,  4,  2,  2,  2,  2,  4,  2,  2,  2,  2,  4,  2,  2,  2,  2,  2,  1,  0], // row 5  TOP ROAD: spawn@2 G1@7 G2@12 G3@17 connector@22
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  0], // row 6  interior; right connector@22
  [ 0,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  0], // row 7  interior; terminal@3
  [ 0,  1,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  0], // row 8  interior; terminal@3
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  0], // row 9  interior
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  0], // row 10 interior
  [ 0,  1,  5,  5,  2,  2,  7,  2,  4,  2,  2,  2,  2,  4,  2,  2,  2,  2,  4,  2,  2,  2,  2,  1,  0], // row 11 BOTTOM ROAD: BC@2-3 bug@6 G6@8 G5@13 G4@18 connector@22
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  3,  3,  1,  1,  1,  3,  3,  1,  1,  1,  3,  3,  1,  1,  0], // row 12 shrine tops: 6(10-11) 5(15-16) 4(20-21)
  [ 0,  1,  6,  1,  1,  1,  1,  1,  1,  1,  3,  3,  1,  1,  1,  3,  3,  1,  1,  1,  3,  3,  1,  6,  0], // row 13 shrine bottoms + terminals
  [ 0,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  0], // row 14 open below shrines
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 15 open
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 16 open
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // row 17 outer wall
];

// Player starting tile
window.ARIA_GAME.MAPS.ORIGIN_NODE_SPAWN = { col: 2, row: 5 };

// Named positions for interaction lookup
window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS = {
    // Top-road shrines (above row 5)
    shrine1: [{ col: 5, row: 3 }, { col: 6, row: 3 }, { col: 5, row: 4 }, { col: 6, row: 4 }],
    shrine2: [{ col: 9, row: 3 }, { col: 10, row: 3 }, { col: 9, row: 4 }, { col: 10, row: 4 }],
    shrine3: [{ col: 13, row: 3 }, { col: 14, row: 3 }, { col: 13, row: 4 }, { col: 14, row: 4 }],
    // Bottom-road shrines (below row 11)
    shrine4: [{ col: 20, row: 12 }, { col: 21, row: 12 }, { col: 20, row: 13 }, { col: 21, row: 13 }],
    shrine5: [{ col: 15, row: 12 }, { col: 16, row: 12 }, { col: 15, row: 13 }, { col: 16, row: 13 }],
    shrine6: [{ col: 10, row: 12 }, { col: 11, row: 12 }, { col: 10, row: 13 }, { col: 11, row: 13 }],
    // Gates (top road)
    gate1:   [{ col: 7,  row: 5  }],
    gate2:   [{ col: 12, row: 5  }],
    gate3:   [{ col: 17, row: 5  }],
    // Gates (bottom road)
    gate4:   [{ col: 18, row: 11 }],
    gate5:   [{ col: 13, row: 11 }],
    gate6:   [{ col: 8,  row: 11 }],
    // Boss area
    bossBug:    [{ col: 6, row: 11 }],
    bossChamber:[{ col: 2, row: 11 }, { col: 3, row: 11 }],
};
