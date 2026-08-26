import type { DifficultyDefinition, DifficultyId } from "../types/difficulty";

export const DIFFICULTY_LEVELS: DifficultyDefinition[] = [
  {
    id: "easy",
    label: "Easy",
    emoji: "⭐",
    description: "Starters, legendaries & fan favorites",
  },
  {
    id: "medium",
    label: "Medium",
    emoji: "⭐⭐",
    description: "Common Pokémon across all generations",
  },
  {
    id: "hard",
    label: "Hard",
    emoji: "⭐⭐⭐",
    description: "Obscure & regional variants — true Pokédex masters only",
  },
];

export function getDifficulty(id: DifficultyId): DifficultyDefinition {
  const d = DIFFICULTY_LEVELS.find((l) => l.id === id);
  if (!d) throw new Error(`Unknown difficulty: ${id}`);
  return d;
}
