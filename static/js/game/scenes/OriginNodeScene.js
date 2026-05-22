/**
 * ARIA: The Lost Code — Origin Node Scene (Region 1)
 *
 * Visual overhaul: detailed tile art, human player silhouette with direction
 * flip, unified shrine building overlay, actual bug sprite overlay.
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
        this._bugOverlays   = {};   // 'col,row' → bug Graphics object
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
        this._createPlayer(AG);
        this._setupCamera(AG);
        this._setupInput();
        this._listenToBus(AG);

        AG.events.emit('scene:ready', { scene: 'OriginNodeScene' });
        AG.events.emit('aria:speak', {
            text: 'I can see everything, and reach nothing. This is going to be a long day.',
        });
    }

    update() {
        if (!this.isMoving && !this.inputLocked) {
            this._handleMovement();
        }
    }

    // -------------------------------------------------------------------------
    // Tile textures — detailed 32×32 pixel art
    // -------------------------------------------------------------------------

    _generateTileTextures(AG) {
        const S = AG.TILE_SIZE;   // 32
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        const tex = (key, fn) => { g.clear(); fn(g, S); g.generateTexture(key, S, S); };

        // ── WALL ──────────────────────────────────────────────────────────
        tex(`tile_${AG.TILE.WALL}`, (g, S) => {
            g.fillStyle(0x0b0b18, 1);
            g.fillRect(0, 0, S, S);
            // Offset brick rows
            g.fillStyle(0x111126, 1);
            [[0,0],[16,0],[8,16],[24,16]].forEach(([bx, by]) => {
                g.fillRect(bx + 1, by + 1, 13, 13);
            });
            g.lineStyle(1, 0x060614, 1);
            g.strokeRect(0, 0, S, S);
        });

        // ── FLOOR ─────────────────────────────────────────────────────────
        tex(`tile_${AG.TILE.FLOOR}`, (g, S) => {
            g.fillStyle(0x1a1a2e, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x131325, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x0e0e22, 1);
            [[0,0],[S-2,0],[0,S-2],[S-2,S-2]].forEach(([px,py]) => g.fillRect(px,py,2,2));
        });

        // ── ROAD ──────────────────────────────────────────────────────────
        tex(`tile_${AG.TILE.ROAD}`, (g, S) => {
            g.fillStyle(0x15203c, 1);
            g.fillRect(0, 0, S, S);
            // PCB traces
            g.lineStyle(2, 0x283a6a, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            // Solder pads at corners + center
            g.fillStyle(0x3a4e82, 1);
            [[0,0],[S,0],[0,S],[S,S]].forEach(([px,py]) => g.fillCircle(px, py, 3));
            g.fillStyle(0x4a5e92, 1);
            g.fillCircle(S/2, S/2, 2);
            g.lineStyle(1, 0x1e2e52, 1);
            g.strokeRect(0, 0, S, S);
        });

        // ── SHRINE base (unified overlay drawn separately) ─────────────────
        tex(`tile_${AG.TILE.SHRINE}`, (g, S) => {
            g.fillStyle(0x091e12, 1);
            g.fillRect(0, 0, S, S);
            g.fillStyle(0x0d2416, 1);
            g.fillRect(2, 2, S-4, S-4);
            g.lineStyle(1, 0x00883322, 0.4);
            g.strokeRect(1, 1, S-2, S-2);
        });

        // ── GATE ──────────────────────────────────────────────────────────
        tex(`tile_${AG.TILE.GATE}`, (g, S) => {
            g.fillStyle(0x180808, 1);
            g.fillRect(0, 0, S, S);
            // Left pillar
            g.fillStyle(0x341414, 1);
            g.fillRect(0, 0, 8, S);
            g.lineStyle(1, 0xff3333, 0.8);
            g.lineBetween(8, 0, 8, S);
            // Right pillar
            g.fillStyle(0x341414, 1);
            g.fillRect(S-8, 0, 8, S);
            g.lineStyle(1, 0xff3333, 0.8);
            g.lineBetween(S-9, 0, S-9, S);
            // Pillar rivets
            g.fillStyle(0xff5555, 1);
            [4, S/2, S-4].forEach(py => {
                g.fillCircle(4, py, 1.5);
                g.fillCircle(S-4, py, 1.5);
            });
            // Energy barrier beam
            g.fillStyle(0xff1111, 1);
            g.fillRect(8, S/2 - 2, S-16, 4);
            // Secondary glow lines
            g.lineStyle(1, 0xff6666, 0.45);
            g.lineBetween(8, S/2 - 6, S-8, S/2 - 6);
            g.lineBetween(8, S/2 + 6, S-8, S/2 + 6);
            // Cap bars
            g.fillStyle(0xff2222, 1);
            g.fillRect(4, 0, S-8, 4);
            g.fillRect(4, S-4, S-8, 4);
            // Outer border glow
            g.lineStyle(1, 0xff2222, 0.6);
            g.strokeRect(0, 0, S, S);
        });

        // ── BOSS CHAMBER ──────────────────────────────────────────────────
        tex(`tile_${AG.TILE.BOSS_CHAMBER}`, (g, S) => {
            g.fillStyle(0x100618, 1);
            g.fillRect(0, 0, S, S);
            // Heavy stone columns
            g.fillStyle(0x261040, 1);
            g.fillRect(0, 0, 9, S);
            g.fillRect(S-9, 0, 9, S);
            // Column edge glow
            g.lineStyle(1, 0xaa22ff, 0.9);
            g.lineBetween(9, 0, 9, S);
            g.lineBetween(S-10, 0, S-10, S);
            // Lintel
            g.fillStyle(0x261040, 1);
            g.fillRect(0, 0, S, 9);
            g.lineStyle(1, 0xaa22ff, 0.9);
            g.lineBetween(0, 9, S, 9);
            // Interior energy field
            g.fillStyle(0x33095a, 0.7);
            g.fillRect(9, 9, S-18, S-9);
            // Diamond sigil
            g.lineStyle(1, 0xcc44ff, 0.8);
            const cx = S/2, cy = S/2 + 5;
            g.lineBetween(cx, cy-9, cx+9, cy);
            g.lineBetween(cx+9, cy, cx, cy+9);
            g.lineBetween(cx, cy+9, cx-9, cy);
            g.lineBetween(cx-9, cy, cx, cy-9);
            g.fillStyle(0xcc44ff, 0.5);
            g.fillCircle(cx, cy, 2);
            // Outer glow border
            g.lineStyle(2, 0xaa22ff, 1);
            g.strokeRect(0, 0, S, S);
        });

        // ── TERMINAL ──────────────────────────────────────────────────────
        tex(`tile_${AG.TILE.TERMINAL}`, (g, S) => {
            g.fillStyle(0x0c2030, 1);
            g.fillRect(0, 0, S, S);
            // Monitor body
            g.fillStyle(0x14303e, 1);
            g.fillRect(3, 3, S-6, S-9);
            // Screen
            g.fillStyle(0x081420, 1);
            g.fillRect(5, 5, S-10, S-14);
            // Scanlines
            g.lineStyle(1, 0x0e2a3c, 1);
            for (let i = 0; i < 4; i++) g.lineBetween(5, 7+i*5, S-5, 7+i*5);
            // Cursor
            g.fillStyle(0x00aaff, 1);
            g.fillRect(7, 8, 5, 8);
            // Status LED
            g.fillStyle(0x00aaff, 0.8);
            g.fillCircle(S-6, S-6, 2);
            // Stand
            g.fillStyle(0x14303e, 1);
            g.fillRect(S/2-3, S-7, 6, 4);
            g.fillRect(S/2-6, S-4, 12, 3);
            // Border
            g.lineStyle(1, 0x00aaff, 0.5);
            g.strokeRect(3, 3, S-6, S-9);
        });

        // ── BOSS BUG base (bug sprite drawn as overlay) ────────────────────
        tex(`tile_${AG.TILE.BOSS_BUG}`, (g, S) => {
            g.fillStyle(0x180808, 1);
            g.fillRect(0, 0, S, S);
            // Warning diagonal stripes
            g.lineStyle(1, 0x3a0a0a, 1);
            for (let i = -S; i < S*2; i += 7) {
                g.lineBetween(i, 0, i+S, S);
            }
            g.lineStyle(1, 0xff3300, 0.5);
            g.strokeRect(0, 0, S, S);
        });

        // ── SPAWN (same as floor) ─────────────────────────────────────────
        tex(`tile_${AG.TILE.SPAWN}`, (g, S) => {
            g.fillStyle(0x1a1a2e, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x131325, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x0e0e22, 1);
            [[0,0],[S-2,0],[0,S-2],[S-2,S-2]].forEach(([px,py]) => g.fillRect(px,py,2,2));
        });

        // ── ROAD RESTORED ─────────────────────────────────────────────────
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

        // ── FLOOR LIT ─────────────────────────────────────────────────────
        tex(`tile_${AG.TILE.FLOOR_LIT}`, (g, S) => {
            g.fillStyle(0x192a1d, 1);
            g.fillRect(0, 0, S, S);
            g.lineStyle(1, 0x1d3c22, 1);
            g.lineBetween(0, S/2, S, S/2);
            g.lineBetween(S/2, 0, S/2, S);
            g.fillStyle(0x00aa44, 0.4);
            [[0,0],[S,0],[0,S],[S,S]].forEach(([px,py]) => g.fillCircle(px, py, 2));
        });

        g.destroy();
    }

    // -------------------------------------------------------------------------
    // Player textures — humanoid top-down silhouette, left + right facing
    // -------------------------------------------------------------------------

    _generatePlayerTextures(AG) {
        const S = AG.TILE_SIZE;   // 32
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        // Draw player facing RIGHT into a 32×32 texture.
        // We'll setFlipX(true) for left-facing.
        g.clear();

        // Drop shadow
        g.fillStyle(0x001a0d, 0.5);
        g.fillEllipse(S/2, S/2 + 10, 16, 6);

        // Legs / feet (darker tint, lower)
        g.fillStyle(0x00cc66, 1);
        g.fillRoundedRect(S/2 - 5, S/2 + 5, 4, 6, 1); // left leg
        g.fillRoundedRect(S/2 + 1, S/2 + 5, 4, 6, 1); // right leg

        // Torso
        g.fillStyle(0x00ff88, 1);
        g.fillRoundedRect(S/2 - 6, S/2 - 3, 12, 9, 2);

        // Arms
        g.fillStyle(0x00dd77, 1);
        g.fillRoundedRect(S/2 - 9, S/2 - 2, 4, 7, 1); // left arm
        g.fillRoundedRect(S/2 + 5, S/2 - 2, 4, 7, 1); // right arm

        // Neck
        g.fillStyle(0x00ff88, 1);
        g.fillRect(S/2 - 2, S/2 - 6, 4, 4);

        // Head (slightly larger, lighter)
        g.fillStyle(0x33ffaa, 1);
        g.fillCircle(S/2, S/2 - 10, 7);

        // Face — eyes (two dots, offset right for facing right)
        g.fillStyle(0x001a0d, 1);
        g.fillCircle(S/2 + 2, S/2 - 10, 2);  // right eye (facing direction)
        g.fillCircle(S/2 - 2, S/2 - 11, 1.5); // left eye

        // Highlight on head
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
    // Shrine overlay — single 64×64 temple building over each 2×2 shrine block
    // -------------------------------------------------------------------------

    _renderShrineOverlays(AG) {
        const S   = AG.TILE_SIZE;
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;

        // Find top-left corner of each shrine group (avoid duplicates)
        const seen = new Set();
        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                if (map[row][col] !== AG.TILE.SHRINE) continue;
                // Canonicalize: only process if this is the top-left of a 2×2 block
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
        // Center of the 2×2 shrine block in world pixels
        const cx = col * S + S;         // col*S + S/2 + S/2 (center of 2 tiles)
        const cy = row * S + S;         // same for row
        const W  = S * 2;               // 64px wide
        const H  = S * 2 + 4;          // 68px tall (slightly taller than 2 tiles for drama)

        const g = this.add.graphics().setDepth(5);

        // ── Stone base platform (slightly wider than building) ──
        g.fillStyle(0x1a3a22, 1);
        g.fillRect(cx - W/2 - 4, cy + H/2 - 12, W + 8, 12);
        g.lineStyle(1, 0x00aa44, 0.6);
        g.strokeRect(cx - W/2 - 4, cy + H/2 - 12, W + 8, 12);

        // ── Steps ──
        g.fillStyle(0x153018, 1);
        g.fillRect(cx - W/2 - 2, cy + H/2 - 8, W + 4, 4);
        g.fillStyle(0x1a3a22, 1);
        g.fillRect(cx - W/2, cy + H/2 - 4, W, 4);

        // ── Main building body ──
        g.fillStyle(0x0d2214, 1);
        g.fillRect(cx - W/2, cy - H/2 + 14, W, H - 26);
        // Stone texture lines
        g.lineStyle(1, 0x0f2a18, 1);
        for (let ly = 0; ly < 3; ly++) {
            g.lineBetween(cx - W/2, cy - H/2 + 24 + ly * 10, cx + W/2, cy - H/2 + 24 + ly * 10);
        }

        // ── Columns (left and right) ──
        g.fillStyle(0x174028, 1);
        g.fillRect(cx - W/2, cy - H/2 + 14, 10, H - 26);
        g.fillRect(cx + W/2 - 10, cy - H/2 + 14, 10, H - 26);
        // Column highlights
        g.lineStyle(1, 0x00cc55, 0.7);
        g.lineBetween(cx - W/2 + 10, cy - H/2 + 14, cx - W/2 + 10, cy + H/2 - 12);
        g.lineBetween(cx + W/2 - 11, cy - H/2 + 14, cx + W/2 - 11, cy + H/2 - 12);
        // Column capitals
        g.fillStyle(0x1e4a30, 1);
        g.fillRect(cx - W/2 - 2, cy - H/2 + 12, 14, 5);
        g.fillRect(cx + W/2 - 12, cy - H/2 + 12, 14, 5);

        // ── Doorway (arch) ──
        g.fillStyle(0x040f08, 1);
        g.fillRect(cx - 12, cy - H/2 + 30, 24, H - 54);
        // Arch top
        g.fillEllipse(cx, cy - H/2 + 30, 24, 16);
        // Door glow
        g.fillStyle(0x00ff88, 0.12);
        g.fillRect(cx - 10, cy - H/2 + 32, 20, H - 56);
        // Door frame
        g.lineStyle(1, 0x00cc55, 0.8);
        g.strokeRect(cx - 12, cy - H/2 + 30, 24, H - 54);

        // ── Roof / gable triangle ──
        g.fillStyle(0x1a4828, 1);
        g.fillTriangle(
            cx, cy - H/2,             // apex
            cx - W/2 - 4, cy - H/2 + 16,  // bottom-left
            cx + W/2 + 4, cy - H/2 + 16,  // bottom-right
        );
        // Roof outline
        g.lineStyle(2, 0x00ff88, 0.9);
        g.strokeTriangle(
            cx, cy - H/2,
            cx - W/2 - 4, cy - H/2 + 16,
            cx + W/2 + 4, cy - H/2 + 16,
        );
        // Roof ridge
        g.lineStyle(1, 0x00cc55, 0.5);
        g.lineBetween(cx - W/2 - 4, cy - H/2 + 16, cx + W/2 + 4, cy - H/2 + 16);

        // ── Symbol in gable (⚡ lightning bolt shape) ──
        g.lineStyle(2, 0x00ff88, 1);
        g.lineBetween(cx + 3, cy - H/2 + 4,  cx - 2,  cy - H/2 + 9);
        g.lineBetween(cx - 2, cy - H/2 + 9,  cx + 1,  cy - H/2 + 9);
        g.lineBetween(cx + 1, cy - H/2 + 9,  cx - 3,  cy - H/2 + 14);

        // ── Building outline ──
        g.lineStyle(1, 0x00aa44, 0.8);
        g.strokeRect(cx - W/2, cy - H/2 + 14, W, H - 26);

        // ── Ambient glow (soft halo around building) ──
        g.fillStyle(0x00ff88, 0.04);
        g.fillCircle(cx, cy, W * 0.8);

        // Gentle pulse tween on the glow
        this.tweens.add({
            targets:  g,
            alpha:    { from: 0.85, to: 1.0 },
            duration: 1800,
            ease:     'Sine.easeInOut',
            yoyo:     true,
            repeat:   -1,
        });
    }

    // -------------------------------------------------------------------------
    // Boss Bug overlay — actual insect sprite over the boss bug tile
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
        const R  = isBoss ? 11 : 8;   // body radius

        // ── Legs (6 — three per side, fanning outward) ──
        g.lineStyle(isBoss ? 2 : 1, 0xff4400, 0.9);
        const legAngles = [-50, -15, 25];   // degrees from horizontal
        legAngles.forEach(angle => {
            const rad = Phaser.Math.DegToRad(angle);
            const len = isBoss ? 14 : 10;
            // Left side
            g.lineBetween(cx - R * 0.6, cy + angle * 0.15,
                          cx - R * 0.6 - Math.cos(rad) * len,
                          cy + angle * 0.15 - Math.sin(rad) * len);
            // Right side
            g.lineBetween(cx + R * 0.6, cy + angle * 0.15,
                          cx + R * 0.6 + Math.cos(rad) * len,
                          cy + angle * 0.15 - Math.sin(rad) * len);
        });

        // ── Antennae ──
        g.lineStyle(isBoss ? 1.5 : 1, 0xff6600, 0.9);
        g.lineBetween(cx - 4, cy - R, cx - 9,  cy - R - 9);
        g.lineBetween(cx + 4, cy - R, cx + 9,  cy - R - 9);
        // Antenna tips
        g.fillStyle(0xff4400, 1);
        g.fillCircle(cx - 9, cy - R - 9, 1.5);
        g.fillCircle(cx + 9, cy - R - 9, 1.5);

        // ── Body (abdomen) — lower oval ──
        g.fillStyle(0xcc2200, 1);
        g.fillEllipse(cx, cy + R * 0.4, R * 1.6, R * 1.3);
        // Abdomen stripes
        g.lineStyle(1, 0xff4400, 0.6);
        for (let i = 1; i < 3; i++) {
            g.lineBetween(cx - R * 0.7, cy + R * 0.4 - 3 + i * 4,
                          cx + R * 0.7, cy + R * 0.4 - 3 + i * 4);
        }

        // ── Thorax — middle section ──
        g.fillStyle(0xdd2800, 1);
        g.fillEllipse(cx, cy - R * 0.1, R * 1.2, R * 1.0);

        // ── Head ──
        g.fillStyle(0xee3300, 1);
        g.fillCircle(cx, cy - R, isBoss ? R * 0.8 : R * 0.7);

        // ── Eyes (two glowing dots) ──
        g.fillStyle(0xffcc00, 1);
        g.fillCircle(cx - 3, cy - R - 1, isBoss ? 2.5 : 2);
        g.fillCircle(cx + 3, cy - R - 1, isBoss ? 2.5 : 2);
        // Eye glint
        g.fillStyle(0xffffff, 0.8);
        g.fillCircle(cx - 2.5, cy - R - 1.5, 1);
        g.fillCircle(cx + 3.5, cy - R - 1.5, 1);

        // ── Carapace highlights ──
        g.lineStyle(1, 0xff6644, 0.5);
        g.strokeEllipse(cx, cy - R * 0.1, R * 1.2, R * 1.0);

        // Boss-specific: glowing aura
        if (isBoss) {
            g.fillStyle(0xff2200, 0.1);
            g.fillCircle(cx, cy, R * 2.2);
            g.lineStyle(1, 0xff4400, 0.3);
            g.strokeCircle(cx, cy, R * 1.9);
        }

        // Store reference for removal when boss bug is cleared
        this._bugOverlays[`${col},${row}`] = g;

        // Idle wriggle animation
        this.tweens.add({
            targets:  g,
            y:        { from: -2, to: 2 },
            duration: isBoss ? 700 : 500,
            ease:     'Sine.easeInOut',
            yoyo:     true,
            repeat:   -1,
        });
        // Pulse glow
        this.tweens.add({
            targets:  g,
            alpha:    { from: 0.85, to: 1.0 },
            duration: 900,
            ease:     'Sine.easeInOut',
            yoyo:     true,
            repeat:   -1,
        });
    }

    // -------------------------------------------------------------------------
    // Tile swap (live map updates)
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
            targets:  img,
            alpha:    { from: 0, to: 1 },
            duration: 400,
            ease:     'Cubic.easeOut',
        });
    }

    // -------------------------------------------------------------------------
    // Player
    // -------------------------------------------------------------------------

    _createPlayer(AG) {
        const S = AG.TILE_SIZE;
        const x = this.tileX * S + S / 2;
        const y = this.tileY * S + S / 2;

        // Soft shadow on the floor beneath
        this.playerShadow = this.add.ellipse(x, y + 10, 18, 8, 0x000000, 0.35).setDepth(7);

        // Glow halo
        this.playerGlow = this.add.circle(x, y, 16, 0x00ff88, 0.12).setDepth(7);

        // Player sprite (humanoid, faces right by default)
        this.player = this.add.image(x, y, 'player_right').setDepth(8);

        // Idle glow pulse
        this.tweens.add({
            targets:   this.playerGlow,
            alpha:     { from: 0.08, to: 0.22 },
            duration:  900,
            ease:      'Sine.easeInOut',
            yoyo:      true,
            repeat:    -1,
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
        this.cameras.main.startFollow(this.player, true, 0.12, 0.12);
    }

    // -------------------------------------------------------------------------
    // Input
    // -------------------------------------------------------------------------

    _setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd    = this.input.keyboard.addKeys({
            up:    Phaser.Input.Keyboard.KeyCodes.W,
            left:  Phaser.Input.Keyboard.KeyCodes.A,
            down:  Phaser.Input.Keyboard.KeyCodes.S,
            right: Phaser.Input.Keyboard.KeyCodes.D,
        });
    }

    // -------------------------------------------------------------------------
    // Movement
    // -------------------------------------------------------------------------

    _handleMovement() {
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

    _isPassable(col, row) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const AG  = window.ARIA_GAME;
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return false;
        return !AG.IMPASSABLE_TILES.includes(map[row][col]);
    }

    _movePlayer(newCol, newRow, dx, dy) {
        const AG = window.ARIA_GAME;
        const S  = AG.TILE_SIZE;

        this.isMoving = true;
        this.tileX    = newCol;
        this.tileY    = newRow;
        if (dx !== 0) {
            this.lastDX = dx;
            // Flip sprite to face movement direction
            this.player.setFlipX(dx < 0);
        }

        AG.events.emit('player:moved', { col: newCol, row: newRow });

        const targetX = newCol * S + S / 2;
        const targetY = newRow * S + S / 2;

        // Slight vertical bob during movement
        this.tweens.add({
            targets:  this.player,
            y:        { from: this.player.y - 2, to: this.player.y },
            duration: AG.MOVE_DURATION / 2,
            ease:     'Sine.easeOut',
        });

        this.tweens.add({
            targets:  [this.player, this.playerGlow],
            x:        targetX,
            y:        targetY,
            duration: AG.MOVE_DURATION,
            ease:     'Linear',
            onComplete: () => { this.isMoving = false; },
        });

        this.tweens.add({
            targets:  this.playerShadow,
            x:        targetX,
            y:        targetY + 10,
            duration: AG.MOVE_DURATION,
            ease:     'Linear',
        });
    }

    _onBump(col, row) {
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const AG  = window.ARIA_GAME;
        if (row < 0 || row >= map.length || col < 0 || col >= map[0].length) return;
        const tileId = map[row][col];
        if (AG.INTERACTIVE_TILES.includes(tileId)) {
            const label = AG.TILE_LABELS[tileId] ?? 'Unknown';
            AG.events.emit('aria:interact', { tileId, col, row, label });
        }
    }

    // -------------------------------------------------------------------------
    // Event bus
    // -------------------------------------------------------------------------

    _listenToBus(AG) {
        const TILE = AG.TILE;

        AG.events.on('challenge:open', () => {
            this.inputLocked = true;
            this.input.keyboard.disableGlobalCapture();
        });
        AG.events.on('challenge:close', () => {
            this.inputLocked = false;
            this.input.keyboard.enableGlobalCapture();
        });

        AG.events.on('gate:open', ({ col, row }) => {
            this.updateTile(col, row, TILE.ROAD);
        });

        AG.events.on('boss_bug:clear', ({ col, row }) => {
            // Remove the bug overlay sprite
            const key = `${col},${row}`;
            if (this._bugOverlays[key]) {
                this.tweens.add({
                    targets:  this._bugOverlays[key],
                    alpha:    0,
                    duration: 300,
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
    }

    // -------------------------------------------------------------------------
    // Region restoration (Layer 6)
    // -------------------------------------------------------------------------

    _restoreRegion(AG) {
        const TILE = AG.TILE;
        const map  = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const STEP = 28;

        this.inputLocked = true;
        this.cameras.main.flash(450, 255, 255, 255);

        this.tweens.killTweensOf(this.playerGlow);
        this.tweens.add({
            targets:  this.playerGlow,
            scaleX:   4,
            scaleY:   4,
            alpha:    0.7,
            duration: 450,
            ease:     'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets:  this.playerGlow,
                    scaleX:   1.2,
                    scaleY:   1.2,
                    alpha:    { from: 0.25, to: 0.55 },
                    duration: 600,
                    ease:     'Sine.easeInOut',
                    yoyo:     true,
                    repeat:   -1,
                });
            },
        });

        const ORIGIN = { col: 22, row: 5 };
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
