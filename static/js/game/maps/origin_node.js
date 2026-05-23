window.ARIA_GAME = window.ARIA_GAME || {};
window.ARIA_GAME.MAPS = window.ARIA_GAME.MAPS || {};

(function () {
    const W = 172;
    const H = 80;

    const TILE = {
        WALL: 0,
        FLOOR: 1,
        ROAD: 2,
        SHRINE: 3,
        GATE: 4,
        BOSS_CHAMBER: 5,
        TERMINAL: 6,
        BOSS_BUG: 7,
        SPAWN: 8,
        TABLET: 11,
        ARIA_GATE: 12,
        FIREWALL: 13,
        DATA_FLOOD: 14,
        CACHE_NODE: 15,
    };

    const map = Array.from({ length: H }, () => Array(W).fill(TILE.WALL));

    const rooms = {
        r1:    { x: 24, y: 18, w: 16, h: 14 },
        r2:    { x: 46, y: 22, w: 18, h: 12 },
        r3:    { x: 68, y: 16, w: 20, h: 16 },
        r4:    { x: 92, y: 20, w: 14, h: 14 },
        r5:    { x: 110, y: 18, w: 18, h: 14 },
        r6:    { x: 132, y: 20, w: 16, h: 14 },
        boss:  { x: 152, y: 20, w: 16, h: 14 },
        cache: { x: 116, y: 36, w: 10, h: 8 },
    };

    function carveRoom(r, tile = TILE.FLOOR) {
        for (let y = r.y; y < r.y + r.h; y++) {
            for (let x = r.x; x < r.x + r.w; x++) {
                map[y][x] = tile;
            }
        }
    }

    function carveEllipseRoom(cx, cy, rx, ry, tile = TILE.FLOOR) {
        for (let y = Math.max(1, cy - ry); y <= Math.min(H - 2, cy + ry); y++) {
            for (let x = Math.max(1, cx - rx); x <= Math.min(W - 2, cx + rx); x++) {
                const dx = (x - cx) / rx;
                const dy = (y - cy) / ry;
                if ((dx * dx + dy * dy) <= 1) {
                    map[y][x] = tile;
                }
            }
        }
    }

    function carveRoad(x1, y1, x2, y2) {
        let x = x1;
        let y = y1;
        while (x !== x2) {
            map[y][x] = TILE.FLOOR;
            x += x < x2 ? 1 : -1;
        }
        while (y !== y2) {
            map[y][x] = TILE.FLOOR;
            y += y < y2 ? 1 : -1;
        }
        map[y][x] = TILE.FLOOR;
    }

    Object.values(rooms).forEach((r) => carveRoom(r));
    // Dedicated spawn chamber: oval footprint for stronger identity.
    carveEllipseRoom(12, 26, 9, 7, TILE.FLOOR);

    // Main progression corridors
    carveRoad(17, 26, 24, 26);  // start -> room1 (ARIA gate in this connector)

    carveRoad(39, 26, 42, 26);
    carveRoad(42, 26, 46, 27);  // room1 -> gate1 -> room2

    carveRoad(63, 27, 64, 27);
    carveRoad(64, 27, 68, 24);  // room2 -> gate2 -> room3

    carveRoad(87, 24, 88, 24);
    carveRoad(88, 24, 92, 27);  // room3 -> gate3 -> room4

    carveRoad(105, 27, 106, 27);
    carveRoad(106, 27, 110, 24); // room4 -> gate4 -> room5

    carveRoad(127, 24, 128, 24);
    carveRoad(128, 24, 132, 27); // room5 -> gate5 -> room6

    carveRoad(147, 27, 148, 27);
    carveRoad(148, 27, 152, 26); // room6 -> gate6 -> boss area

    // Hidden cache branch from room5
    carveRoad(119, 31, 119, 36);
    carveRoad(119, 36, 120, 39);

    // Gate placements (one gate between each main area)
    const gates = [
        [42, 26],
        [64, 27],
        [88, 24],
        [106, 27],
        [128, 24],
        [148, 27],
    ];
    gates.forEach(([x, y]) => { map[y][x] = TILE.GATE; });

    // Intro room items
    map[26][20] = TILE.ARIA_GATE;
    map[25][12] = TILE.TABLET;
    map[27][9] = TILE.SPAWN;

    const shrines = {
        shrine1: [{ x: 29, y: 22 }, { x: 30, y: 22 }, { x: 29, y: 23 }, { x: 30, y: 23 }],
        shrine2: [{ x: 53, y: 27 }, { x: 54, y: 27 }, { x: 53, y: 28 }, { x: 54, y: 28 }],
        shrine3: [{ x: 75, y: 21 }, { x: 76, y: 21 }, { x: 75, y: 22 }, { x: 76, y: 22 }],
        shrine4: [{ x: 97, y: 25 }, { x: 98, y: 25 }, { x: 97, y: 26 }, { x: 98, y: 26 }],
        shrine5: [{ x: 117, y: 22 }, { x: 118, y: 22 }, { x: 117, y: 23 }, { x: 118, y: 23 }],
        shrine6: [{ x: 137, y: 26 }, { x: 138, y: 26 }, { x: 137, y: 27 }, { x: 138, y: 27 }],
    };
    Object.values(shrines).flat().forEach((p) => { map[p.y][p.x] = TILE.SHRINE; });

    // Between-area blockers (keep room interiors clean)
    [
        [41, 24], [41, 28], [43, 24], [43, 28],
        [63, 25], [63, 29], [65, 25], [65, 29],
        [87, 22], [87, 26], [89, 22], [89, 26],
        [105, 25], [105, 29], [107, 25], [107, 29],
        [127, 22], [127, 26], [129, 22], [129, 26],
        [147, 25], [147, 29], [149, 25], [149, 29],
    ].forEach(([x, y]) => { map[y][x] = TILE.FIREWALL; });

    [
        [56, 25], [57, 25], [56, 26], [57, 26],
        [80, 25], [81, 25], [80, 26], [81, 26],
        [120, 25], [121, 25], [120, 26], [121, 26],
        [140, 23], [141, 23], [140, 24], [141, 24],
    ].forEach(([x, y]) => { map[y][x] = TILE.DATA_FLOOD; });

    // Hidden cache marker + reward room flavor
    map[39][120] = TILE.CACHE_NODE;
    map[40][118] = TILE.TERMINAL;
    map[41][122] = TILE.TERMINAL;

    // Boss area
    map[27][158] = TILE.BOSS_BUG;
    map[24][163] = TILE.BOSS_CHAMBER;
    map[24][164] = TILE.BOSS_CHAMBER;
    map[25][163] = TILE.BOSS_CHAMBER;
    map[25][164] = TILE.BOSS_CHAMBER;

    // Room landmarks and ambient terminals
    [
        [27, 21], [30, 28], [33, 20], [36, 26],
        [50, 24], [50, 31], [56, 29], [60, 26],
        [73, 19], [78, 27], [83, 18], [86, 24],
        [95, 24], [95, 32], [101, 22], [103, 29],
        [114, 20], [118, 30], [124, 20], [126, 27],
        [136, 22], [140, 28], [145, 31], [146, 24],
        [120, 37], [122, 40],
    ].forEach(([x, y]) => {
        map[y][x] = TILE.TERMINAL;
    });

    window.ARIA_GAME.MAPS.ORIGIN_NODE = map;
    window.ARIA_GAME.MAPS.ORIGIN_NODE_SPAWN = { col: 9, row: 27 };
    window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS = {
        tabletItem: { col: 12, row: 25 },
        ariaGate: { col: 20, row: 26 },

        shrine1: shrines.shrine1.map((p) => ({ col: p.x, row: p.y })),
        shrine2: shrines.shrine2.map((p) => ({ col: p.x, row: p.y })),
        shrine3: shrines.shrine3.map((p) => ({ col: p.x, row: p.y })),
        shrine4: shrines.shrine4.map((p) => ({ col: p.x, row: p.y })),
        shrine5: shrines.shrine5.map((p) => ({ col: p.x, row: p.y })),
        shrine6: shrines.shrine6.map((p) => ({ col: p.x, row: p.y })),

        gate1: [{ col: 42, row: 26 }],
        gate2: [{ col: 64, row: 27 }],
        gate3: [{ col: 88, row: 24 }],
        gate4: [{ col: 106, row: 27 }],
        gate5: [{ col: 128, row: 24 }],
        gate6: [{ col: 148, row: 27 }],

        bossBug: [{ col: 158, row: 27 }],
        bossChamber: [
            { col: 163, row: 24 }, { col: 164, row: 24 },
            { col: 163, row: 25 }, { col: 164, row: 25 },
        ],

        chancePickups: [
            { id: 'heart_01', col: 12, row: 29 },
            { id: 'heart_02', col: 36, row: 29 },
            { id: 'heart_03', col: 60, row: 30 },
            { id: 'heart_04', col: 84, row: 18 },
            { id: 'heart_05', col: 136, row: 31 },
            { id: 'heart_06', col: 120, row: 39 },
        ],
    };
}());
