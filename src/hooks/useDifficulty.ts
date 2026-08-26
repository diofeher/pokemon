import { useState, useCallback } from "react";
import type { DifficultyId } from "../types/difficulty";
import { getItem, setItem } from "../lib/storage";

const DIFFICULTY_KEY = "difficulty";

export function useDifficulty() {
  const [difficulty, setDifficultyState] = useState<DifficultyId>(() =>
    getItem<DifficultyId>(DIFFICULTY_KEY, "easy")
  );

  const setDifficulty = useCallback((id: DifficultyId) => {
    setItem(DIFFICULTY_KEY, id);
    setDifficultyState(id);
  }, []);

  return { difficulty, setDifficulty };
}
