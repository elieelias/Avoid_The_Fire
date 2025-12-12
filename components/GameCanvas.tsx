'use client';

import React, { useEffect, useRef, useState } from 'react';
type PhaserNamespace = typeof import('phaser');
import { AppState } from '@/lib/types';
import { ASSETS, PowerUpType } from '@/lib/constants';

interface Props {
  setAppState: React.Dispatch<React.SetStateAction<AppState>>;
  updateScore: (score: number) => void;
}

type PhaserGameInstance = InstanceType<PhaserNamespace['Game']>;

const GameCanvas: React.FC<Props> = ({ setAppState, updateScore }) => {
  const gameRef = useRef<PhaserGameInstance | null>(null);
  const [score, setScore] = useState(0);
  const [activePowerUps, setActivePowerUps] = useState<Map<PowerUpType, number>>(new Map());

  useEffect(() => {
    if (gameRef.current) return;
    let cancelled = false;
    let Phaser: PhaserNamespace;

    const startGame = async () => {
      const phaserModule = await import('phaser');
      Phaser = phaserModule as PhaserNamespace;
      if (cancelled) return;

      class MainScene extends Phaser.Scene {
        private player!: Phaser.GameObjects.Text;
        private hazards!: Phaser.Physics.Arcade.Group;
        private risingFlames!: Phaser.Physics.Arcade.Group;
        private powerUps!: Phaser.Physics.Arcade.Group;
        private scoreTimer!: Phaser.Time.TimerEvent;
        private spawnTimer!: Phaser.Time.TimerEvent;
        private flameSpawnTimer?: Phaser.Time.TimerEvent;
        private powerUpSpawnTimer!: Phaser.Time.TimerEvent;
        private currentScore = 0;
        private isGameOver = false;
        private isInvincible = false;
        private difficultyLevel = 1;
        private activePowerUps: Map<PowerUpType, number> = new Map();
        private scoreMultiplier = 1;
        private baseTimeScale = 1;

        declare add: Phaser.GameObjects.GameObjectFactory;
        declare physics: Phaser.Physics.Arcade.ArcadePhysics;
        declare input: Phaser.Input.InputPlugin;
        declare time: Phaser.Time.Clock;
        declare tweens: Phaser.Tweens.TweenManager;
        declare cameras: Phaser.Cameras.Scene2D.CameraManager;
        declare scale: Phaser.Scale.ScaleManager;
        declare game: Phaser.Game;

        constructor() {
          super({ key: 'MainScene' });
        }

        create() {
          this.currentScore = 0;
          this.isGameOver = false;
          this.difficultyLevel = 1;
          this.scoreMultiplier = 1;
          this.baseTimeScale = 1;
          this.activePowerUps.clear();

          this.player = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            ASSETS.PLAYER,
            { fontSize: '60px' }
          );
          this.player.setOrigin(0.5);

          this.physics.add.existing(this.player);
          const playerBody = this.player.body as Phaser.Physics.Arcade.Body;
          playerBody.setCircle(30);
          playerBody.setCollideWorldBounds(true);

          this.hazards = this.physics.add.group();
          this.risingFlames = this.physics.add.group();
          this.powerUps = this.physics.add.group();

          this.input.on('pointermove', (pointer: Phaser.Input.Pointer) => {
            if (this.isGameOver) return;
            this.player.x = pointer.x;
            this.player.y = pointer.y;
          });

          this.scoreTimer = this.time.addEvent({
            delay: 100,
            callback: this.incrementScore,
            callbackScope: this,
            loop: true
          });

          this.spawnTimer = this.time.addEvent({
            delay: 500,
            callback: this.spawnHazard,
            callbackScope: this,
            loop: true
          });

          this.powerUpSpawnTimer = this.time.addEvent({
            delay: 7000,
            callback: this.spawnPowerUp,
            callbackScope: this,
            loop: true
          });

          this.physics.add.overlap(
            this.player,
            this.hazards,
            (player, hazard) => this.hitHazard(player, hazard),
            undefined,
            this
          );

          this.physics.add.overlap(
            this.player,
            this.risingFlames,
            (player, flame) => this.hitHazard(player, flame),
            undefined,
            this
          );

          this.physics.add.overlap(
            this.player,
            this.powerUps,
            (player, powerUp) => this.collectPowerUp(player, powerUp),
            undefined,
            this
          );
        }

        update(time: number) {
          this.hazards.children.each((child) => {
            const hazard = child as Phaser.GameObjects.Text;
            if (hazard.active && hazard.y > this.scale.height + 50) {
              hazard.destroy();
            }
            return true;
          });

          this.risingFlames.children.each((child) => {
            const flame = child as Phaser.GameObjects.Text;
            if (flame.active && flame.y < -50) {
              flame.destroy();
            }
            return true;
          });

          this.powerUps.children.each((child) => {
            const powerUp = child as Phaser.GameObjects.Text;
            if (powerUp.active && powerUp.y > this.scale.height + 50) {
              powerUp.destroy();
            }
            return true;
          });

          this.updatePowerUpStates(time);
        }

        incrementScore() {
          if (this.isGameOver) return;
          this.currentScore += this.scoreMultiplier;
          this.game.events.emit('scoreUpdate', this.currentScore);

          if (this.currentScore % 100 === 0) {
            this.increaseDifficulty();
          }

          if (this.currentScore >= 700 && !this.flameSpawnTimer) {
            this.startRisingFlames();
          }
        }

        increaseDifficulty() {
          this.difficultyLevel++;
          this.spawnTimer.remove();
          const newDelay = Math.max(150, 500 - (this.difficultyLevel * 40));
          this.spawnTimer = this.time.addEvent({
            delay: newDelay,
            callback: this.spawnHazard,
            callbackScope: this,
            loop: true
          });
        }

        spawnHazard() {
          if (this.isGameOver) return;

          const x = Phaser.Math.Between(20, this.scale.width - 20);
          const hazard = this.add.text(x, -50, ASSETS.FIRE, { fontSize: '25px' });
          hazard.setOrigin(0.5);

          this.physics.add.existing(hazard);
          this.hazards.add(hazard);

          const body = hazard.body as Phaser.Physics.Arcade.Body;
          const baseSpeed = 300;
          const speedVar = Phaser.Math.Between(0, 100);
          body.setVelocityY(baseSpeed + (this.difficultyLevel * 50) + speedVar);
        }

        startRisingFlames() {
          this.flameSpawnTimer = this.time.addEvent({
            delay: 2000,
            callback: this.spawnRisingFlames,
            callbackScope: this,
            loop: true
          });
        }

        spawnRisingFlames() {
          if (this.isGameOver) return;

          let flameCount = 1;
          if (this.currentScore >= 1500) {
            flameCount = Phaser.Math.Between(1, 5);
          } else if (this.currentScore >= 1000) {
            flameCount = Phaser.Math.Between(1, 4);
          } else {
            flameCount = Phaser.Math.Between(1, 2);
          }

          for (let i = 0; i < flameCount; i++) {
            const x = Phaser.Math.Between(20, this.scale.width - 20);
            const flame = this.add.text(x, this.scale.height + 50, ASSETS.FLAME, { fontSize: '25px' });
            flame.setOrigin(0.5);

            this.physics.add.existing(flame);
            this.risingFlames.add(flame);

            const body = flame.body as Phaser.Physics.Arcade.Body;
            const baseSpeed = -250;
            const speedVar = Phaser.Math.Between(-50, 50);
            body.setVelocityY(baseSpeed + speedVar);
          }
        }

        spawnPowerUp() {
          if (this.isGameOver) return;

          const powerUpTypes = [PowerUpType.DOUBLE_SCORE, PowerUpType.INVISIBLE, PowerUpType.SLOW_MOTION];
          const selectedType = Phaser.Utils.Array.GetRandom(powerUpTypes);

          let emoji = ASSETS.POWERUP_2X;
          if (selectedType === PowerUpType.INVISIBLE) {
            emoji = ASSETS.POWERUP_INVISIBLE;
          } else if (selectedType === PowerUpType.SLOW_MOTION) {
            emoji = ASSETS.POWERUP_SLOWMO;
          }

          const x = Phaser.Math.Between(50, this.scale.width - 50);
          const powerUp = this.add.text(x, -50, emoji, { fontSize: '30px' });
          powerUp.setOrigin(0.5);
          powerUp.setData('powerUpType', selectedType);

          this.physics.add.existing(powerUp);
          this.powerUps.add(powerUp);

          const body = powerUp.body as Phaser.Physics.Arcade.Body;
          body.setVelocityY(200);
        }

        collectPowerUp(playerObj: any, powerUpObj: any) {
          const powerUp = powerUpObj as Phaser.GameObjects.Text;
          const powerUpType = powerUp.getData('powerUpType') as PowerUpType;
          powerUp.destroy();

          const endTime = this.time.now + 10000;
          this.activePowerUps.set(powerUpType, endTime);

          if (powerUpType === PowerUpType.DOUBLE_SCORE) {
            this.scoreMultiplier = 2;
          } else if (powerUpType === PowerUpType.INVISIBLE) {
            this.isInvincible = true;
            this.player.setAlpha(0.4);
          } else if (powerUpType === PowerUpType.SLOW_MOTION) {
            this.physics.world.timeScale = 2;
          }

          this.game.events.emit('powerUpActivated', powerUpType, 10);
        }

        updatePowerUpStates(currentTime: number) {
          const expiredPowerUps: PowerUpType[] = [];

          this.activePowerUps.forEach((endTime, powerUpType) => {
            if (currentTime >= endTime) {
              expiredPowerUps.push(powerUpType);
            } else {
              const remainingTime = Math.ceil((endTime - currentTime) / 1000);
              this.game.events.emit('powerUpUpdate', powerUpType, remainingTime);
            }
          });

          expiredPowerUps.forEach(powerUpType => {
            this.activePowerUps.delete(powerUpType);

            if (powerUpType === PowerUpType.DOUBLE_SCORE) {
              this.scoreMultiplier = 1;
            } else if (powerUpType === PowerUpType.INVISIBLE) {
              this.isInvincible = false;
              this.player.setAlpha(1);
            } else if (powerUpType === PowerUpType.SLOW_MOTION) {
              this.physics.world.timeScale = 1;
            }

            this.game.events.emit('powerUpExpired', powerUpType);
          });
        }

        hitHazard(playerObj: any, hazardObj: any) {
          const hazard = hazardObj as Phaser.GameObjects.Text;
          const player = playerObj as Phaser.GameObjects.Text;

          if (this.isInvincible) {
            return;
          }

          if (this.isGameOver) return;
          this.isGameOver = true;

          this.cameras.main.shake(500, 0.05);
          player.setTint(0xff0000);
          this.physics.pause();
          this.scoreTimer.remove();
          this.spawnTimer.remove();
          if (this.flameSpawnTimer) {
            this.flameSpawnTimer.remove();
          }
          this.powerUpSpawnTimer.remove();

          this.time.delayedCall(1000, () => {
            this.game.events.emit('gameOver', this.currentScore);
          });
        }
      }

      const config: Phaser.Types.Core.GameConfig = {
        type: Phaser.AUTO,
        parent: 'phaser-game',
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
        scene: MainScene,
        scale: {
          mode: Phaser.Scale.RESIZE,
          autoCenter: Phaser.Scale.CENTER_BOTH
        }
      };

      const game = new Phaser.Game(config);
      gameRef.current = game;

      game.events.on('scoreUpdate', (newScore: number) => {
        setScore(newScore);
      });

      game.events.on('gameOver', (finalScore: number) => {
        updateScore(finalScore);
        setAppState(AppState.GAME_OVER);
      });

      game.events.on('powerUpActivated', (powerUpType: PowerUpType, duration: number) => {
        setActivePowerUps(prev => {
          const newMap = new Map(prev);
          newMap.set(powerUpType, duration);
          return newMap;
        });
      });

      game.events.on('powerUpUpdate', (powerUpType: PowerUpType, remainingTime: number) => {
        setActivePowerUps(prev => {
          const newMap = new Map(prev);
          newMap.set(powerUpType, remainingTime);
          return newMap;
        });
      });

      game.events.on('powerUpExpired', (powerUpType: PowerUpType) => {
        setActivePowerUps(prev => {
          const newMap = new Map(prev);
          newMap.delete(powerUpType);
          return newMap;
        });
      });
    };

    startGame();

    return () => {
      cancelled = true;
      if (gameRef.current) {
        gameRef.current.destroy(true);
        gameRef.current = null;
      }
    };
  }, [setAppState, updateScore]);

  const getPowerUpDisplay = (type: PowerUpType) => {
    switch (type) {
      case PowerUpType.DOUBLE_SCORE:
        return { emoji: '🎁', label: '2x Score', color: 'bg-yellow-500/90' };
      case PowerUpType.INVISIBLE:
        return { emoji: '👻', label: 'Invisible', color: 'bg-purple-500/90' };
      case PowerUpType.SLOW_MOTION:
        return { emoji: '⏰', label: 'Slow-Mo', color: 'bg-blue-500/90' };
    }
  };

  return (
    <div className="relative w-full h-full overflow-hidden cursor-crosshair">
      <div id="phaser-game" className="absolute inset-0 z-0 touch-none" />

      <div className="absolute top-4 left-4 z-10 flex flex-wrap items-start gap-3 pointer-events-none">
        <div className="bg-white/90 backdrop-blur-md border border-slate-200 rounded-2xl px-6 py-3 shadow-lg">
          <span className="text-slate-500 text-xs font-bold uppercase tracking-wider block">Score</span>
          <span className="text-4xl font-black text-slate-800 font-mono">{score}</span>
        </div>

        {Array.from(activePowerUps.entries()).map(([type, remainingTime]) => {
          const display = getPowerUpDisplay(type);
          if (!display) return null;
          return (
            <div
              key={type}
              className={`${display.color} backdrop-blur-md rounded-xl px-4 py-2 shadow-md flex items-center gap-2`}
            >
              <span className="text-2xl">{display.emoji}</span>
              <div className="flex flex-col">
                <span className="text-white text-xs font-bold uppercase tracking-wider">
                  {display.label}
                </span>
                <span className="text-white/90 text-xs font-mono">
                  {remainingTime}s
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="absolute bottom-6 w-full text-center text-slate-400 text-sm pointer-events-none opacity-50 font-medium">
        Drag anywhere to fly
      </div>
    </div>
  );
};

export default GameCanvas;