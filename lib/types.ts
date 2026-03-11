export enum AppState {
  VALIDATING_QR = 'VALIDATING_QR',
  INVALID_QR = 'INVALID_QR',
  REGISTRATION = 'REGISTRATION',
  TUTORIAL = 'TUTORIAL',
  PLAYING = 'PLAYING',
  GAME_OVER = 'GAME_OVER',
  LEADERBOARD = 'LEADERBOARD',
}

export interface Player {
  name: string;
  phone: string;
  score: number;
  session_id?: string;
  qr_token?: string;
}

export interface LeaderboardEntry {
  rank: number;
  name: string;
  score: number;
  isCurrentUser?: boolean;
}

export interface GameConfig {
  speed: number;
  spawnRate: number;
}