"use client";

import React, { useEffect, useRef } from "react";

interface GameCanvasProps {
    onGameOver: (score: number) => void;
}

const GameCanvas: React.FC<GameCanvasProps> = ({ onGameOver }) => {
    const gameContainerRef = useRef<HTMLDivElement>(null);
    const gameRef = useRef<any>(null); // Will assign Phaser.Game later

    useEffect(() => {
        let Phaser: typeof import("phaser");

        async function init() {
            if (!gameContainerRef.current) return;
            if (gameRef.current) return;

            // Load Phaser only on client
            Phaser = await import("phaser");

            // --- PHASER CONFIG ---
            const config: Phaser.Types.Core.GameConfig = {
                type: Phaser.AUTO,
                parent: gameContainerRef.current!,
                width: window.innerWidth,
                height: window.innerHeight,
                transparent: true,
                physics: {
                    default: 'arcade',
                    arcade: {
                        gravity: { x: 0, y: 0 },
                        debug: false
                    }
                },
                scale: {
                    mode: Phaser.Scale.RESIZE,
                    autoCenter: Phaser.Scale.CENTER_BOTH
                },
                scene: {
                    preload,
                    create,
                    update
                }
            };

            // --- VARIABLES ---
            let player: Phaser.GameObjects.Text;
            let gifts: Phaser.Physics.Arcade.Group;
            let hazards: Phaser.Physics.Arcade.Group;
            let scoreText: Phaser.GameObjects.Text;
            let score = 0;
            let gameSpeed = 200;
            let spawnEvent: Phaser.Time.TimerEvent;
            let isGameOver = false;

            const EMOJI_PLAYER = "🎅";
            const EMOJI_GIFTS = ["🎁", "🧸", "🎀", "🎄", "🍪"];
            const EMOJI_HAZARDS = ["⛄", "❄️", "🔥"];

            function preload(this: Phaser.Scene) { }

            function create(this: Phaser.Scene) {
                const { width, height } = this.scale;
                isGameOver = false;
                score = 0;

                player = this.add.text(width / 2, height - 150, EMOJI_PLAYER, {
                    fontSize: "60px"
                }).setOrigin(0.5);

                this.physics.add.existing(player);
                const playerBody = player.body as Phaser.Physics.Arcade.Body;
                playerBody.setCollideWorldBounds(true);

                gifts = this.physics.add.group();
                hazards = this.physics.add.group();

                scoreText = this.add.text(30, 30, "0", {
                    fontSize: "80px",
                    fontFamily: '"Mountains of Christmas", serif',
                    color: "#ffffff",
                    fontStyle: "bold"
                }).setDepth(10);

                scoreText.setShadow(2, 2, "rgba(0,0,0,0.5)", 5);

                this.input.on("pointermove", (pointer: Phaser.Input.Pointer) => {
                    if (isGameOver) return;
                    this.physics.moveToObject(player, pointer, 600);
                });

                this.events.on("update", () => {
                    const pointer = this.input.activePointer;
                    const distance = Phaser.Math.Distance.Between(
                        player.x,
                        player.y,
                        pointer.x,
                        pointer.y
                    );
                    const body = player.body as Phaser.Physics.Arcade.Body;
                    if (distance < 15) body.reset(player.x, player.y);
                });

                spawnEvent = this.time.addEvent({
                    delay: 800,
                    callback: spawnItem,
                    callbackScope: this,
                    loop: true
                });

                this.physics.add.overlap(player, gifts, collectGift, undefined, this);
                this.physics.add.overlap(player, hazards, hitHazard, undefined, this);
            }

            function spawnItem(this: Phaser.Scene) {
                if (isGameOver) return;
                const { width } = this.scale;

                const isHazard = Math.random() < 0.35;
                const group = isHazard ? hazards : gifts;
                const emojis = isHazard ? EMOJI_HAZARDS : EMOJI_GIFTS;
                const emoji = Phaser.Utils.Array.GetRandom(emojis);

                const x = Phaser.Math.Between(30, width - 30);
                const item = this.add.text(x, -50, emoji, { fontSize: "45px" }).setOrigin(0.5);

                group.add(item);
                const body = item.body as Phaser.Physics.Arcade.Body;
                body.setVelocityY(gameSpeed + Math.random() * 100);
                body.setVelocityX(Phaser.Math.Between(-20, 20));
            }

            function collectGift(this: Phaser.Scene, _: any, giftObj: any) {
                const gift = giftObj as Phaser.GameObjects.Text;
                gift.destroy();

                score++;
                scoreText.setText(score.toString());

                this.tweens.add({
                    targets: player,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 100,
                    yoyo: true
                });

                gameSpeed += 5;
                if (spawnEvent.delay > 300) {
                    const newDelay = spawnEvent.delay - 10;

                    spawnEvent.reset({
                        delay: newDelay,
                        callback: spawnItem,
                        callbackScope: this,
                        loop: true,
                    });
                }
            }

            function hitHazard(this: Phaser.Scene, playerObj: any, hazardObj: any) {
                if (isGameOver) return;
                isGameOver = true;

                this.cameras.main.shake(500, 0.05);
                playerObj.setTint(0xff0000);
                this.physics.pause();
                spawnEvent.destroy();

                setTimeout(() => onGameOver(score), 1000);
            }

            function update(this: Phaser.Scene) {
                const { height } = this.scale;
                [gifts, hazards].forEach(group => {
                    group.children.iterate((child: any) => {
                        if (child && child.y > height + 50) {
                            child.destroy();
                        }
                        return true; // required by Phaser 3.60 typings
                    });

                });
            }

            gameRef.current = new Phaser.Game(config);
        }

        init();

        return () => {
            if (gameRef.current) {
                gameRef.current.destroy(true);
                gameRef.current = null;
            }
        };
    }, [onGameOver]);

    return (
        <div className="relative w-full h-full overflow-hidden bg-transparent">
            <div ref={gameContainerRef} className="absolute inset-0 w-full h-full" />

            <div className="absolute bottom-10 w-full text-center pointer-events-none animate-pulse">
                <p className="text-white/40 text-sm font-medium tracking-widest uppercase">
                    Drag anywhere to Fly
                </p>
            </div>
        </div>
    );
};

export default GameCanvas;
