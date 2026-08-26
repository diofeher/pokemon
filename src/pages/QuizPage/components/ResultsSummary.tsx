import { useEffect } from "react";
import type { QuizModeId } from "../../../types/quiz";
import type { DifficultyId } from "../../../types/difficulty";
import { useStatsContext } from "../../../context/StatsContext";
import { getQuizMode } from "../../../quiz/registry";
import { getDifficulty } from "../../../data/difficulties";
import { QUESTIONS_PER_ROUND } from "../../../quiz/generateRound";
import { playComplete } from "../../../lib/sounds";
import styles from "./ResultsSummary.module.css";

interface ResultsSummaryProps {
  modeId: QuizModeId;
  difficultyId: DifficultyId;
  score: number;
  total: number;
  onPlayAgain: () => void;
  onChangeModes: () => void;
}

function getEmoji(percentage: number): string {
  if (percentage === 100) return "🏆";
  if (percentage >= 70) return "🎉";
  if (percentage >= 40) return "📚";
  return "💪";
}

function getMessage(percentage: number): string {
  if (percentage === 100) return "Pokémon Master!";
  if (percentage >= 70) return "Great job, trainer!";
  if (percentage >= 40) return "Keep training!";
  return "Don't give up!";
}

export function ResultsSummary({
  modeId,
  difficultyId,
  score,
  total,
  onPlayAgain,
  onChangeModes,
}: ResultsSummaryProps) {
  const { stats } = useStatsContext();
  const mode = getQuizMode(modeId);
  const difficulty = getDifficulty(difficultyId);
  const percentage = total > 0 ? Math.round((score / total) * 100) : 0;
  const modeStats = stats.modes[difficultyId][modeId];

  // Play completion sound on mount
  useEffect(() => {
    playComplete();
  }, []);

  return (
    <div className={styles.container}>
      <span className={styles.emoji}>{getEmoji(percentage)}</span>
      <h2 className={styles.message}>{getMessage(percentage)}</h2>

      <div className={styles.scoreCard}>
        <span className={styles.scoreValue}>
          {score}/{total}
        </span>
        <span className={styles.percentage}>{percentage}%</span>
      </div>

      <p className={styles.mode}>
        {mode.emoji} {mode.label} · {difficulty.emoji} {difficulty.label}
      </p>

      <div className={styles.statsGrid}>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {modeStats.bestScore}/{QUESTIONS_PER_ROUND}
          </span>
          <span className={styles.statLabel}>Best Score</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{modeStats.currentStreak}</span>
          <span className={styles.statLabel}>Streak</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{modeStats.bestStreak}</span>
          <span className={styles.statLabel}>Best Streak</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>{modeStats.gamesPlayed}</span>
          <span className={styles.statLabel}>Games</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className={styles.primaryButton} onClick={onPlayAgain}>
          🔄 Play Again
        </button>
        <button className={styles.secondaryButton} onClick={onChangeModes}>
          ← Change Mode
        </button>
      </div>
    </div>
  );
}
