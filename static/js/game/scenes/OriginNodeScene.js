/**
 * ARIA: The Lost Code - Origin Node Scene (Region 1)
 *
 * Visual overhaul: detailed tile art, human player silhouette with direction
 * flip, unified shrine building overlay, actual bug sprite overlay.
 *
 * Input: keyboard (arrows/WASD) + click/tap to move (mobile friendly).
 */

window.ARIA_GAME = window.ARIA_GAME || {};

class OriginNodeScene extends Phaser.Scene {

    constructor() {
        super({ key: 'OriginNodeScene' });

        const spawn = window.ARIA_GAME.MAPS.ORIGIN_NODE_SPAWN;
        this.tileX       = spawn.col;
        this.tileY       = spawn.row;
        this.lastDX      = 1;
        this.isMoving    = false;
        this.inputLocked = false;

        this.tileImages     = {};   // 'col,row' → Phaser Image (for live swaps)
        this._bugOverlays   = {};   // 'col,row' → bug Graphics object (boss bug only)
        this._pickupSprites = {};   // pickupId -> Graphics

        // Click-to-move: queue of {col, row} steps to walk
        this._moveQueue       = [];
        this._processingQueue = false;

        // Roaming bug state: each entry is { id, col, row, graphics, tweens[] }
        this._roamingBugs  = [];
        this._nextBugId    = 0;
        this._bugAttacking    = false;  // prevents double-trigger while panel is open
        this._gateToInteract   = null;  // { col, row } set by click-to-move gate walk
        this._shrineToInteract = null;  // { col, row } set by click-to-move shrine walk
        this._cameraZoom   = 1;
        this._freeLookMode = false;
        this._dragPanning = false;
        this._lastPanX = 0;
        this._lastPanY = 0;
        this._lastWheelZoomAt = 0;
    }

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    preload() {}

    create() {
        const AG = window.ARIA_GAME;

        this._generateTileTextures(AG);
        this._generatePlayerTextures(AG);
        this._renderMap(AG);
        this._renderShrineOverlays(AG);
        this._renderBossBugOverlays(AG);
        this._renderChancePickups(AG);
        this._createPlayer(AG);
        this._setupCamera(AG);
        this._setupInput(AG);
        this._listenToBus(AG);
        this._initRoamingBugs(AG);

        AG.events.emit('scene:ready', { scene: 'OriginNodeScene' });
        AG.events.emit('aria:speak', {
            text: 'I can see everything, and reach nothing. This is going to be a long day.',
        });
    }

    update() {
        if (!this.isMoving && !this.inputLocked && this._moveQueue.length === 0) {
            this._handleKeyboardMovement();
        }
    }

    // -------------------------------------------------------------------------
    // Tile textures - detailed 32×32 pixel art
    // -------------------------------------------------------------------------

