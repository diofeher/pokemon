import { useState, useCallback } from "react";
import type { QuizModeId } from "../types/quiz";
import type { DifficultyId } from "../types/difficulty";
import type { StatsState, ModeStats } from "../types/stats";
import { DEFAULT_STATS, DEFAULT_MODE_STATS } from "../types/stats";
import { getItem, setItem } from "../lib/storage";

const STATS_KEY = "stats";

function loadStats(): StatsState {
  const raw = getItem<Partial<StatsState>>(STATS_KEY, DEFAULT_STATS);
  const result: StatsState = {
    schemaVersion: 1,
    totalGames: raw.totalGames ?? 0,
    modes: {
      easy: { ...DEFAULT_STATS.modes.easy, ...(raw.modes?.easy ?? {}) },
      medium: { ...DEFAULT_STATS.modes.medium, ...(raw.modes?.medium ?? {}) },
      hard: { ...DEFAULT_STATS.modes.hard, ...(raw.modes?.hard ?? {}) },
    },
  };
  return result;
}

function persistStats(stats: StatsState): void {
  setItem(STATS_KEY, stats);
}

export function useStats() {
  const [stats, setStats] = useState<StatsState>(loadStats);

  const recordResult = useCallback(
    (
      modeId: QuizModeId,
      difficultyId: DifficultyId,
      score: number,
      total: number
    ) => {
      setStats((prev) => {
        const modeStats: ModeStats =
          prev.modes[difficultyId]?.[modeId] ?? DEFAULT_MODE_STATS;
        const percentage = total > 0 ? (score / total) * 100 : 0;
        const passed = percentage >= 70;

        const newStreak = passed ? modeStats.currentStreak + 1 : 0;
        const newBestStreak = Math.max(modeStats.bestStreak, newStreak);
        const newBestScore = Math.max(modeStats.bestScore, score);

        const updated: StatsState = {
          ...prev,
          totalGames: prev.totalGames + 1,
          modes: {
            ...prev.modes,
            [difficultyId]: {
              ...prev.modes[difficultyId],
              [modeId]: {
                bestScore: newBestScore,
                gamesPlayed: modeStats.gamesPlayed + 1,
                currentStreak: newStreak,
                bestStreak: newBestStreak,
              },
            },
          },
        };

        persistStats(updated);
        return updated;
      });
    },
    []
  );

  const resetStats = useCallback(() => {
    const fresh: StatsState = {
      ...DEFAULT_STATS,
      modes: {
        easy: { ...DEFAULT_STATS.modes.easy },
        medium: { ...DEFAULT_STATS.modes.medium },
        hard: { ...DEFAULT_STATS.modes.hard },
      },
    };
    persistStats(fresh);
    setStats(fresh);
  }, []);

  return { stats, recordResult, resetStats };
}
