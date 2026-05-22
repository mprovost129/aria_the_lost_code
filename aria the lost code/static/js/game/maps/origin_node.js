/**
 * ARIA: The Lost Code — Origin Node Tile Map (Region 1)
 * Concept: Variables and Data Types
 *
 * Dimensions: 25 columns × 18 rows at 32px per tile = 800 × 576 pixels
 * No camera scrolling required — the full map fits on screen.
 *
 * Road structure (rectangular loop):
 *   Top road:    row 5,  columns 4–21
 *   Left road:   col 4,  rows 5–10
 *   Bottom road: row 10, columns 4–21
 *   Right road:  col 21, rows 5–10
 *
 * Key positions (col, row):
 *   Spawn:        ( 7,  7)  player start, inside the road loop
 *   Shrine 1:     ( 5,  3)–( 6,  4)  upper left, Variables & Data Types
 *   Gate 1:       ( 7,  5)  top road — Challenges 1 & 2 (Power Up Terminals)
 *   Gate 2:       (12,  5)  top road — Challenges 3 & 4 (Data Types & Bug Fix)
 *   Shrine 2:     ( 9,  8)–(10,  9)  inside loop — String Formatting
 *   Gate 3:       (13,  8)  lower area — Challenge 5 (String Formatting)
 *   Boss Bug:     (18,  5)  top road — guards Boss Chamber
 *   Boss Chamber: (22,  5)–(23,  6)  far right — Boss Challenge (Who Are You)
 *
 * Tile type key:
 *   0 WALL         1 FLOOR        2 ROAD         3 SHRINE
 *   4 GATE         5 BOSS_CHAMBER 6 TERMINAL     7 BOSS_BUG    8 SPAWN
 */

window.ARIA_GAME = window.ARIA_GAME || {};
window.ARIA_GAME.MAPS = window.ARIA_GAME.MAPS || {};

window.ARIA_GAME.MAPS.ORIGIN_NODE = [
//  0   1   2   3   4   5   6   7   8   9  10  11  12  13  14  15  16  17  18  19  20  21  22  23  24
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // row 0  outer wall
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 1
  [ 0,  1,  6,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  6,  1,  0], // row 2  terminal clusters
  [ 0,  1,  6,  6,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  6,  1,  0], // row 3  shrine 1 top row
  [ 0,  1,  1,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 4  shrine 1 bottom row
  [ 0,  1,  1,  1,  2,  2,  2,  4,  2,  2,  2,  2,  4,  2,  2,  2,  2,  2,  7,  2,  2,  2,  5,  5,  0], // row 5  top road: G1@7 G2@12 bug@18 boss@22-23
  [ 0,  1,  1,  1,  2,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  5,  5,  0], // row 6  left/right roads + boss chamber
  [ 0,  1,  1,  1,  2,  1,  1,  8,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  0], // row 7  player SPAWN at (7,7)
  [ 0,  1,  1,  1,  2,  1,  1,  1,  1,  3,  3,  1,  1,  4,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  0], // row 8  shrine 2 top @(9-10,8), gate 3 @(13,8)
  [ 0,  1,  6,  1,  2,  1,  1,  1,  1,  3,  3,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  2,  1,  1,  0], // row 9  shrine 2 bottom, terminal @(2,9)
  [ 0,  1,  6,  1,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  2,  1,  1,  0], // row 10 bottom road, terminal @(2,10)
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 11
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 12
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 13
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 14
  [ 0,  1,  6,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  6,  0], // row 15 terminal corners
  [ 0,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  1,  0], // row 16
  [ 0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0,  0], // row 17 outer wall
];

// Player starting tile position
window.ARIA_GAME.MAPS.ORIGIN_NODE_SPAWN = { col: 7, row: 7 };

// Named positions for gate/shrine interaction lookup (used by challenge system in Layer 4+)
window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS = {
    shrine1:      [{ col: 5, row: 3 }, { col: 6, row: 3 }, { col: 5, row: 4 }, { col: 6, row: 4 }],
    gate1:        [{ col: 7, row: 5 }],
    gate2:        [{ col: 12, row: 5 }],
    shrine2:      [{ col: 9, row: 8 }, { col: 10, row: 8 }, { col: 9, row: 9 }, { col: 10, row: 9 }],
    gate3:        [{ col: 13, row: 8 }],
    bossBug:      [{ col: 18, row: 5 }],
    bossChamber:  [{ col: 22, row: 5 }, { col: 23, row: 5 }, { col: 22, row: 6 }, { col: 23, row: 6 }],
};