    _generateTileTextures(AG) {
        const S = AG.TILE_SIZE;
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        const tex = (key, fn) => { g.clear(); fn(g, S); g.generateTexture(key, S, S); };

        tex(`tile_${AG.TILE.WALL}`, (g, S) => {
            g.fillStyle(0x0b0b18, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x111126, 1);
            [[0,0],[16,0],[8,16],[24,16]].forEach(([bx, by]) => {
                g.fillRect(bx + 1, by + 1, 13, 13);
            });
            g.lineStyle(1, 0x060614, 1);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.FLOOR}`, (g, S) => {
            g.fillStyle(0x1a1a2e, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x131325, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x0e0e22, 1);
            [[0,0],[S-2,0],[0,S-2],[S-2,S-2]].forEach(([px,py]) => g.fillRect(px,py,2,2));
        });

        tex(`tile_${AG.TILE.ROAD}`, (g, S) => {
            g.fillStyle(0x15203c, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(2, 0x283a6a, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x3a4e82, 1);
            [[0,0],[S,0],[0,S],[S,S]].forEach(([px,py]) => g.fillCircle(px, py, 3));
            g.fillStyle(0x4a5e92, 1);
            g.fillCircle(S/2, S/2, 2);
            g.lineStyle(1, 0x1e2e52, 1);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.SHRINE}`, (g, S) => {
            g.fillStyle(0x091e12, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x0d2416, 1);
            g.fillRect(2, 2, S-4, S-4);
            g.lineStyle(1, 0x00883322, 0.4);
            g.strokeRect(1, 1, S-2, S-2);
        });

        tex(`tile_${AG.TILE.GATE}`, (g, S) => {
            g.fillStyle(0x180808, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x341414, 1);
            g.fillRect(0, 0, 8, S);
            g.lineStyle(1, 0xff3333, 0.8);
            g.lineBetween(8, 0, 8, S);
            g.fillStyle(0x341414, 1);
            g.fillRect(S-8, 0, 8, S);
            g.lineStyle(1, 0xff3333, 0.8);
            g.lineBetween(S-9, 0, S-9, S);
            g.fillStyle(0xff5555, 1);
            [4, S/2, S-4].forEach(py => {
                g.fillCircle(4, py, 1.5);
                g.fillCircle(S-4, py, 1.5);
            });
            g.fillStyle(0xff1111, 1);
            g.fillRect(8, S/2 - 2, S-16, 4);
            g.lineStyle(1, 0xff6666, 0.45);
            g.lineBetween(8, S/2 - 6, S-8, S/2 - 6);
            g.lineBetween(8, S/2 + 6, S-8, S/2 + 6);
            g.fillStyle(0xff2222, 1);
            g.fillRect(4, 0, S-8, 4);
            g.fillRect(4, S-4, S-8, 4);
            g.lineStyle(1, 0xff2222, 0.6);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.BOSS_CHAMBER}`, (g, S) => {
            g.fillStyle(0x100618, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x261040, 1);
            g.fillRect(0, 0, 9, S);
            g.fillRect(S-9, 0, 9, S);
            g.lineStyle(1, 0xaa22ff, 0.9);
            g.lineBetween(9, 0, 9, S);
            g.lineBetween(S-10, 0, S-10, S);
            g.fillStyle(0x261040, 1);
            g.fillRect(0, 0, S, 9);
            g.lineStyle(1, 0xaa22ff, 0.9);
            g.lineBetween(0, 9, S, 9);
            g.fillStyle(0x33095a, 0.7);
            g.fillRect(9, 9, S-18, S-9);
            g.lineStyle(1, 0xcc44ff, 0.8);
            const cx = S/2, cy = S/2 + 5;
            g.lineBetween(cx, cy-9, cx+9, cy);
            g.lineBetween(cx+9, cy, cx, cy+9);
            g.lineBetween(cx, cy+9, cx-9, cy);
            g.lineBetween(cx-9, cy, cx, cy-9);
            g.fillStyle(0xcc44ff, 0.5);
            g.fillCircle(cx, cy, 2);
            g.lineStyle(2, 0xaa22ff, 1);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.TERMINAL}`, (g, S) => {
            g.fillStyle(0x0c2030, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x14303e, 1);
            g.fillRect(3, 3, S-6, S-9);
            g.fillStyle(0x081420, 1);
            g.fillRect(5, 5, S-10, S-14);
            g.lineStyle(1, 0x0e2a3c, 1);
            for (let i = 0; i < 4; i++) g.lineBetween(5, 7+i*5, S-5, 7+i*5);
            g.fillStyle(0x00aaff, 1);
            g.fillRect(7, 8, 5, 8);
            g.fillStyle(0x00aaff, 0.8);
            g.fillCircle(S-6, S-6, 2);
            g.fillStyle(0x14303e, 1);
            g.fillRect(S/2-3, S-7, 6, 4);
            g.fillRect(S/2-6, S-4, 12, 3);
            g.lineStyle(1, 0x00aaff, 0.5);
            g.strokeRect(3, 3, S-6, S-9);
        });

        tex(`tile_${AG.TILE.BOSS_BUG}`, (g, S) => {
            g.fillStyle(0x180808, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x3a0a0a, 1);
            for (let i = -S; i < S*2; i += 7) {
                g.lineBetween(i, 0, i+S, S);
            }
            g.lineStyle(1, 0xff3300, 0.5);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.SPAWN}`, (g, S) => {
            g.fillStyle(0x1a1a2e, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x131325, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x0e0e22, 1);
            [[0,0],[S-2,0],[0,S-2],[S-2,S-2]].forEach(([px,py]) => g.fillRect(px,py,2,2));
        });

        tex(`tile_${AG.TILE.ROAD_RESTORED}`, (g, S) => {
            g.fillStyle(0x092016, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(2, 0x00ff88, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x00ff88, 1);
            [[0,0],[S,0],[0,S],[S,S]].forEach(([px,py]) => g.fillCircle(px, py, 3));
            g.fillCircle(S/2, S/2, 3);
            g.lineStyle(1, 0x00cc55, 1);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.FLOOR_LIT}`, (g, S) => {
            g.fillStyle(0x192a1d, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x1d3c22, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x00aa44, 0.4);
            [[0,0],[S,0],[0,S],[S,S]].forEach(([px,py]) => g.fillCircle(px, py, 2));
        });

        tex(`tile_${AG.TILE.TABLET_ITEM}`, (g, S) => {
            // Floor base
            g.fillStyle(0x1a1a2e, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x131325, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            // Ambient glow under device
            g.fillStyle(0x00ccff, 0.1);
            g.fillCircle(S/2, S/2, 10);
            // Tablet body
            g.fillStyle(0x1a3352, 1);
            g.fillRoundedRect(S/2 - 7, S/2 - 5, 14, 11, 2);
            // Screen
            g.fillStyle(0x00ccff, 0.85);
            g.fillRoundedRect(S/2 - 5, S/2 - 3, 10, 7, 1);
            // Scanline
            g.lineStyle(1, 0xaaeeff, 0.45);
            g.lineBetween(S/2 - 4, S/2, S/2 + 4, S/2);
            // Border glow
            g.lineStyle(1, 0x00ccff, 0.7);
            g.strokeRoundedRect(S/2 - 7, S/2 - 5, 14, 11, 2);
        });

        tex(`tile_${AG.TILE.ARIA_GATE}`, (g, S) => {
            g.fillStyle(0x061210, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x0c2820, 1);
            g.fillRect(0, 0, 8, S);
            g.lineStyle(1, 0x00ccaa, 0.8);
            g.lineBetween(8, 0, 8, S);
            g.fillStyle(0x0c2820, 1);
            g.fillRect(S-8, 0, 8, S);
            g.lineStyle(1, 0x00ccaa, 0.8);
            g.lineBetween(S-9, 0, S-9, S);
            g.fillStyle(0x00ccaa, 1);
            [4, S/2, S-4].forEach(py => {
                g.fillCircle(4, py, 1.5);
                g.fillCircle(S-4, py, 1.5);
            });
            g.fillStyle(0x00aa88, 1);
            g.fillRect(8, S/2 - 2, S-16, 4);
            g.lineStyle(1, 0x00ddbb, 0.45);
            g.lineBetween(8, S/2 - 6, S-8, S/2 - 6);
            g.lineBetween(8, S/2 + 6, S-8, S/2 + 6);
            g.fillStyle(0x00bbaa, 1);
            g.fillRect(4, 0, S-8, 4);
            g.fillRect(4, S-4, S-8, 4);
            g.lineStyle(1, 0x00ccaa, 0.6);
            g.strokeRect(0, 0, S, S);
        });

        tex(`tile_${AG.TILE.FIREWALL}`, (g, S) => {
            g.fillStyle(0x1a0a0e, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x3d1218, 1);
            g.fillRect(2, 2, S - 4, S - 4);
            g.lineStyle(2, 0xff5533, 0.95);
            for (let i = 4; i < S; i += 6) {
                g.lineBetween(i, 2, i - 4, S - 2);
            }
            g.lineStyle(1, 0xff8866, 0.75);
            g.strokeRect(1, 1, S - 2, S - 2);
        });

        tex(`tile_${AG.TILE.DATA_FLOOD}`, (g, S) => {
            g.fillStyle(0x09122a, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x143670, 0.85);
            g.fillRoundedRect(1, 3, S - 2, S - 6, 5);
            g.fillStyle(0x67b3ff, 0.55);
            g.fillEllipse(S * 0.33, S * 0.45, 8, 4);
            g.fillEllipse(S * 0.68, S * 0.58, 10, 5);
            g.lineStyle(1, 0x7cbfff, 0.8);
            g.strokeRoundedRect(1, 3, S - 2, S - 6, 5);
        });

        tex(`tile_${AG.TILE.CACHE_NODE}`, (g, S) => {
            g.fillStyle(0x1a1a2e, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x2f1b48, 1);
            g.fillRoundedRect(S / 2 - 8, S / 2 - 8, 16, 16, 3);
            g.fillStyle(0xf0b0ff, 0.8);
            g.fillCircle(S / 2, S / 2, 4);
            g.lineStyle(1, 0xd39cff, 0.95);
            g.strokeRoundedRect(S / 2 - 8, S / 2 - 8, 16, 16, 3);
            g.lineStyle(1, 0x9e6ad1, 0.9);
            g.lineBetween(S / 2 - 8, S / 2, S / 2 + 8, S / 2);
            g.lineBetween(S / 2, S / 2 - 8, S / 2, S / 2 + 8);
        });

        g.destroy();
    }

    // -------------------------------------------------------------------------
    // Player textures
    // -------------------------------------------------------------------------

    _generatePlayerTextures(AG) {
        const S = AG.TILE_SIZE;
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        g.clear();
        g.fillStyle(0x001a0d, 0.5);
        g.fillEllipse(S/2, S/2 + 10, 16, 6);
        g.fillStyle(0x00cc66, 1);
        g.fillRoundedRect(S/2 - 5, S/2 + 5, 4, 6, 1);
        g.fillRoundedRect(S/2 + 1, S/2 + 5, 4, 6, 1);
        g.fillStyle(0x00ff88, 1);
        g.fillRoundedRect(S/2 - 6, S/2 - 3, 12, 9, 2);
        g.fillStyle(0x00dd77, 1);
        g.fillRoundedRect(S/2 - 9, S/2 - 2, 4, 7, 1);
        g.fillRoundedRect(S/2 + 5, S/2 - 2, 4, 7, 1);
        g.fillStyle(0x00ff88, 1);
        g.fillRect(S/2 - 2, S/2 - 6, 4, 4);
        g.fillStyle(0x33ffaa, 1);
        g.fillCircle(S/2, S/2 - 10, 7);
        g.fillStyle(0x001a0d, 1);
        g.fillCircle(S/2 + 2, S/2 - 10, 2);
        g.fillCircle(S/2 - 2, S/2 - 11, 1.5);
        g.fillStyle(0x66ffcc, 0.5);
        g.fillCircle(S/2 - 1, S/2 - 13, 3);

        g.generateTexture('player_right', S, S);
        g.destroy();
    }

    // -------------------------------------------------------------------------
    // Map rendering
    // -------------------------------------------------------------------------

    _renderMap(AG) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const S   = AG.TILE_SIZE;

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const tileId = map[row][col];
                const x      = col * S + S / 2;
                const y      = row * S + S / 2;
                const img    = this.add.image(x, y, `tile_${tileId}`);
                this.tileImages[`${col},${row}`] = img;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Shrine overlay
    // -------------------------------------------------------------------------

    _renderShrineOverlays(AG) {
        const S   = AG.TILE_SIZE;
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;

        const seen = new Set();
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] !== AG.TILE.SHRINE) continue;
                if (col > 0 && map[row]?.[col-1] === AG.TILE.SHRINE) continue;
                if (row > 0 && map[row-1]?.[col]  === AG.TILE.SHRINE) continue;
                const key = `${col},${row}`;
                if (seen.has(key)) continue;
                seen.add(key);
                this._drawShrineBuilding(col, row, S);
            }
        }
    }

    _drawShrineBuilding(col, row, S) {
        const cx = col * S + S;
        const cy = row * S + S;
        const W  = S * 2;
        const H  = S * 2 + 4;

        const g = this.add.graphics().setDepth(5);

        g.fillStyle(0x1a3a22, 1);
        g.fillRect(cx - W/2 - 4, cy + H/2 - 12, W + 8, 12);
        g.lineStyle(1, 0x00aa44, 0.6);
        g.strokeRect(cx - W/2 - 4, cy + H/2 - 12, W + 8, 12);
        g.fillStyle(0x153018, 1);
        g.fillRect(cx - W/2 - 2, cy + H/2 - 8, W + 4, 4);
        g.fillStyle(0x1a3a22, 1);
        g.fillRect(cx - W/2, cy + H/2 - 4, W, 4);
        g.fillStyle(0x0d2214, 1);
        g.fillRect(cx - W/2, cy - H/2 + 14, W, H - 26);
        g.lineStyle(1, 0x0f2a18, 1);
        for (let ly = 0; ly < 3; ly++) {
            g.lineBetween(cx - W/2, cy - H/2 + 24 + ly * 10, cx + W/2, cy - H/2 + 24 + ly * 10);
        }
        g.fillStyle(0x174028, 1);
        g.fillRect(cx - W/2, cy - H/2 + 14, 10, H - 26);
        g.fillRect(cx + W/2 - 10, cy - H/2 + 14, 10, H - 26);
        g.lineStyle(1, 0x00cc55, 0.7);
        g.lineBetween(cx - W/2 + 10, cy - H/2 + 14, cx - W/2 + 10, cy + H/2 - 12);
        g.lineBetween(cx + W/2 - 11, cy - H/2 + 14, cx + W/2 - 11, cy + H/2 - 12);
        g.fillStyle(0x1e4a30, 1);
        g.fillRect(cx - W/2 - 2, cy - H/2 + 12, 14, 5);
        g.fillRect(cx + W/2 - 12, cy - H/2 + 12, 14, 5);
        g.fillStyle(0x040f08, 1);
        g.fillRect(cx - 12, cy - H/2 + 30, 24, H - 54);
        g.fillEllipse(cx, cy - H/2 + 30, 24, 16);
        g.fillStyle(0x00ff88, 0.12);
        g.fillRect(cx - 10, cy - H/2 + 32, 20, H - 56);
        g.lineStyle(1, 0x00cc55, 0.8);
        g.strokeRect(cx - 12, cy - H/2 + 30, 24, H - 54);
        g.fillStyle(0x1a4828, 1);
        g.fillTriangle(cx, cy - H/2, cx - W/2 - 4, cy - H/2 + 16, cx + W/2 + 4, cy - H/2 + 16);
        g.lineStyle(2, 0x00ff88, 0.9);
        g.strokeTriangle(cx, cy - H/2, cx - W/2 - 4, cy - H/2 + 16, cx + W/2 + 4, cy - H/2 + 16);
        g.lineStyle(1, 0x00cc55, 0.5);
        g.lineBetween(cx - W/2 - 4, cy - H/2 + 16, cx + W/2 + 4, cy - H/2 + 16);
        g.lineStyle(2, 0x00ff88, 1);
        g.lineBetween(cx + 3, cy - H/2 + 4,  cx - 2,  cy - H/2 + 9);
        g.lineBetween(cx - 2, cy - H/2 + 9,  cx + 1,  cy - H/2 + 9);
        g.lineBetween(cx + 1, cy - H/2 + 9,  cx - 3,  cy - H/2 + 14);
        g.lineStyle(1, 0x00aa44, 0.8);
        g.strokeRect(cx - W/2, cy - H/2 + 14, W, H - 26);
        g.fillStyle(0x00ff88, 0.04);
        g.fillCircle(cx, cy, W * 0.8);

        this.tweens.add({
            targets: g, alpha: { from: 0.85, to: 1.0 },
            duration: 1800, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        });
    }

    // -------------------------------------------------------------------------
    // Boss Bug overlay
    // -------------------------------------------------------------------------

    _renderBossBugOverlays(AG) {
        const S   = AG.TILE_SIZE;
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] === AG.TILE.BOSS_BUG) {
                    this._drawBugSprite(col, row, S, true);
                }
            }
        }
    }

    _drawBugSprite(col, row, S, isBoss) {
        const cx = col * S + S / 2;
        const cy = row * S + S / 2;
        const g  = this.add.graphics().setDepth(6);
        const R  = isBoss ? 11 : 8;

        g.lineStyle(isBoss ? 2 : 1, 0xff4400, 0.9);
        const legAngles = [-50, -15, 25];
        legAngles.forEach(angle => {
            const rad = Phaser.Math.DegToRad(angle);
            const len = isBoss ? 14 : 10;
            g.lineBetween(cx - R * 0.6, cy + angle * 0.15,
                          cx - R * 0.6 - Math.cos(rad) * len,
                          cy + angle * 0.15 - Math.sin(rad) * len);
            g.lineBetween(cx + R * 0.6, cy + angle * 0.15,
                          cx + R * 0.6 + Math.cos(rad) * len,
                          cy + angle * 0.15 - Math.sin(rad) * len);
        });
        g.lineStyle(isBoss ? 1.5 : 1, 0xff6600, 0.9);
        g.lineBetween(cx - 4, cy - R, cx - 9, cy - R - 9);
        g.lineBetween(cx + 4, cy - R, cx + 9, cy - R - 9);
        g.fillStyle(0xff4400, 1);
        g.fillCircle(cx - 9, cy - R - 9, 1.5);
        g.fillCircle(cx + 9, cy - R - 9, 1.5);
        g.fillStyle(0xcc2200, 1);
        g.fillEllipse(cx, cy + R * 0.4, R * 1.6, R * 1.3);
        g.lineStyle(1, 0xff4400, 0.6);
        for (let i = 1; i < 3; i++) {
            g.lineBetween(cx - R * 0.7, cy + R * 0.4 - 3 + i * 4,
                          cx + R * 0.7, cy + R * 0.4 - 3 + i * 4);
        }
        g.fillStyle(0xdd2800, 1);
        g.fillEllipse(cx, cy - R * 0.1, R * 1.2, R * 1.0);
        g.fillStyle(0xee3300, 1);
        g.fillCircle(cx, cy - R, isBoss ? R * 0.8 : R * 0.7);
        g.fillStyle(0xffcc00, 1);
        g.fillCircle(cx - 3, cy - R - 1, isBoss ? 2.5 : 2);
        g.fillCircle(cx + 3, cy - R - 1, isBoss ? 2.5 : 2);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(cx - 2.5, cy - R - 1.5, 1);
        g.fillCircle(cx + 3.5, cy - R - 1.5, 1);
        g.lineStyle(1, 0xff6644, 0.5);
        g.strokeEllipse(cx, cy - R * 0.1, R * 1.2, R * 1.0);

        if (isBoss) {
            g.fillStyle(0xff2200, 0.1);
            g.fillCircle(cx, cy, R * 2.2);
            g.lineStyle(1, 0xff4400, 0.3);
            g.strokeCircle(cx, cy, R * 1.9);
        }

        this._bugOverlays[`${col},${row}`] = g;

        this.tweens.add({
            targets: g, y: { from: -2, to: 2 },
            duration: isBoss ? 700 : 500, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        });
        this.tweens.add({
            targets: g, alpha: { from: 0.85, to: 1.0 },
            duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        });
    }

    _renderChancePickups(AG) {
        const pickups = window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS?.chancePickups || [];
        const collected = AG.collectedPickups || new Set();
        pickups.forEach((pickup) => {
            if (!pickup?.id || collected.has(pickup.id)) return;
            this._spawnChancePickupSprite(pickup.id, pickup.col, pickup.row, AG.TILE_SIZE);
        });
    }

    _spawnChancePickupSprite(pickupId, col, row, tileSize) {
        const cx = col * tileSize + tileSize / 2;
        const cy = row * tileSize + tileSize / 2;
        const g = this.add.graphics().setDepth(7);

        g.fillStyle(0xff3355, 0.95);
        g.fillCircle(cx - 4, cy - 2, 4.6);
        g.fillCircle(cx + 4, cy - 2, 4.6);
        g.fillTriangle(cx - 9, cy, cx + 9, cy, cx, cy + 10);
        g.lineStyle(1, 0xff99aa, 0.8);
        g.strokeCircle(cx - 4, cy - 2, 4.6);
        g.strokeCircle(cx + 4, cy - 2, 4.6);
        g.strokeTriangle(cx - 9, cy, cx + 9, cy, cx, cy + 10);

        const bobTween = this.tweens.add({
            targets: g,
            y: { from: -2, to: 2 },
            duration: 750,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });
        const pulseTween = this.tweens.add({
            targets: g,
            alpha: { from: 0.8, to: 1.0 },
            duration: 900,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        // Hidden by default: players must get close to discover it.
        g.alpha = 0;
        g.visible = false;

        this._pickupSprites[pickupId] = {
            graphics: g,
            col,
            row,
            revealed: false,
            tweens: [bobTween, pulseTween],
        };
    }

    _collectChancePickup(pickupId) {
        const entry = this._pickupSprites[pickupId];
        if (!entry) return;
        delete this._pickupSprites[pickupId];
        const sprite = entry.graphics;
        (entry.tweens || []).forEach((t) => {
            try { t.stop(); } catch (_) {}
        });
        this.tweens.add({
            targets: sprite,
            alpha: 0,
            duration: 180,
            onComplete: () => {
                try { sprite.destroy(); } catch (_) {}
            },
        });
    }

    _revealNearbyChancePickups(playerCol, playerRow) {
        const REVEAL_RADIUS = 1; // must be adjacent (or standing on it)
        Object.values(this._pickupSprites).forEach((entry) => {
            if (!entry || entry.revealed) return;
            const dist = Math.abs(entry.col - playerCol) + Math.abs(entry.row - playerRow);
            if (dist > REVEAL_RADIUS) return;
            entry.revealed = true;
            entry.graphics.visible = true;
            entry.graphics.alpha = 0;
            this.tweens.add({
                targets: entry.graphics,
                alpha: 1,
                duration: 260,
                ease: 'Sine.easeOut',
            });
        });
    }

    _checkChancePickup(playerCol, playerRow, AG) {
        this._revealNearbyChancePickups(playerCol, playerRow);
        const pickups = window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS?.chancePickups || [];
        const collected = AG.collectedPickups || new Set();
        for (const pickup of pickups) {
            if (!pickup?.id) continue;
            if (collected.has(pickup.id)) continue;
            if (pickup.col === playerCol && pickup.row === playerRow) {
                this._collectChancePickup(pickup.id);
                AG.events.emit('pickup:collected', { pickupId: pickup.id });
                return;
            }
        }
    }

    _checkTabletPickup(playerCol, playerRow, AG) {
        const tabletPos = window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS?.tabletItem;
        if (!tabletPos) return;
        if (AG.collectedPickups?.has('tablet')) return;
        if (playerCol === tabletPos.col && playerRow === tabletPos.row) {
            // Replace the tablet tile with plain floor so it's visually gone
            this.updateTile(tabletPos.col, tabletPos.row, AG.TILE.FLOOR);
            AG.events.emit('tablet:pickup');
        }
    }

    // -------------------------------------------------------------------------
    // Roaming bug system
    // -------------------------------------------------------------------------

    /**
     * Spawn the initial roaming bug 3 s after the ARIA gate opens (new players)
     * or immediately on a 3 s timer for returning players who already completed
     * the intro sequence.  This ensures bugs never appear in the intro room.
     */
    _initRoamingBugs(AG) {
        const spawnFirst = () => {
            this.time.delayedCall(3000, () => {
                if (!this.scene || !this.scene.isActive('OriginNodeScene')) return;
                const pos = this._randomBugSpawnPos(8);
                if (pos) this._spawnRoamingBug(pos.col, pos.row, AG);
            });
        };

        if (AG.introComplete) {
            // Returning player — gate already open, safe to start the timer
            spawnFirst();
        } else {
            // New player — wait until ARIA opens the gate after the intro panel
            AG.events.once('aria_gate:open', spawnFirst);
        }
    }

    /**
     * Pick a random floor or road tile at least `minDist` tiles (Manhattan)
     * from the player's current position.  Returns { col, row } or null.
     */
    _randomBugSpawnPos(minDist = 5) {
        const AG  = window.ARIA_GAME;
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const OK  = [AG.TILE.FLOOR, AG.TILE.ROAD, AG.TILE.SPAWN];

        const candidates = [];
        for (let row = 1; row < map.length - 1; row++) {
            for (let col = 1; col < map[row].length - 1; col++) {
                if (!OK.includes(map[row][col])) continue;
                const dist = Math.abs(col - this.tileX) + Math.abs(row - this.tileY);
                if (dist < minDist) continue;
                candidates.push({ col, row });
            }
        }
        if (!candidates.length) return null;
        return candidates[Math.floor(Math.random() * candidates.length)];
    }

    /**
     * Spawn a roaming bug at (col, row), draw its sprite, register it in
     * this._roamingBugs, and start its idle tweens.
     */
    _spawnRoamingBug(col, row, AG) {
        const S  = AG.TILE_SIZE;
        const id = this._nextBugId++;
        const cx = col * S + S / 2;
        const cy = row * S + S / 2;
        const R  = 8;

        const g = this.add.graphics().setDepth(6);
        g.alpha = 0;    // will fade in

        // ── Legs ──────────────────────────────────────────────────────────
        g.lineStyle(1, 0xff4400, 0.9);
        [-50, -15, 25].forEach(angle => {
            const rad = Phaser.Math.DegToRad(angle);
            const len = 10;
            g.lineBetween(cx - R * 0.6, cy + angle * 0.15,
                          cx - R * 0.6 - Math.cos(rad) * len,
                          cy + angle * 0.15 - Math.sin(rad) * len);
            g.lineBetween(cx + R * 0.6, cy + angle * 0.15,
                          cx + R * 0.6 + Math.cos(rad) * len,
                          cy + angle * 0.15 - Math.sin(rad) * len);
        });

        // ── Antennae ──────────────────────────────────────────────────────
        g.lineStyle(1, 0xff6600, 0.9);
        g.lineBetween(cx - 4, cy - R, cx - 9, cy - R - 9);
        g.lineBetween(cx + 4, cy - R, cx + 9, cy - R - 9);
        g.fillStyle(0xff4400, 1);
        g.fillCircle(cx - 9, cy - R - 9, 1.5);
        g.fillCircle(cx + 9, cy - R - 9, 1.5);

        // ── Abdomen ───────────────────────────────────────────────────────
        g.fillStyle(0xcc2200, 1);
        g.fillEllipse(cx, cy + R * 0.4, R * 1.6, R * 1.3);
        g.lineStyle(1, 0xff4400, 0.6);
        [1, 2].forEach(i => {
            g.lineBetween(cx - R * 0.7, cy + R * 0.4 - 3 + i * 4,
                          cx + R * 0.7, cy + R * 0.4 - 3 + i * 4);
        });

        // ── Body + head ───────────────────────────────────────────────────
        g.fillStyle(0xdd2800, 1);
        g.fillEllipse(cx, cy - R * 0.1, R * 1.2, R * 1.0);
        g.fillStyle(0xee3300, 1);
        g.fillCircle(cx, cy - R, R * 0.7);
        g.fillStyle(0xffcc00, 1);
        g.fillCircle(cx - 3, cy - R - 1, 2);
        g.fillCircle(cx + 3, cy - R - 1, 2);
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(cx - 2.5, cy - R - 1.5, 1);
        g.fillCircle(cx + 3.5, cy - R - 1.5, 1);
        g.lineStyle(1, 0xff6644, 0.5);
        g.strokeEllipse(cx, cy - R * 0.1, R * 1.2, R * 1.0);

        // ── Danger-radius ring (faint, shows attack range) ────────────────
        g.lineStyle(1, 0xff2200, 0.12);
        g.strokeCircle(cx, cy, 2.2 * S);   // smaller visual hint ring

        // ── Tweens ────────────────────────────────────────────────────────
        const bobTween = this.tweens.add({
            targets: g,
            scaleX: { from: 1.0, to: 1.05 },
            scaleY: { from: 1.0, to: 1.05 },
            duration: 650,
            ease: 'Sine.easeInOut',
            yoyo: true,
            repeat: -1,
        });

        // Fade in, then switch to idle pulse
        this.tweens.add({
            targets: g, alpha: 1, duration: 600, ease: 'Cubic.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: g, alpha: { from: 0.85, to: 1.0 },
                    duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
                });
            },
        });

        const bug = {
            id,
            col,
            row,
            graphics: g,
            tweens: [bobTween],
            moveTimer: null,
            moveTween: null,
        };
        this._roamingBugs.push(bug);
        this._updateRoamingBugVisibility();
        this._scheduleRoamingBugMove(id, AG);
        return bug;
    }

    _scheduleRoamingBugMove(id, AG) {
        const bug = this._roamingBugs.find(b => b.id === id);
        if (!bug) return;
        if (bug.moveTimer) {
            try { bug.moveTimer.destroy(); } catch (_) {}
            bug.moveTimer = null;
        }
        bug.moveTimer = this.time.delayedCall(1400 + Math.floor(Math.random() * 900), () => {
            this._attemptRoamingBugMove(id, AG);
        });
    }

    _attemptRoamingBugMove(id, AG) {
        const bug = this._roamingBugs.find(b => b.id === id);
        if (!bug) return;
        if (this._bugAttacking || this.inputLocked) {
            this._scheduleRoamingBugMove(id, AG);
            return;
        }

        const dirs = Phaser.Utils.Array.Shuffle([
            { dc: 1, dr: 0 },
            { dc: -1, dr: 0 },
            { dc: 0, dr: 1 },
            { dc: 0, dr: -1 },
        ]);

        let next = null;
        for (const d of dirs) {
            const col = bug.col + d.dc;
            const row = bug.row + d.dr;
            if (!this._isPassable(col, row)) continue;
            if (Math.abs(col - this.tileX) + Math.abs(row - this.tileY) < 2) continue;
            const occupied = this._roamingBugs.some(other => other.id !== bug.id && other.col === col && other.row === row);
            if (occupied) continue;
            next = { col, row };
            break;
        }

        if (!next) {
            this._scheduleRoamingBugMove(id, AG);
            return;
        }

        if (bug.moveTween) {
            try { bug.moveTween.stop(); } catch (_) {}
            bug.moveTween = null;
        }

        const dx = (next.col - bug.col) * AG.TILE_SIZE;
        const dy = (next.row - bug.row) * AG.TILE_SIZE;

        bug.moveTween = this.tweens.add({
            targets: bug.graphics,
            x: bug.graphics.x + dx,
            y: bug.graphics.y + dy,
            duration: 360,
            ease: 'Sine.easeInOut',
            onComplete: () => {
                bug.col = next.col;
                bug.row = next.row;
                bug.moveTween = null;
                this._updateRoamingBugVisibility();
                this._scheduleRoamingBugMove(id, AG);
            },
        });
    }

    _updateRoamingBugVisibility() {
        const MAX_VISIBLE_DIST = 10;
        for (const bug of this._roamingBugs) {
            const dist = Math.abs(this.tileX - bug.col) + Math.abs(this.tileY - bug.row);
            bug.graphics.visible = dist <= MAX_VISIBLE_DIST;
        }
    }

    /**
     * Fade out and destroy a roaming bug, then schedule a respawn after 60 s.
     */
    _despawnRoamingBug(id, AG) {
        const idx = this._roamingBugs.findIndex(b => b.id === id);
        if (idx === -1) return;

        const bug = this._roamingBugs.splice(idx, 1)[0];
        this._bugAttacking = false;

        bug.tweens.forEach(t => { try { t.stop(); } catch (_) {} });
        if (bug.moveTimer) {
            try { bug.moveTimer.destroy(); } catch (_) {}
            bug.moveTimer = null;
        }
        if (bug.moveTween) {
            try { bug.moveTween.stop(); } catch (_) {}
            bug.moveTween = null;
        }

        this.tweens.add({
            targets: bug.graphics, alpha: 0, duration: 400,
            onComplete: () => { try { bug.graphics.destroy(); } catch (_) {} },
        });

        // Respawn at a new random location after 60 seconds
        this.time.delayedCall(60000, () => {
            if (!this.scene || !this.scene.isActive('OriginNodeScene')) return;
            const pos = this._randomBugSpawnPos(5);
            if (pos) this._spawnRoamingBug(pos.col, pos.row, AG);
        });
    }

    /**
     * Called on every player:moved event.  If the player steps within 3 tiles
     * of any roaming bug, emit roaming_bug:attack to trigger the challenge.
     */
    _checkRoamingBugProximity(playerCol, playerRow, AG) {
        if (this._bugAttacking) return;     // challenge already open
        if (this.inputLocked)   return;     // another overlay is open

        const ATTACK_RADIUS = 3;
        for (const bug of this._roamingBugs) {
            const dist = Math.abs(playerCol - bug.col) + Math.abs(playerRow - bug.row);
            if (dist <= ATTACK_RADIUS) {
                this._bugAttacking = true;
                AG.events.emit('roaming_bug:attack', { id: bug.id });
                return;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Tile swap
    // -------------------------------------------------------------------------

    updateTile(col, row, newTileId) {
        const AG  = window.ARIA_GAME;
        const S   = AG.TILE_SIZE;
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const key = `${col},${row}`;

        map[row][col] = newTileId;

        const existing = this.tileImages[key];
        if (existing) existing.destroy();

        const x   = col * S + S / 2;
        const y   = row * S + S / 2;
        const img = this.add.image(x, y, `tile_${newTileId}`);
        this.tileImages[key] = img;

        this.tweens.add({
            targets: img, alpha: { from: 0, to: 1 },
            duration: 400, ease: 'Cubic.easeOut',
        });
    }

    // -------------------------------------------------------------------------
    // Player
    // -------------------------------------------------------------------------

    _createPlayer(AG) {
        const S = AG.TILE_SIZE;
        const x = this.tileX * S + S / 2;
        const y = this.tileY * S + S / 2;

        this.playerShadow = this.add.ellipse(x, y + 10, 18, 8, 0x000000, 0.35).setDepth(7);
        this.playerGlow   = this.add.circle(x, y, 16, 0x00ff88, 0.12).setDepth(7);
        this.player       = this.add.image(x, y, 'player_right').setDepth(8);

        // Click target indicator (shows where the player is walking to)
        this._clickMarker = this.add.graphics().setDepth(4);

        this.tweens.add({
            targets: this.playerGlow, alpha: { from: 0.08, to: 0.22 },
            duration: 900, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
        });
    }

    // -------------------------------------------------------------------------
    // Camera
    // -------------------------------------------------------------------------

    _setupCamera(AG) {
        const map  = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const S    = AG.TILE_SIZE;
        const mapW = map[0].length * S;
        const mapH = map.length    * S;

        this.cameras.main.setBounds(0, 0, mapW, mapH);
        this.cameras.main.setRoundPixels(true);
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);

        const viewportW = this.cameras.main.width;
        const viewportH = this.cameras.main.height;
        const fitZoom = Math.min(viewportW / mapW, viewportH / mapH);
        const configuredMin = Number.isFinite(AG.CAMERA_ZOOM_MIN) ? AG.CAMERA_ZOOM_MIN : 0.55;
        const zoomMax = Number.isFinite(AG.CAMERA_ZOOM_MAX) ? AG.CAMERA_ZOOM_MAX : 1.4;
        // Allow deeper zoom-out on large maps while respecting original floor on smaller maps.
        const dynamicMin = Math.max(0.12, fitZoom * 0.9);
        const zoomMin = Math.min(configuredMin, dynamicMin);
        this._cameraZoomMin = zoomMin;
        this._cameraZoomMax = zoomMax;
        const computedStart = Math.min(1, fitZoom * 1.08);
        const defaultZoom = Number.isFinite(computedStart)
            ? Phaser.Math.Clamp(computedStart, zoomMin, zoomMax)
            : 1;
        // Restore the zoom level the player had when they last left.
        let startZoom = defaultZoom;
        try {
            const saved = parseFloat(localStorage.getItem('aria_camera_zoom_v1'));
            if (Number.isFinite(saved)) {
                startZoom = Phaser.Math.Clamp(saved, zoomMin, zoomMax);
            }
        } catch (_) {}
        this._setCameraZoom(startZoom, AG);
    }

    // -------------------------------------------------------------------------
    // Input - keyboard + click/tap
    // -------------------------------------------------------------------------

    _setupInput(AG) {
        if (this.input.mouse && typeof this.input.mouse.disableContextMenu === 'function') {
            this.input.mouse.disableContextMenu();
        }

        // Keyboard
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd    = this.input.keyboard.addKeys({
            up:    Phaser.Input.Keyboard.KeyCodes.W,
            left:  Phaser.Input.Keyboard.KeyCodes.A,
            down:  Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });

        // When a text field (shrine editor, challenge textarea, etc.) gains focus,
        // stop Phaser from calling preventDefault() on keyboard events — otherwise
        // captured keys like Space, W, A, S, D never reach the input element.
        const kb = this.input.keyboard;
        window.addEventListener('focusin', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                kb.disableGlobalCapture();
            }
        });
        window.addEventListener('focusout', (e) => {
            if (e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
                kb.enableGlobalCapture();
            }
        });

        // Click / tap to move
        this.input.on('pointerdown', (pointer) => {
            if (this.inputLocked) return;
            const isRightClick = pointer.rightButtonDown() || pointer.button === 2;
            if (isRightClick) {
                this._freeLookMode = true;
                this._dragPanning = true;
                this._lastPanX = pointer.x;
                this._lastPanY = pointer.y;
                this.cameras.main.stopFollow();
                return;
            }

            // Convert screen pointer to world coordinates accounting for camera
            const worldX = pointer.worldX;
            const worldY = pointer.worldY;
            const S      = AG.TILE_SIZE;

            let targetCol = Math.floor(worldX / S);
            let targetRow = Math.floor(worldY / S);

            // --- Shrine walk-to-interact -----------------------------------------
            // If the player clicks directly on a shrine tile, redirect to the
            // nearest passable neighbour and open the shrine modal on arrival.
            this._shrineToInteract = null;
            {
                const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
                if (
                    targetRow >= 0 && targetRow < map.length &&
                    targetCol >= 0 && targetCol < map[0].length &&
                    map[targetRow][targetCol] === AG.TILE.SHRINE
                ) {
                    const neighbors = [
                        { col: targetCol - 1, row: targetRow },
                        { col: targetCol + 1, row: targetRow },
                        { col: targetCol,     row: targetRow - 1 },
                        { col: targetCol,     row: targetRow + 1 },
                    ].filter(n => this._isPassable(n.col, n.row));

                    if (neighbors.length > 0) {
                        // Walk to the closest passable neighbour, open shrine on arrival
                        neighbors.sort((a, b) =>
                            (Math.abs(a.col - this.tileX) + Math.abs(a.row - this.tileY)) -
                            (Math.abs(b.col - this.tileX) + Math.abs(b.row - this.tileY))
                        );
                        const nb = neighbors[0];
                        if (nb.col === this.tileX && nb.row === this.tileY) {
                            // Already adjacent — open immediately
                            this._onBump(targetCol, targetRow);
                        } else {
                            this._shrineToInteract = { col: targetCol, row: targetRow };
                            targetCol = nb.col;
                            targetRow = nb.row;
                        }
                    }
                }
            }

            // --- Gate walk-to-interact -------------------------------------------
            // The Manhattan pathfinder can wander away from the gate corridor, so
            // we pre-scan the horizontal band toward the click target for a GATE
            // tile.  When found, redirect the path to the tile just before the gate
            // (on the player's side) and flag _gateToInteract so _drainMoveQueue
            // opens the challenge panel once the player arrives.
            this._gateToInteract = null;  // cancel any previous pending gate walk
            if (targetCol !== this.tileX) {
                const gate = this._scanForGateInRange(
                    this.tileX, this.tileY, targetCol, targetRow
                );
                if (gate) {
                    const dx     = Math.sign(gate.col - this.tileX);
                    const adjCol = gate.col - dx;   // tile just before the gate
                    const adjRow = gate.row;
                    if (adjCol === this.tileX && adjRow === this.tileY) {
                        // Already standing next to gate — open immediately
                        this._onBump(gate.col, gate.row);
                        if (this.inputLocked) return;
                    } else {
                        // Walk to the adjacent tile; challenge opens on arrival
                        this._gateToInteract = gate;
                        targetCol = adjCol;
                        targetRow = adjRow;
                    }
                }
            }

            // Build a simple step-by-step path (Manhattan, no diagonal)
            const path = this._buildPath(this.tileX, this.tileY, targetCol, targetRow);
            if (path.length === 0) return;

            // _buildPath may have called _onBump on a gate/shrine tile, which opens a
            // panel and sets inputLocked + clears _moveQueue.  Don't overwrite the
            // cleared queue with the now-stale partial path — that would leave the
            // queue non-empty after the panel closes, permanently blocking keyboard
            // movement (update() skips _handleKeyboardMovement while queue is non-empty).
            if (this.inputLocked) return;

            // Show a brief click marker at the destination
            this._showClickMarker(targetCol, targetRow, S, AG);

            // Replace any existing queued path
            this._moveQueue = path;
            if (!this._processingQueue) {
                this._drainMoveQueue();
            }
        });

        this.input.on('pointermove', (pointer) => {
            if (!this._dragPanning || !this._freeLookMode) return;
            const cam = this.cameras.main;
            const dx = pointer.x - this._lastPanX;
            const dy = pointer.y - this._lastPanY;
            cam.scrollX -= dx / cam.zoom;
            cam.scrollY -= dy / cam.zoom;
            this._lastPanX = pointer.x;
            this._lastPanY = pointer.y;
        });

        this.input.on('pointerup', () => {
            this._dragPanning = false;
        });

        this.input.on('wheel', (pointer, _objs, _dx, dy, _dz, event) => {
            if (event && typeof event.preventDefault === 'function') event.preventDefault();
            if (this.inputLocked) return;
            const now = Date.now();
            const cooldown = Number.isFinite(AG.CAMERA_WHEEL_COOLDOWN_MS) ? AG.CAMERA_WHEEL_COOLDOWN_MS : 45;
            if (now - this._lastWheelZoomAt < cooldown) return;
            this._lastWheelZoomAt = now;

            const baseStep = Number.isFinite(AG.CAMERA_ZOOM_STEP) ? AG.CAMERA_ZOOM_STEP : 0.05;
            const magnitude = Phaser.Math.Clamp(Math.abs(dy) / 120, 0.35, 1.4);
            const delta = baseStep * magnitude;
            if (dy > 0) {
                this._setCameraZoom(this._cameraZoom - delta, AG, pointer);
            } else if (dy < 0) {
                this._setCameraZoom(this._cameraZoom + delta, AG, pointer);
            }
        });

        this.input.keyboard.on('keydown', (event) => {
            if (!event || this.inputLocked) return;
            const active = document.activeElement;
            if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) return;

            const key = String(event.key || '').toLowerCase();
            if (key === '+' || key === '=' || key === 'add') {
                this._setCameraZoom(this._cameraZoom + AG.CAMERA_ZOOM_STEP, AG);
            } else if (key === '-' || key === '_' || key === 'subtract') {
                this._setCameraZoom(this._cameraZoom - AG.CAMERA_ZOOM_STEP, AG);
            } else if (key === '0') {
                this._setCameraZoom(1, AG);
            } else if (key === 'f') {
                this._freeLookMode = false;
                this._dragPanning = false;
                this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
            } else if (key === 'e') {
                this._interactNearestTile();
            }
        });
    }

    _interactNearestTile() {
        const offsets = [
            { dc: 0, dr: -1 },
            { dc: 1, dr: 0 },
            { dc: 0, dr: 1 },
            { dc: -1, dr: 0 },
        ];
        for (const o of offsets) {
            const col = this.tileX + o.dc;
            const row = this.tileY + o.dr;
            const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
            if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) continue;
            const tileId = map[row][col];
            if (window.ARIA_GAME.INTERACTIVE_TILES.includes(tileId) || tileId === window.ARIA_GAME.TILE.ARIA_GATE) {
                this._onBump(col, row);
                return;
            }
        }
    }

    // -------------------------------------------------------------------------
    // Click-to-move path builder (simple Manhattan walk, stops at walls/gates)
    // -------------------------------------------------------------------------

    _buildPath(fromCol, fromRow, toCol, toRow) {
        const path = [];
        let col = fromCol;
        let row = fromRow;

        // Walk with a higher cap for large region layouts.
        // (Old cap of 30 was too short for the expanded map.)
        let steps = 0;
        const maxSteps = 300;
        while ((col !== toCol || row !== toRow) && steps < maxSteps) {
            const dx = toCol > col ? 1 : toCol < col ? -1 : 0;
            const dy = toRow > row ? 1 : toRow < row ? -1 : 0;

            // Prefer horizontal movement first, then vertical
            if (dx !== 0 && this._isPassable(col + dx, row)) {
                col += dx;
                path.push({ col, row });
            } else if (dy !== 0 && this._isPassable(col, row + dy)) {
                row += dy;
                path.push({ col, row });
            } else {
                // Path is blocked - walk to the last passable tile
                // and bump the blocked tile to trigger interaction.
                // When both dx and dy are non-zero and both directions are
                // impassable, _onBump(col+dx, row+dy) would point to a
                // diagonal wall tile instead of the actual gate/shrine.
                // Prefer horizontal (mirrors movement priority) so clicking
                // anywhere past a gate correctly identifies the gate tile.
                if (dx !== 0) {
                    this._onBump(col + dx, row);
                } else {
                    this._onBump(col, row + dy);
                }

                // The bump tile may be a plain wall rather than a gate —
                // this happens when the gate is in an offset corridor (e.g.
                // gate1 is at row 26 but room1 exits at row 27, so the path
                // hits the east wall of room1 before it can reach the corridor).
                // If we didn't land on an interactive tile, scan a small window
                // ahead in the travel direction for a GATE tile and bump it.
                if (!this.inputLocked && dx !== 0) {
                    const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
                    const AG  = window.ARIA_GAME;
                    outer: for (let dist = 1; dist <= 4; dist++) {
                        for (let ro = -3; ro <= 3; ro++) {
                            const sc = col + dx * dist;
                            const sr = row + ro;
                            if (sr < 0 || sr >= map.length || sc < 0 || sc >= map[0].length) continue;
                            if (map[sr][sc] === AG.TILE.GATE) {
                                this._onBump(sc, sr);
                                break outer;
                            }
                        }
                    }
                }
                break;
            }
            steps++;
        }
        return path;
    }

    _drainMoveQueue() {
        if (this._moveQueue.length === 0 || this.inputLocked) {
            this._processingQueue = false;
            // If the player was walking toward a gate or shrine and has arrived
            // at the adjacent tile, open the panel now.
            if (this._moveQueue.length === 0 && !this.inputLocked) {
                if (this._gateToInteract) {
                    const g = this._gateToInteract;
                    this._gateToInteract = null;
                    const dist = Math.abs(this.tileX - g.col) + Math.abs(this.tileY - g.row);
                    if (dist === 1) this._onBump(g.col, g.row);
                } else if (this._shrineToInteract) {
                    const s = this._shrineToInteract;
                    this._shrineToInteract = null;
                    const dist = Math.abs(this.tileX - s.col) + Math.abs(this.tileY - s.row);
                    if (dist === 1) this._onBump(s.col, s.row);
                }
            }
            return;
        }

        this._processingQueue = true;
        const next = this._moveQueue.shift();
        const AG   = window.ARIA_GAME;

        if (!this._isPassable(next.col, next.row)) {
            // Something changed (gate closed etc) - check for bump interaction
            this._onBump(next.col, next.row);
            this._moveQueue = [];
            this._processingQueue = false;
            return;
        }

        const dx = next.col - this.tileX;
        const dy = next.row - this.tileY;
        this._movePlayer(next.col, next.row, dx, dy, () => {
            this._drainMoveQueue();
        });
    }

    _showClickMarker(col, row, S, AG) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return;

        const g  = this._clickMarker;
        const cx = col * S + S / 2;
        const cy = row * S + S / 2;

        g.clear();
        g.lineStyle(2, 0x00ff88, 0.7);
        g.strokeRect(cx - S/2 + 3, cy - S/2 + 3, S - 6, S - 6);
        g.fillStyle(0x00ff88, 0.15);
        g.fillRect(cx - S/2 + 3, cy - S/2 + 3, S - 6, S - 6);

        // Fade out
        this.tweens.add({
            targets: g, alpha: { from: 1, to: 0 },
            duration: 500, ease: 'Cubic.easeOut',
            onComplete: () => { g.clear(); g.alpha = 1; },
        });
    }

    // -------------------------------------------------------------------------
    // Keyboard movement (existing)
    // -------------------------------------------------------------------------

    _handleKeyboardMovement() {
        // Don't steal keypresses from text inputs (shrine challenge editor, etc.)
        const active = document.activeElement;
        if (active && (active.tagName === 'TEXTAREA' || active.tagName === 'INPUT')) return;

        const { cursors, wasd } = this;
        let dx = 0, dy = 0;

        if (Phaser.Input.Keyboard.JustDown(cursors.left)  || Phaser.Input.Keyboard.JustDown(wasd.left))  dx = -1;
        if (Phaser.Input.Keyboard.JustDown(cursors.right) || Phaser.Input.Keyboard.JustDown(wasd.right)) dx =  1;
        if (Phaser.Input.Keyboard.JustDown(cursors.up)    || Phaser.Input.Keyboard.JustDown(wasd.up))    dy = -1;
        if (Phaser.Input.Keyboard.JustDown(cursors.down)  || Phaser.Input.Keyboard.JustDown(wasd.down))  dy =  1;

        if (dx !== 0) dy = 0;
        if (dx === 0 && dy === 0) return;

        const newCol = this.tileX + dx;
        const newRow = this.tileY + dy;

        if (this._isPassable(newCol, newRow)) {
            this._movePlayer(newCol, newRow, dx, dy);
        } else {
            this._onBump(newCol, newRow);
        }
    }

    _setCameraZoom(nextZoom, AG, pointer) {
        const zoomMin = Number.isFinite(this._cameraZoomMin)
            ? this._cameraZoomMin
            : (Number.isFinite(AG?.CAMERA_ZOOM_MIN) ? AG.CAMERA_ZOOM_MIN : 0.55);
        const zoomMax = Number.isFinite(this._cameraZoomMax)
            ? this._cameraZoomMax
            : (Number.isFinite(AG?.CAMERA_ZOOM_MAX) ? AG.CAMERA_ZOOM_MAX : 1.4);
        const zoomStep = Number.isFinite(AG?.CAMERA_ZOOM_STEP) ? AG.CAMERA_ZOOM_STEP : 0.1;
        if (!Number.isFinite(AG?.CAMERA_ZOOM_STEP)) {
            AG.CAMERA_ZOOM_STEP = zoomStep;
        }
        const safeZoom = Number.isFinite(nextZoom) ? nextZoom : 1;
        const clamped = Phaser.Math.Clamp(safeZoom, zoomMin, zoomMax);
        try { localStorage.setItem('aria_camera_zoom_v1', clamped); } catch (_) {}

        const cam = this.cameras.main;

        // If a pointer was provided, zoom toward the mouse position
        if (pointer) {
            const oldZoom = cam.zoom;

            // World-space coordinates currently under the mouse cursor
            const mouseScreenX = pointer.x - cam.x;
            const mouseScreenY = pointer.y - cam.y;
            const worldX = cam.scrollX + mouseScreenX / oldZoom;
            const worldY = cam.scrollY + mouseScreenY / oldZoom;

            // Stop following the player so we can control scrollX/Y directly
            if (!this._freeLookMode) {
                this._freeLookMode = true;
                cam.stopFollow();
            }

            // Apply the new zoom level
            this._cameraZoom = clamped;
            cam.setZoom(Math.max(0.001, clamped));

            // Shift the scroll so the same world point sits under the mouse
            cam.scrollX = worldX - mouseScreenX / clamped;
            cam.scrollY = worldY - mouseScreenY / clamped;
        } else {
            // Keyboard zoom — no pointer, just zoom in place
            this._cameraZoom = clamped;
            cam.setZoom(Math.max(0.001, clamped));
        }
    }

    _isPassable(col, row) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const AG  = window.ARIA_GAME;
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return false;
        return !AG.IMPASSABLE_TILES.includes(map[row][col]);
    }

    // Updated _movePlayer now accepts an optional onComplete callback
    // so the click-to-move queue can chain steps cleanly
    _movePlayer(newCol, newRow, dx, dy, onComplete) {
        const AG = window.ARIA_GAME;
        const S  = AG.TILE_SIZE;

        this.isMoving = true;
        this.tileX    = newCol;
        this.tileY    = newRow;
        if (dx !== 0) {
            this.lastDX = dx;
            this.player.setFlipX(dx < 0);
        }

        AG.events.emit('player:moved', { col: newCol, row: newRow });

        const targetX = newCol * S + S / 2;
        const targetY = newRow * S + S / 2;

        this.tweens.add({
            targets: this.player,
            y: { from: this.player.y - 2, to: this.player.y },
            duration: AG.MOVE_DURATION / 2,
            ease: 'Sine.easeOut',
        });

        this.tweens.add({
            targets: [this.player, this.playerGlow],
            x: targetX, y: targetY,
            duration: AG.MOVE_DURATION,
            ease: 'Linear',
            onComplete: () => {
                this.isMoving = false;
                if (onComplete) onComplete();
            },
        });

        this.tweens.add({
            targets: this.playerShadow,
            x: targetX, y: targetY + 10,
            duration: AG.MOVE_DURATION,
            ease: 'Linear',
        });
    }

    _onBump(col, row) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const AG  = window.ARIA_GAME;
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return;
        const tileId = map[row][col];

        // ARIA-controlled gate — hint the player if tablet not yet collected
        if (tileId === AG.TILE.ARIA_GATE) {
            if (!AG.collectedPickups?.has('tablet')) {
                AG.events.emit('aria:speak', {
                    text: 'Pick up the tablet. It has the information you need.',
                });
            }
            return;
        }

        if (AG.INTERACTIVE_TILES.includes(tileId)) {
            AG.events.emit('aria:interact', { tileId, col, row });
            return;
        }

        // Fallback: if the bumped tile is not marked interactive but is adjacent
        // to a shrine footprint in map objects, treat it as shrine interaction.
        const shrineFallback = this._findAdjacentShrineTile(col, row);
        if (shrineFallback) {
            AG.events.emit('aria:interact', {
                tileId: AG.TILE.SHRINE,
                col: shrineFallback.col,
                row: shrineFallback.row,
            });
        }
    }

    _findAdjacentShrineTile(col, row) {
        const objs = window.ARIA_GAME.MAPS?.ORIGIN_NODE_OBJECTS || {};
        const shrineKeys = Object.keys(objs).filter((k) => /^shrine[1-6]$/.test(k));
        for (const key of shrineKeys) {
            const tiles = objs[key];
            if (!Array.isArray(tiles)) continue;
            for (const t of tiles) {
                const d = Math.abs((t.col ?? -9999) - col) + Math.abs((t.row ?? -9999) - row);
                if (d <= 1) return t;
            }
        }
        return null;
    }

    /**
     * Scan horizontally from (fromCol, fromRow) toward toCol, checking every
     * column between them for a GATE tile within the vertical span that covers
     * both fromRow and toRow (plus one tile of padding on each side).
     *
     * This is the pre-check used by click-to-move so we detect gates regardless
     * of which row the Manhattan pathfinder might wander to.
     *
     * @returns {{ col, row }|null}
     */
    _scanForGateInRange(fromCol, fromRow, toCol, toRow) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const AG  = window.ARIA_GAME;
        const dx  = Math.sign(toCol - fromCol);
        if (dx === 0) return null;

        const hDist = Math.abs(toCol - fromCol);
        const minRow = Math.min(fromRow, toRow) - 4;
        const maxRow = Math.max(fromRow, toRow) + 4;

        for (let d = 1; d <= hDist; d++) {
            const sc = fromCol + dx * d;
            if (sc < 0 || sc >= map[0].length) continue;
            for (let sr = minRow; sr <= maxRow; sr++) {
                if (sr < 0 || sr >= map.length) continue;
                if (map[sr][sc] === AG.TILE.GATE) return { col: sc, row: sr };
            }
        }
        return null;
    }

    // -------------------------------------------------------------------------
    // Event bus
    // -------------------------------------------------------------------------

    _listenToBus(AG) {
        const TILE = AG.TILE;

        AG.events.on('challenge:open', () => {
            this.inputLocked = true;
            this._moveQueue = [];
            this._processingQueue = false;
            this.input.keyboard.disableGlobalCapture();
        });
        AG.events.on('challenge:close', () => {
            this.inputLocked  = false;
            this._bugAttacking = false;   // allow re-trigger if player is still in range
            this.input.keyboard.enableGlobalCapture();
        });

        // Intro panel input lock (reuses same lock as challenges)
        AG.events.on('intro:open', () => {
            this.inputLocked = true;
            this._moveQueue  = [];
            this._processingQueue = false;
            this.input.keyboard.disableGlobalCapture();
        });
        AG.events.on('intro:close', () => {
            this.inputLocked = false;
            this.input.keyboard.enableGlobalCapture();
        });

        // ARIA gate opened — swap tile to floor
        AG.events.on('aria_gate:open', () => {
            const gatePos = AG.ARIA_GATE_POS;
            if (gatePos) this.updateTile(gatePos.col, gatePos.row, TILE.FLOOR);
        });

        // Roaming bug events
        AG.events.on('player:moved', ({ col, row }) => {
            this._checkTabletPickup(col, row, AG);
            this._checkRoamingBugProximity(col, row, AG);
            this._checkChancePickup(col, row, AG);
            this._updateRoamingBugVisibility();
        });
        AG.events.on('roaming_bug:defeated', ({ id }) => {
            this._despawnRoamingBug(id, AG);
        });

        AG.events.on('gate:open', ({ col, row }) => {
            this.updateTile(col, row, TILE.ROAD);
        });

        AG.events.on('boss_bug:clear', ({ col, row }) => {
            const key = `${col},${row}`;
            if (this._bugOverlays[key]) {
                this.tweens.add({
                    targets: this._bugOverlays[key], alpha: 0, duration: 300,
                    onComplete: () => {
                        this._bugOverlays[key].destroy();
                        delete this._bugOverlays[key];
                    },
                });
            }
            this.updateTile(col, row, TILE.ROAD);
        });

        AG.events.on('region:restore', () => {
            this._restoreRegion(AG);
        });

        AG.events.on('shrine:complete', ({ shrine }) => {
            // shrine.cols/rows are abstract data-grid coords, not map tile positions.
            // The actual tile positions live in ORIGIN_NODE_OBJECTS keyed by shrine id.
            const tiles = window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS?.[shrine.id];
            if (!tiles || tiles.length === 0) return;
            // Use the top-left tile of the 2×2 block (same anchor _drawShrineBuilding uses)
            const col = Math.min(...tiles.map(t => t.col));
            const row = Math.min(...tiles.map(t => t.row));
            this._drawShrineComplete(col, row);
        });

        AG.events.on('pickups:sync', ({ collected }) => {
            (collected || []).forEach((pickupId) => {
                if (pickupId === 'tablet') {
                    // Tablet already collected on a previous visit — remove the tile
                    const tabletPos = window.ARIA_GAME.MAPS.ORIGIN_NODE_OBJECTS?.tabletItem;
                    if (tabletPos) this.updateTile(tabletPos.col, tabletPos.row, TILE.FLOOR);
                } else {
                    this._collectChancePickup(pickupId);
                }
            });
        });

        AG.events.on('player:restore-pos', ({ col, row }) => {
            if (!Number.isFinite(col) || !Number.isFinite(row)) return;
            if (!this._isPassable(col, row)) return;
            this.tileX = col;
            this.tileY = row;
            const S = AG.TILE_SIZE;
            const x = col * S + S / 2;
            const y = row * S + S / 2;
            if (this.player) {
                this.player.x = x;
                this.player.y = y;
            }
            if (this.playerGlow) {
                this.playerGlow.x = x;
                this.playerGlow.y = y;
            }
            if (this.playerShadow) {
                this.playerShadow.x = x;
                this.playerShadow.y = y + 10;
            }
            this._moveQueue = [];
            this._processingQueue = false;
            if (!this._freeLookMode) {
                this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
            }
            this._updateRoamingBugVisibility();
        });

        AG.events.on('camera:recenter', () => {
            this._freeLookMode = false;
            this._dragPanning = false;
            this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
        });
    }

    /** Overlay a golden "completed" glow on top of a shrine building. */
    _drawShrineComplete(col, row) {
        const S  = window.ARIA_GAME.TILE_SIZE;
        const cx = col * S + S;
        const cy = row * S + S;
        const W  = S * 2;
        const H  = S * 2 + 4;

        // Gold ambient glow (behind the shrine building, depth just above tiles)
        const glow = this.add.graphics().setDepth(4);
        glow.fillStyle(0xffaa22, 0.18);
        glow.fillCircle(cx, cy, W * 1.1);

        // Gold overlay on the building (on top of the green shrine, depth 6)
        const g = this.add.graphics().setDepth(6);

        // Roof triangle — replace green with gold
        g.fillStyle(0xffaa22, 0.55);
        g.fillTriangle(cx, cy - H / 2, cx - W / 2 - 4, cy - H / 2 + 16, cx + W / 2 + 4, cy - H / 2 + 16);
        g.lineStyle(2, 0xffdd55, 1);
        g.strokeTriangle(cx, cy - H / 2, cx - W / 2 - 4, cy - H / 2 + 16, cx + W / 2 + 4, cy - H / 2 + 16);

        // Gold border on the outer wall
        g.lineStyle(1, 0xffcc44, 0.7);
        g.strokeRect(cx - W / 2, cy - H / 2 + 14, W, H - 26);

        // Gold tint on the display screen
        g.fillStyle(0xffaa22, 0.1);
        g.fillRect(cx - 10, cy - H / 2 + 32, 20, H - 56);

        // ✓ checkmark above the shrine roof
        this.add.text(cx, cy - H / 2 - 6, '✓', {
            fontFamily: 'Courier New, Courier, monospace',
            fontSize:   '13px',
            color:      '#ffdd55',
            stroke:     '#000000',
            strokeThickness: 3,
        }).setOrigin(0.5, 1).setDepth(7);

        // Soft gold outline glow ring
        const ring = this.add.graphics().setDepth(4);
        ring.lineStyle(2, 0xffcc44, 0.4);
        ring.strokeCircle(cx, cy, W * 0.88);
    }

    // -------------------------------------------------------------------------
    // Region restoration
    // -------------------------------------------------------------------------

    _restoreRegion(AG) {
        const TILE = AG.TILE;
        const map  = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const STEP = 28;

        this.inputLocked = true;
        this._moveQueue  = [];
        this.cameras.main.flash(450, 255, 255, 255);

        this.tweens.killTweensOf(this.playerGlow);
        this.tweens.add({
            targets: this.playerGlow, scaleX: 4, scaleY: 4, alpha: 0.7,
            duration: 450, ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.playerGlow,
                    scaleX: 1.2, scaleY: 1.2,
                    alpha: { from: 0.25, to: 0.55 },
                    duration: 600, ease: 'Sine.easeInOut', yoyo: true, repeat: -1,
                });
            },
        });

        const ORIGIN = { col: 163, row: 24 };   // boss chamber (end of the path)
        const tilesToRestore = [];

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const t    = map[row][col];
                const dist = Math.abs(col - ORIGIN.col) + Math.abs(row - ORIGIN.row);
                if (t === TILE.ROAD || t === TILE.SPAWN) {
                    tilesToRestore.push({ col, row, dist, newType: TILE.ROAD_RESTORED });
                } else if (t === TILE.FLOOR) {
                    tilesToRestore.push({ col, row, dist: dist + 0.5, newType: TILE.FLOOR_LIT });
                }
            }
        }

        tilesToRestore.sort((a, b) => a.dist - b.dist);

        let maxDelay = 0;
        tilesToRestore.forEach(({ col, row, dist, newType }) => {
            const delay = Math.floor(dist * STEP);
            if (delay > maxDelay) maxDelay = delay;
            this.time.delayedCall(delay, () => this.updateTile(col, row, newType));
        });

        this.time.delayedCall(maxDelay + 600, () => {
            this.inputLocked = false;
            AG.events.emit('region:restored', { regionOrder: 1 });
        });
    }
}

window.ARIA_GAME.OriginNodeScene = OriginNodeScene;
