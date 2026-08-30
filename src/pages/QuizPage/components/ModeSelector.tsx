import { useCallback } from "react";
import { QUIZ_MODES } from "../../../quiz/registry";
import { QUESTIONS_PER_ROUND } from "../../../quiz/generateRound";
import { useStatsContext } from "../../../context/StatsContext";
import { useDifficultyContext } from "../../../context/DifficultyContext";
import { playSelect } from "../../../lib/sounds";
import { DifficultySelector } from "./DifficultySelector";
import type { QuizModeId } from "../../../types/quiz";
import type { SRStats } from "../../../spacedRepetition/dueCards";
import styles from "./ModeSelector.module.css";

interface ModeSelectorProps {
  onSelect: (modeId: QuizModeId) => void;
  onReview: (modeId: QuizModeId) => void;
  dueCountsByMode: Record<QuizModeId, number>;
  srStats: SRStats;
}

export function ModeSelector({
  onSelect,
  onReview,
  dueCountsByMode,
  srStats,
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
            </button>
          );
        })}
      </div>

      <div className={styles.srSection}>
        <h3 className={styles.srHeading}>🧠 Spaced Repetition</h3>
        <p className={styles.srSubtitle}>
          {srStats.tracked === 0
            ? "Play quiz modes above to start tracking cards"
            : "Review cards when they're due to strengthen memory"}
        </p>

        <div className={styles.srModes}>
          {QUIZ_MODES.map((mode) => {
            const dueCount = dueCountsByMode[mode.id];
            const hasDue = dueCount > 0;
            return (
              <button
                key={mode.id}
                className={`${styles.srModeButton} ${hasDue ? styles.srModeActive : ""}`}
                onClick={() => handleReview(mode.id)}
                disabled={!hasDue}
              >
                <span className={styles.srModeEmoji}>{mode.emoji}</span>
                <span className={styles.srModeLabel}>{mode.label}</span>
                <span className={styles.srModeDue}>
                  {hasDue ? `📬 ${dueCount} due` : "✓ caught up"}
                </span>
              </button>
            );
          })}
        </div>

        {srStats.tracked > 0 && (
          <div className={styles.srStatsGrid}>
            <div className={styles.srStat}>
              <span className={styles.srStatValue}>{srStats.tracked}</span>
              <span className={styles.srStatLabel}>Tracked</span>
            </div>
            <div className={styles.srStat}>
              <span className={styles.srStatValue}>{srStats.learning}</span>
              <span className={styles.srStatLabel}>Learning</span>
            </div>
            <div className={styles.srStat}>
              <span className={styles.srStatValue}>{srStats.mastered}</span>
              <span className={styles.srStatLabel}>Mastered</span>
            </div>
            <div className={styles.srStat}>
              <span className={styles.srStatValue}>{srStats.due}</span>
              <span className={styles.srStatLabel}>Due</span>
            </div>
          </div>
        )}
      </div>

      {stats.totalGames > 0 && (
        <p className={styles.totalGames}>
          Total games played: {stats.totalGames}
        </p>
      )}
    </div>
  );
}
