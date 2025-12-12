import { LeaderboardEntry } from './types';

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { rank: 1, name: "Elf Tinsel", score: 842 },
  { rank: 2, name: "Rudolph R.", score: 728 },
  { rank: 3, name: "Frosty S.", score: 615 },
  { rank: 4, name: "Mrs. Claus", score: 498 },
  { rank: 5, name: "Buddy Elf", score: 385 },
  { rank: 6, name: "Grinch", score: 272 },
  { rank: 7, name: "Kevin M.", score: 164 },
];

export const ASSETS = {
  PLAYER: '🎅',
  FIRE: '🔥',
  FLAME: '🔥', // Rising flames
  POWERUP_2X: '🎁', // 2x score power-up
  POWERUP_INVISIBLE: '👻', // Invisible power-up
  POWERUP_SLOWMO: '⏰', // Slow motion power-up
};

export enum PowerUpType {
  DOUBLE_SCORE = 'DOUBLE_SCORE',
  INVISIBLE = 'INVISIBLE',
  SLOW_MOTION = 'SLOW_MOTION',
}