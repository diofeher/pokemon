import { useMemo } from "react";
import { POKEMON } from "../../../data/pokemon";
import { DIFFICULTY_LEVELS } from "../../../data/difficulties";
import { useDifficultyContext } from "../../../context/DifficultyContext";
import { countPokemonByDifficulty } from "../../../quiz/pokemonFilters";
import styles from "./DifficultySelector.module.css";

export function DifficultySelector() {
  const { difficulty, setDifficulty } = useDifficultyContext();
  const pokemonCounts = useMemo(() => countPokemonByDifficulty(POKEMON), []);

  return (
    <div className={styles.container}>
      <span className={styles.label}>Difficulty</span>
      <div className={styles.segmented}>
        {DIFFICULTY_LEVELS.map((d) => (
          <button
            key={d.id}
            className={`${styles.segment} ${difficulty === d.id ? styles.active : ""}`}
            aria-pressed={difficulty === d.id}
            onClick={() => setDifficulty(d.id)}
          >
            <span className={styles.segmentLabel}>
              {d.emoji} {d.label}
            </span>
            <span className={styles.count}>
              {pokemonCounts[d.id]} pokémon
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
