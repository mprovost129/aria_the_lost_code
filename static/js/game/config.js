/**
 * ARIA: The Lost Code - Game Configuration
 *
 * Global constants shared across all game scripts.
 * Loaded first via <script> tag; all other game scripts depend on this.
 *
 * Convention: every game file begins with:
 *   window.ARIA_GAME = window.ARIA_GAME || {};
 * and attaches its exports to that object.
 */

window.ARIA_GAME = window.ARIA_GAME || {};

const AG = window.ARIA_GAME;

// ---------------------------------------------------------------------------
// World geometry
// ---------------------------------------------------------------------------

AG.TILE_SIZE = 32;          // pixels per tile (square)
AG.MOVE_DURATION = 120;     // ms for tile-to-tile movement tween
AG.CAMERA_ZOOM_MIN = 0.55;  // zoomed out
AG.CAMERA_ZOOM_MAX = 1.4;   // zoomed in
AG.CAMERA_ZOOM_STEP = 0.1;

// ---------------------------------------------------------------------------
// Tile type registry
// ---------------------------------------------------------------------------

AG.TILE = Object.freeze({
    WALL:          0,   // impassable outer boundary / internal wall
    FLOOR:         1,   // passable open area
    ROAD:          2,   // passable highlighted path
    SHRINE:        3,   // impassable 2×2 building - interact by bumping
    GATE:          4,   // impassable Challenge Gate - interact by bumping
    BOSS_CHAMBER:  5,   // impassable Boss Chamber entrance - interact by bumping
    TERMINAL:      6,   // impassable decoration (dead screen / data terminal)
    BOSS_BUG:      7,   // impassable enemy - triggers Bug Battle on bump
    SPAWN:         8,   // renders as FLOOR, marks player starting position
    // Post-restoration tile variants (applied during Layer 6 completion sequence)
    ROAD_RESTORED: 9,   // passable - bright green circuit trace, world is alive
    FLOOR_LIT:     10,  // passable - slightly warm floor, region is restored
});

// Tiles the player cannot step on
AG.IMPASSABLE_TILES = [
    AG.TILE.WALL,
    AG.TILE.SHRINE,
    AG.TILE.GATE,
    AG.TILE.BOSS_CHAMBER,
    AG.TILE.TERMINAL,
    AG.TILE.BOSS_BUG,
];

// Tiles that emit an 'interact' event when the player bumps them
AG.INTERACTIVE_TILES = [
    AG.TILE.SHRINE,
    AG.TILE.GATE,
    AG.TILE.BOSS_CHAMBER,
    AG.TILE.BOSS_BUG,
];

// ---------------------------------------------------------------------------
// Color palette - tech/cyberpunk dark theme (prototype; replaced by art later)
// ---------------------------------------------------------------------------

AG.TILE_COLORS = {
    [AG.TILE.WALL]:          0x0d0d1a,
    [AG.TILE.FLOOR]:         0x1a1a2e,
    [AG.TILE.ROAD]:          0x16213e,
    [AG.TILE.SHRINE]:        0x0d3320,
    [AG.TILE.GATE]:          0x3a1515,
    [AG.TILE.BOSS_CHAMBER]:  0x2a1535,
    [AG.TILE.TERMINAL]:      0x0d2233,
    [AG.TILE.BOSS_BUG]:      0x2a0d0d,
    [AG.TILE.SPAWN]:         0x1a1a2e,
    [AG.TILE.ROAD_RESTORED]: 0x0a2218,   // deep green - alive circuit board
    [AG.TILE.FLOOR_LIT]:     0x1a2a1e,   // slightly warm green - region is breathing
};

// Accent / border colors for each tile type
AG.TILE_BORDERS = {
    [AG.TILE.WALL]:          0x060618,
    [AG.TILE.FLOOR]:         0x12122a,
    [AG.TILE.ROAD]:          0x2a3a5e,
    [AG.TILE.SHRINE]:        0x00aa44,
    [AG.TILE.GATE]:          0xff2222,
    [AG.TILE.BOSS_CHAMBER]:  0xaa22ff,
    [AG.TILE.TERMINAL]:      0x00aaff,
    [AG.TILE.BOSS_BUG]:      0xff4400,
    [AG.TILE.SPAWN]:         0x12122a,
    [AG.TILE.ROAD_RESTORED]: 0x00cc55,   // bright green border - signal line
    [AG.TILE.FLOOR_LIT]:     0x1e3e24,
};

// Human-readable labels shown in the HUD when the player bumps a tile
AG.TILE_LABELS = {
    [AG.TILE.SHRINE]:       'Learning Shrine',
    [AG.TILE.GATE]:         'Challenge Gate',
    [AG.TILE.BOSS_CHAMBER]: 'Boss Chamber',
    [AG.TILE.BOSS_BUG]:     'Bug Encountered!',
};
