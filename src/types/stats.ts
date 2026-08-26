import type { QuizModeId } from "./quiz";
import type { DifficultyId } from "./difficulty";

export interface ModeStats {
  bestScore: number;
  gamesPlayed: number;
  currentStreak: number;
  bestStreak: number;
}

export interface StatsState {
  schemaVersion: 1;
  totalGames: number;
  modes: Record<DifficultyId, Record<QuizModeId, ModeStats>>;
}

export const DEFAULT_MODE_STATS: ModeStats = {
  bestScore: 0,
  gamesPlayed: 0,
  currentStreak: 0,
  bestStreak: 0,
};

function createDefaultModes(): Record<QuizModeId, ModeStats> {
  return {
    "silhouette-to-name": { ...DEFAULT_MODE_STATS },
    "name-to-type": { ...DEFAULT_MODE_STATS },
    "pokemon-to-region": { ...DEFAULT_MODE_STATS },
  };
}

export const DEFAULT_STATS: StatsState = {
  schemaVersion: 1,
  totalGames: 0,
  modes: {
    easy: createDefaultModes(),
    medium: createDefaultModes(),
    hard: createDefaultModes(),
  },
};
