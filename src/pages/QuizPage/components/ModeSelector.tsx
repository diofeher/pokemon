import { QUIZ_MODES } from "../../../quiz/registry";
import { QUESTIONS_PER_ROUND } from "../../../quiz/generateRound";
import { useStatsContext } from "../../../context/StatsContext";
import { useDifficultyContext } from "../../../context/DifficultyContext";
import { DifficultySelector } from "./DifficultySelector";
import type { QuizModeId } from "../../../types/quiz";
import styles from "./ModeSelector.module.css";

interface ModeSelectorProps {
  onSelect: (modeId: QuizModeId) => void;
}

export function ModeSelector({ onSelect }: ModeSelectorProps) {
  const { stats } = useStatsContext();
  const { difficulty } = useDifficultyContext();

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
              onClick={() => onSelect(mode.id)}
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

      {stats.totalGames > 0 && (
        <p className={styles.totalGames}>
          Total games played: {stats.totalGames}
        </p>
      )}
    </div>
  );
}
