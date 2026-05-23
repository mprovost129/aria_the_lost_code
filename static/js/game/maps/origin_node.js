window.ARIA_GAME = window.ARIA_GAME || {};
window.ARIA_GAME.MAPS = window.ARIA_GAME.MAPS || {};

(function () {
    const W = 146;
    const H = 34;

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
    };

    const map = Array.from({ length: H }, () => Array(W).fill(TILE.WALL));

    const rooms = {
        start: { x: 2, y: 14, w: 12, h: 10 },
        r1: { x: 18, y: 4, w: 12, h: 12 },
        r2: { x: 34, y: 16, w: 14, h: 10 },
        r3: { x: 52, y: 3, w: 16, h: 14 },
        r4: { x: 72, y: 15, w: 12, h: 12 },
        r5: { x: 88, y: 5, w: 18, h: 12 },
        r6: { x: 110, y: 14, w: 14, h: 12 },
        boss: { x: 128, y: 6, w: 12, h: 12 },
    };

    function carveRoom(r, tile = TILE.FLOOR) {
        for (let y = r.y; y < r.y + r.h; y++) {
            for (let x = r.x; x < r.x + r.w; x++) {
                map[y][x] = tile;
            }
        }
    }

    function carveRoad(x1, y1, x2, y2) {
        let x = x1;
        let y = y1;
        while (x !== x2) {
            map[y][x] = TILE.ROAD;
            x += x < x2 ? 1 : -1;
        }
        while (y !== y2) {
            map[y][x] = TILE.ROAD;
            y += y < y2 ? 1 : -1;
        }
        map[y][x] = TILE.ROAD;
    }

    Object.values(rooms).forEach((r) => carveRoom(r));

    const gates = [
        { key: '16,19', x: 16, y: 19 },
        { key: '32,19', x: 32, y: 19 },
        { key: '50,19', x: 50, y: 19 },
        { key: '70,19', x: 70, y: 19 },
        { key: '86,19', x: 86, y: 19 },
        { key: '108,19', x: 108, y: 19 },
    ];

    carveRoad(13, 19, 16, 19);
    carveRoad(16, 19, 24, 10);
    carveRoad(24, 10, 32, 19);
    carveRoad(32, 19, 41, 21);
    carveRoad(41, 21, 50, 19);
    carveRoad(50, 19, 60, 10);
    carveRoad(60, 10, 70, 19);
    carveRoad(70, 19, 78, 21);
    carveRoad(78, 21, 86, 19);
    carveRoad(86, 19, 97, 11);
    carveRoad(97, 11, 108, 19);
    carveRoad(108, 19, 117, 20);
    carveRoad(117, 20, 127, 12);
    carveRoad(127, 12, 133, 12);

    gates.forEach((g) => { map[g.y][g.x] = TILE.GATE; });

    map[19][13] = TILE.ARIA_GATE;
    map[17][5] = TILE.TABLET;
    map[19][4] = TILE.SPAWN;

    const shrines = {
        shrine1: [{ x: 22, y: 8 }, { x: 23, y: 8 }, { x: 22, y: 9 }, { x: 23, y: 9 }],
        shrine2: [{ x: 40, y: 20 }, { x: 41, y: 20 }, { x: 40, y: 21 }, { x: 41, y: 21 }],
        shrine3: [{ x: 58, y: 8 }, { x: 59, y: 8 }, { x: 58, y: 9 }, { x: 59, y: 9 }],
        shrine4: [{ x: 76, y: 20 }, { x: 77, y: 20 }, { x: 76, y: 21 }, { x: 77, y: 21 }],
        shrine5: [{ x: 96, y: 9 }, { x: 97, y: 9 }, { x: 96, y: 10 }, { x: 97, y: 10 }],
        shrine6: [{ x: 116, y: 19 }, { x: 117, y: 19 }, { x: 116, y: 20 }, { x: 117, y: 20 }],
    };

    Object.values(shrines).flat().forEach((p) => { map[p.y][p.x] = TILE.SHRINE; });

    // Boss room landmarks
    map[12][134] = TILE.BOSS_BUG;
    map[9][136] = TILE.BOSS_CHAMBER;
    map[9][137] = TILE.BOSS_CHAMBER;
    map[10][136] = TILE.BOSS_CHAMBER;
    map[10][137] = TILE.BOSS_CHAMBER;

    // Decorative terminals sprinkled through larger rooms
    [
        [8, 21], [44, 22], [62, 12], [80, 24], [102, 13], [120, 23],
    ].forEach(([x, y]) => { map[y][x] = TILE.TERMINAL; });

    window.ARIA_GAME.MAPS.ORIGIN_NODE = map;
    window.ARIA_GAME.MAPS.ORIGIN_NODE_SPAWN = { col: 4, row: 19 };
    window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS = {
        tabletItem: { col: 5, row: 17 },
        ariaGate: { col: 13, row: 19 },

        shrine1: shrines.shrine1.map((p) => ({ col: p.x, row: p.y })),
        shrine2: shrines.shrine2.map((p) => ({ col: p.x, row: p.y })),
        shrine3: shrines.shrine3.map((p) => ({ col: p.x, row: p.y })),
        shrine4: shrines.shrine4.map((p) => ({ col: p.x, row: p.y })),
        shrine5: shrines.shrine5.map((p) => ({ col: p.x, row: p.y })),
        shrine6: shrines.shrine6.map((p) => ({ col: p.x, row: p.y })),

        gate1: [{ col: 16, row: 19 }],
        gate2: [{ col: 32, row: 19 }],
        gate3: [{ col: 50, row: 19 }],
        gate4: [{ col: 70, row: 19 }],
        gate5: [{ col: 86, row: 19 }],
        gate6: [{ col: 108, row: 19 }],

        bossBug: [{ col: 134, row: 12 }],
        bossChamber: [
            { col: 136, row: 9 }, { col: 137, row: 9 },
            { col: 136, row: 10 }, { col: 137, row: 10 },
        ],

        chancePickups: [
            { id: 'heart_01', col: 10, row: 21 },
            { id: 'heart_02', col: 27, row: 13 },
            { id: 'heart_03', col: 45, row: 23 },
            { id: 'heart_04', col: 66, row: 6 },
            { id: 'heart_05', col: 100, row: 15 },
            { id: 'heart_06', col: 121, row: 24 },
        ],
    };
}());
