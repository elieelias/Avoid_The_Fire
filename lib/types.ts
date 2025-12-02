export enum AppState {
    SCAN_VALIDATION = 'SCAN_VALIDATION',
    REGISTRATION = 'REGISTRATION',
    TUTORIAL = 'TUTORIAL',
    GAME = 'GAME',
    GAME_OVER = 'GAME_OVER'
}

export interface PlayerProfile {
    name: string;
    phone: string;
}

export interface LeaderboardEntry {
    rank: number;
    name: string;
    score: number;
    isCurrentUser?: boolean;
}

export interface GameConfig {
    initialSpeed: number;
    spawnRate: number;
    speedIncrement: number;
}