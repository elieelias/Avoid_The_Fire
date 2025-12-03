'use client';

import React, { useEffect, useRef } from 'react';

interface GameCanvasProps {
    onGameOver: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver }) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<any>(null);

    useEffect(() => {
        let Phaser: any;

        // Dynamic import for browser-only
        import('phaser').then((phaserModule) => {
            Phaser = phaserModule;

            if (!gameContainerRef.current) return;
            if (gameRef.current) return;

            // --- CONFIGURATION ---
            const ASSET_SIZE = {
                PLAYER: '32px',
                GIFT: '24px',
                HAZARD: '24px',
                POWERUP: '28px',
            };

            const EMOJIS = {
                PLAYER: '🎅',
                GIFT: '🎁',
                HAZARD: '🔥',
                POWERUP: '❄️',
            };

            const INITIAL_SPEED = 250;
            const SPAWN_RATES = {
                GIFT: 250,
                HAZARD: 600,
                POWERUP: 8000,
            };

            // --- STATE VARIABLES ---
            let player: any;
            let giftsGroup: any;
            let hazardsGroup: any;
            let powerupsGroup: any;

            let scoreText: any;
            let powerupText: any;

            let score = 0;
            let gameBaseSpeed = INITIAL_SPEED;
            let isGameOver = false;

            let scoreMultiplier = 1;
            let isInvincible = false;
            let timeScale = 1.0;

            let spawnTimers: any[] = [];

            // --- PHASER CONFIG ---
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                parent: gameContainerRef.current,
                width: window.innerWidth,
                height: window.innerHeight,
                transparent: true,
                physics: {
                    default: 'arcade',
                    arcade: { gravity: { x: 0, y: 0 }, debug: false },
                },
                scale: { mode: Phaser.Scale.RESIZE, autoCenter: Phaser.Scale.CENTER_BOTH },
                scene: { create, update },
            };

            // --- GAME LOGIC ---
            function resetPowerups() {
                scoreMultiplier = 1;
                isInvincible = false;
                timeScale = 1.0;
                if (player) player.clearTint();
            }

            function spawnGift(this: any) {
                if (isGameOver) return;
                const { width } = this.scale;
                const x = Phaser.Math.Between(20, width - 20);
                const item = this.add.text(x, -30, EMOJIS.GIFT, { fontSize: ASSET_SIZE.GIFT }).setOrigin(0.5);
                giftsGroup.add(item);
                item.body.setVelocityY(gameBaseSpeed * timeScale);
            }

            function spawnHazard(this: any) {
                if (isGameOver) return;
                const { width, height } = this.scale;
                const x = Phaser.Math.Between(20, width - 20);
                const fromBottom = Math.random() > 0.5;

                const startY = fromBottom ? height + 30 : -30;
                const velocityY = fromBottom ? -(gameBaseSpeed * timeScale) : gameBaseSpeed * timeScale;

                const item = this.add.text(x, startY, EMOJIS.HAZARD, { fontSize: ASSET_SIZE.HAZARD }).setOrigin(0.5);
                hazardsGroup.add(item);
                item.body.setVelocityY(velocityY);
                item.body.setCircle(10, 2, 2);
            }

            function spawnPowerup(this: any) {
                if (isGameOver) return;
                const { width } = this.scale;
                const x = Phaser.Math.Between(30, width - 30);

                const item = this.add.text(x, -30, EMOJIS.POWERUP, { fontSize: ASSET_SIZE.POWERUP }).setOrigin(0.5);
                const type = Phaser.Math.RND.pick(['2X', 'SHIELD', 'SLOW']);
                item.setData('type', type);

                powerupsGroup.add(item);
                item.body.setVelocityY((gameBaseSpeed * 0.8) * timeScale);

                this.tweens.add({ targets: item, angle: 360, duration: 2000, repeat: -1 });
            }

            function collectGift(this: any, _: any, giftObj: any) {
                giftObj.destroy();
                score += 1 * scoreMultiplier;
                scoreText.setText(score.toString());
                if (gameBaseSpeed < 600) gameBaseSpeed += 2;
            }

            function updateVelocities(factor: number) {
                [giftsGroup, hazardsGroup, powerupsGroup].forEach((group) => {
                    group.children.iterate((child: any) => {
                        if (child?.body) child.body.velocity.y *= factor;
                        return true;
                    });
                });
            }

            function collectPowerup(this: any, playerObj: any, powerupObj: any) {
                const type = powerupObj.getData('type');
                powerupObj.destroy();
                resetPowerups();

                let label = '';
                switch (type) {
                    case '2X':
                        scoreMultiplier = 2;
                        label = '2X POINTS!';
                        playerObj.setTint(0xfbbf24);
                        break;
                    case 'SHIELD':
                        isInvincible = true;
                        label = 'SHIELD!';
                        playerObj.setTint(0x3b82f6);
                        break;
                    case 'SLOW':
                        timeScale = 0.5;
                        label = 'TIME FREEZE!';
                        playerObj.setTint(0xa855f7);
                        updateVelocities(0.5);
                        break;
                }

                powerupText.setText(label);
                powerupText.setAlpha(1);
                this.tweens.add({
                    targets: powerupText,
                    alpha: 0,
                    y: 50,
                    duration: 1000,
                    delay: 500,
                    onComplete: () => (powerupText.y = 80),
                });

                this.time.delayedCall(5000, () => {
                    if (!isGameOver) {
                        if (type === 'SLOW') updateVelocities(2);
                        resetPowerups();
                    }
                });
            }

            function hitHazard(this: any, playerObj: any, hazardObj: any) {
                if (isInvincible) {
                    hazardObj.destroy();
                    this.tweens.add({ targets: playerObj, alpha: 0.2, duration: 50, yoyo: true, repeat: 3 });
                    return;
                }
                if (isGameOver) return;

                isGameOver = true;
                this.cameras.main.shake(500, 0.05);
                playerObj.setTint(0xff0000);
                this.physics.pause();
                spawnTimers.forEach((t) => t.destroy());

                setTimeout(() => onGameOver(score), 1000);
            }

            function create(this: any) {
                const { width, height } = this.scale;
                isGameOver = false;
                score = 0;
                gameBaseSpeed = INITIAL_SPEED;
                resetPowerups();

                // Player
                player = this.add.text(width / 2, height / 2, EMOJIS.PLAYER, { fontSize: ASSET_SIZE.PLAYER }).setOrigin(0.5);
                this.physics.add.existing(player);
                const playerBody = player.body;
                playerBody.setCollideWorldBounds(true);
                playerBody.setCircle(12, 4, 4);

                // Groups
                giftsGroup = this.physics.add.group();
                hazardsGroup = this.physics.add.group();
                powerupsGroup = this.physics.add.group();

                // UI
                scoreText = this.add.text(20, 20, '0', { fontSize: '40px', fontFamily: '"Mountains of Christmas", cursive', color: '#fff', stroke: '#000', strokeThickness: 4 });
                powerupText = this.add.text(width / 2, 80, '', { fontSize: '24px', fontFamily: '"Outfit", sans-serif', color: '#fbbf24', stroke: '#000', strokeThickness: 2 }).setOrigin(0.5).setAlpha(0);

                // Input
                this.input.on('pointermove', (pointer: any) => {
                    if (isGameOver) return;
                    this.physics.moveToObject(player, pointer, 800);
                });

                this.events.on('update', () => {
                    if (isGameOver || !this.input.activePointer) return;
                    const pointer = this.input.activePointer;
                    const distance = Phaser.Math.Distance.Between(player.x, player.y, pointer.x, pointer.y);
                    if (distance < 10) player.body.reset(player.x, player.y);
                });

                // Spawners
                spawnTimers.push(this.time.addEvent({ delay: SPAWN_RATES.GIFT, callback: spawnGift, callbackScope: this, loop: true }));
                spawnTimers.push(this.time.addEvent({ delay: SPAWN_RATES.HAZARD, callback: spawnHazard, callbackScope: this, loop: true }));
                spawnTimers.push(this.time.addEvent({ delay: SPAWN_RATES.POWERUP, callback: spawnPowerup, callbackScope: this, loop: true }));

                // Collisions
                this.physics.add.overlap(player, giftsGroup, collectGift, undefined, this);
                this.physics.add.overlap(player, hazardsGroup, hitHazard, undefined, this);
                this.physics.add.overlap(player, powerupsGroup, collectPowerup, undefined, this);
            }

            function update(this: any) {
                const { height } = this.scale;
                [giftsGroup, hazardsGroup, powerupsGroup].forEach((group) => {
                    group.children.iterate((child: any) => {
                        if (!child) return true;
                        if (child.body.velocity.y > 0 && child.y > height + 50) child.destroy();
                        else if (child.body.velocity.y < 0 && child.y < -50) child.destroy();
                        return true;
                    });
                });
            }

            // Initialize Phaser Game
            gameRef.current = new Phaser.Game(config);
        });

        // Cleanup
        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [onGameOver]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-transparent touch-none">
            <div ref={gameContainerRef} className="absolute inset-0 w-full h-full" />
        </div>
    );
};

export default GameCanvas;
