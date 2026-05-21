/**
 * ARIA: The Lost Code — Origin Node Scene (Region 1)
 *
 * Phaser 3 scene covering Layers 2, 3, and 4:
 *   Layer 2 — Tile-based world map rendering (programmatic textures, no image assets)
 *   Layer 3 — Player movement (WASD + arrow keys, tile-by-tile with tween)
 *   Layer 4 — Gate interaction, tile state updates, challenge event wiring
 *
 * Event bus (window.ARIA_GAME.events) contract:
 *   Emits:  aria:interact { tileId, col, row, label }
 *           scene:ready   { scene }
 *           aria:speak    { text }
 *   Listens: challenge:open   — disable keyboard input
 *            challenge:close  — re-enable keyboard input
 *            gate:open        { col, row } — replace GATE tile with ROAD
 *            boss_bug:clear   { col, row } — replace BOSS_BUG tile with ROAD
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
        this.inputLocked = false;   // true while challenge panel is open

        // Registry of tile images by 'col,row' key — needed for live tile swaps
        this.tileImages = {};
    }

    // -------------------------------------------------------------------------
    // Lifecycle
    // -------------------------------------------------------------------------

    preload() {
        // All tiles are generated programmatically — nothing to preload.
    }

    create() {
        const AG = window.ARIA_GAME;

        this._generateTileTextures(AG);
        this._renderMap(AG);
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
    // Tile texture generation (prototype art — colored rectangles with markers)
    // -------------------------------------------------------------------------

    _generateTileTextures(AG) {
        const S = AG.TILE_SIZE;
        const g = this.make.graphics({ x: 0, y: 0, add: false });

        Object.values(AG.TILE).forEach(tileId => {
            const fill   = AG.TILE_COLORS[tileId]  ?? 0x111111;
            const border = AG.TILE_BORDERS[tileId] ?? 0x000000;
            const key    = `tile_${tileId}`;

            g.clear();

            // Base fill
            g.fillStyle(fill, 1);
            g.fillRect(0, 0, S, S);

            // Border / grid line
            g.lineStyle(1, border, 1);
            g.strokeRect(0.5, 0.5, S - 1, S - 1);

            // Per-tile decorative markers ——————————————————————————————
            switch (tileId) {

                case AG.TILE.ROAD:
                    // Faint centre dash suggesting a circuit trace
                    g.lineStyle(1, 0x2a3a6e, 0.5);
                    g.lineBetween(S / 2, 4, S / 2, S - 4);
                    break;

                case AG.TILE.TERMINAL:
                    // Crosshair — dead screen / data terminal
                    g.lineStyle(1, 0x00aaff, 0.7);
                    g.lineBetween(S / 2, 5, S / 2, S - 5);
                    g.lineBetween(5, S / 2, S - 5, S / 2);
                    // Corner dots
                    g.fillStyle(0x00aaff, 0.5);
                    g.fillRect(3, 3, 3, 3);
                    g.fillRect(S - 6, 3, 3, 3);
                    g.fillRect(3, S - 6, 3, 3);
                    g.fillRect(S - 6, S - 6, 3, 3);
                    break;

                case AG.TILE.GATE:
                    // Red X — locked gate
                    g.lineStyle(2, 0xff3333, 0.9);
                    g.lineBetween(7, 7, S - 7, S - 7);
                    g.lineBetween(S - 7, 7, 7, S - 7);
                    // Thin border glow
                    g.lineStyle(1, 0xff2222, 0.4);
                    g.strokeRect(2, 2, S - 4, S - 4);
                    break;

                case AG.TILE.SHRINE:
                    // Triangular roof + horizontal base — building silhouette
                    g.lineStyle(1, 0x00cc44, 0.8);
                    g.lineBetween(S / 2, 5, 4, S - 5);
                    g.lineBetween(S / 2, 5, S - 4, S - 5);
                    g.lineBetween(4, S - 5, S - 4, S - 5);
                    // Door
                    g.fillStyle(0x00cc44, 0.3);
                    g.fillRect(S / 2 - 4, S - 11, 8, 6);
                    break;

                case AG.TILE.BOSS_CHAMBER:
                    // Double border + diamond — boss room
                    g.lineStyle(2, 0xaa22ff, 0.9);
                    g.strokeRect(3, 3, S - 6, S - 6);
                    g.lineStyle(1, 0xaa22ff, 0.4);
                    g.strokeRect(6, 6, S - 12, S - 12);
                    // Small diamond
                    g.fillStyle(0xaa22ff, 0.5);
                    g.fillTriangle(S/2, 9, S-9, S/2, S/2, S-9);
                    g.fillTriangle(S/2, 9, 9,   S/2, S/2, S-9);
                    break;

                case AG.TILE.BOSS_BUG:
                    // Skull-ish circle + X eyes — enemy
                    g.lineStyle(2, 0xff4400, 0.9);
                    g.strokeCircle(S / 2, S / 2, 9);
                    g.lineStyle(1, 0xff4400, 0.7);
                    // X eyes
                    g.lineBetween(S/2 - 6, S/2 - 4, S/2 - 2, S/2);
                    g.lineBetween(S/2 - 2, S/2 - 4, S/2 - 6, S/2);
                    g.lineBetween(S/2 + 2, S/2 - 4, S/2 + 6, S/2);
                    g.lineBetween(S/2 + 6, S/2 - 4, S/2 + 2, S/2);
                    break;

                case AG.TILE.ROAD_RESTORED:
                    // Brighter green circuit trace — alive signal line
                    g.lineStyle(2, 0x00ff88, 0.85);
                    g.lineBetween(S / 2, 3, S / 2, S - 3);
                    // Corner signal dots
                    g.fillStyle(0x00ff88, 0.6);
                    g.fillCircle(4, 4, 2);
                    g.fillCircle(S - 4, 4, 2);
                    g.fillCircle(4, S - 4, 2);
                    g.fillCircle(S - 4, S - 4, 2);
                    break;

                case AG.TILE.FLOOR_LIT:
                    // Subtle warm grid lines — the floor is alive
                    g.lineStyle(1, 0x1e3e24, 0.4);
                    g.lineBetween(0, S / 2, S, S / 2);
                    g.lineBetween(S / 2, 0, S / 2, S);
                    break;

                // WALL, FLOOR, SPAWN — base fill + border only, no extra marker
                default:
                    break;
            }

            g.generateTexture(key, S, S);
        });

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
                // Store reference so we can swap tiles later (gate open, bug clear)
                this.tileImages[`${col},${row}`] = img;
            }
        }
    }

    /**
     * Swap a tile in the live map to a new type.
     * Updates both the JS map array and the Phaser image on screen.
     */
    updateTile(col, row, newTileId) {
        const AG  = window.ARIA_GAME;
        const S   = AG.TILE_SIZE;
        const map = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const key = `${col},${row}`;

        // Update the logical map so movement checks stay consistent
        map[row][col] = newTileId;

        // Swap the Phaser image
        const existing = this.tileImages[key];
        if (existing) {
            existing.destroy();
        }
        const x   = col * S + S / 2;
        const y   = row * S + S / 2;
        const img = this.add.image(x, y, `tile_${newTileId}`);
        this.tileImages[key] = img;

        // Flash to draw attention
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

        // Outer glow ring (pulsed by tween below)
        this.playerGlow = this.add.circle(x, y, 14, 0x00ff88, 0.15);

        // Player body
        this.player = this.add.circle(x, y, 10, 0x00ff88, 1);

        // Direction indicator — small dark dot offset in the facing direction
        this.playerEye = this.add.circle(x + this.lastDX * 4, y, 3, 0x001a0d, 1);

        // Idle glow pulse
        this.tweens.add({
            targets:   this.playerGlow,
            alpha:     { from: 0.10, to: 0.30 },
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
        const map    = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const S      = AG.TILE_SIZE;
        const mapW   = map[0].length * S;   // 25 × 32 = 800
        const mapH   = map.length    * S;   // 18 × 32 = 576

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

        // Prefer horizontal over diagonal if both pressed simultaneously
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
        if (dx !== 0) this.lastDX = dx;

        // Notify the dialogue system of the new tile position (Layer 8).
        // Fires when position updates so proximity checks run immediately.
        AG.events.emit('player:moved', { col: newCol, row: newRow });

        const targetX = newCol * S + S / 2;
        const targetY = newRow * S + S / 2;

        // Move eye immediately so it points in the new direction
        this.playerEye.x = this.player.x + this.lastDX * 4;

        this.tweens.add({
            targets:  [this.player, this.playerGlow],
            x:        targetX,
            y:        targetY,
            duration: AG.MOVE_DURATION,
            ease:     'Linear',
            onComplete: () => {
                this.playerEye.x = targetX + this.lastDX * 4;
                this.playerEye.y = targetY;
                this.isMoving = false;
            },
        });
    }

    /**
     * Called when the player tries to move into an impassable tile.
     * If the tile is interactive, emit an event for the HUD/challenge system.
     */
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
    // Event bus listeners (Layer 4+)
    // -------------------------------------------------------------------------

    _listenToBus(AG) {
        const TILE = AG.TILE;

        // Disable / re-enable movement while challenge panel is open.
        // disableGlobalCapture() releases Phaser's key interception so that
        // DOM key events reach the <textarea> editor inside the challenge panel.
        // enableGlobalCapture() restores it when play resumes.
        AG.events.on('challenge:open', () => {
            this.inputLocked = true;
            this.input.keyboard.disableGlobalCapture();
        });
        AG.events.on('challenge:close', () => {
            this.inputLocked = false;
            this.input.keyboard.enableGlobalCapture();
        });

        // Open a gate tile (replace GATE with ROAD)
        AG.events.on('gate:open', ({ col, row }) => {
            this.updateTile(col, row, TILE.ROAD);
        });

        // Clear a Boss Bug tile (replace BOSS_BUG with ROAD)
        AG.events.on('boss_bug:clear', ({ col, row }) => {
            this.updateTile(col, row, TILE.ROAD);
        });

        // Region restoration visual sequence (Layer 6)
        AG.events.on('region:restore', () => {
            this._restoreRegion(AG);
        });
    }

    // -------------------------------------------------------------------------
    // Region restoration (Layer 6)
    // -------------------------------------------------------------------------

    /**
     * Plays the region restoration sequence:
     *   1. Camera flash
     *   2. Player glow burst
     *   3. Road tiles ripple from boss chamber outward → ROAD_RESTORED
     *   4. Floor tiles follow → FLOOR_LIT
     *   5. Emits region:restored when the wave completes
     */
    _restoreRegion(AG) {
        const TILE = AG.TILE;
        const map  = window.ARIA_GAME.MAPS.ORIGIN_NODE;
        const STEP = 28;  // ms between wave steps (per Manhattan distance unit)

        // Lock movement during the sequence — it's a cutscene moment
        this.inputLocked = true;

        // 1. Camera flash — white burst
        this.cameras.main.flash(450, 255, 255, 255);

        // 2. Player glow burst — expand then settle into a faster idle pulse
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

        // 3+4. Collect all road and floor tiles, sort by Manhattan distance from boss chamber
        //       (the restoration "signal" radiates outward from where the fix was made)
        const ORIGIN = { col: 22, row: 5 };  // boss chamber position
        const tilesToRestore = [];

        for (let row = 0; row < map.length; row++) {
            for (let col = 0; col < map[row].length; col++) {
                const t    = map[row][col];
                const dist = Math.abs(col - ORIGIN.col) + Math.abs(row - ORIGIN.row);

                if (t === TILE.ROAD || t === TILE.SPAWN) {
                    tilesToRestore.push({ col, row, dist, newType: TILE.ROAD_RESTORED });
                } else if (t === TILE.FLOOR) {
                    // Floor tiles lag behind roads by a half-step so roads light first
                    tilesToRestore.push({ col, row, dist: dist + 0.5, newType: TILE.FLOOR_LIT });
                }
            }
        }

        tilesToRestore.sort((a, b) => a.dist - b.dist);

        // Stagger each tile — a ripple effect spreading across the map
        let maxDelay = 0;
        tilesToRestore.forEach(({ col, row, dist, newType }) => {
            const delay = Math.floor(dist * STEP);
            if (delay > maxDelay) maxDelay = delay;

            this.time.delayedCall(delay, () => {
                this.updateTile(col, row, newType);
            });
        });

        // 5. After the full wave, unlock input and notify HUD
        this.time.delayedCall(maxDelay + 600, () => {
            this.inputLocked = false;
            AG.events.emit('region:restored', { regionOrder: 1 });
        });
    }
}

// Register on the global namespace so main.js can reference it
window.ARIA_GAME.OriginNodeScene = OriginNodeScene;
