import { useCallback } from "react";
import { QUIZ_MODES } from "../../../quiz/registry";
import { QUESTIONS_PER_ROUND } from "../../../quiz/generateRound";
import { useStatsContext } from "../../../context/StatsContext";
import { useDifficultyContext } from "../../../context/DifficultyContext";
import { playSelect } from "../../../lib/sounds";
import { DifficultySelector } from "./DifficultySelector";
import type { QuizModeId } from "../../../types/quiz";
import styles from "./ModeSelector.module.css";

interface ModeSelectorProps {
  onSelect: (modeId: QuizModeId) => void;
  onReview: (modeId: QuizModeId) => void;
  dueCountsByMode: Record<QuizModeId, number>;
}

export function ModeSelector({
  onSelect,
  onReview,
  dueCountsByMode,
}: ModeSelectorProps) {
  const { stats } = useStatsContext();
  const { difficulty } = useDifficultyContext();

  const handleSelect = useCallback(
    (modeId: QuizModeId) => {
      playSelect();
      onSelect(modeId);
    },
    [onSelect]
  );

  const handleReview = useCallback(
    (modeId: QuizModeId) => {
      playSelect();
      onReview(modeId);
    },
    [onReview]
  );

  const totalDue = Object.values(dueCountsByMode).reduce((a, b) => a + b, 0);

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>Choose a Quiz Mode</h2>
      <p className={styles.subtitle}>
        Test your Pokémon knowledge, trainer!
      </p>

      <DifficultySelector />

      <div className={styles.grid}>
        {QUIZ_MODES.map((mode) => {
          const modeStats = stats.modes[difficulty][mode.id];
          const dueCount = dueCountsByMode[mode.id];
          return (
            <button
              key={mode.id}
              className={styles.card}
              onClick={() => handleSelect(mode.id)}
            >
              <span className={styles.emoji}>{mode.emoji}</span>
              <span className={styles.label}>{mode.label}</span>
              <span className={styles.description}>{mode.description}</span>
              {modeStats.gamesPlayed > 0 && (
                <span className={styles.best}>
                  Best: {modeStats.bestScore}/{QUESTIONS_PER_ROUND}
                </span>
              )}
              {dueCount > 0 && (
                <span className={styles.dueBadge}>
                  📬 {dueCount} due
                </span>
              )}
            </button>
          );
        })}
      </div>

      {totalDue > 0 && (
        <div className={styles.reviewSection}>
          <h3 className={styles.reviewHeading}>📅 Spaced Review</h3>
          <div className={styles.reviewChips}>
            {QUIZ_MODES.map((mode) => {
              const dueCount = dueCountsByMode[mode.id];
              if (dueCount === 0) return null;
              return (
                <button
                  key={mode.id}
                  className={styles.reviewChip}
                  onClick={() => handleReview(mode.id)}
                >
                  {mode.emoji} {mode.label} ({dueCount})
                </button>
              );
            })}
          </div>
        </div>
      )}

      {stats.totalGames > 0 && (
        <p className={styles.totalGames}>
          Total games played: {stats.totalGames}
        </p>
      )}
    </div>
  );
}
