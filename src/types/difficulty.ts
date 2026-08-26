export type DifficultyId = "easy" | "medium" | "hard";

export interface DifficultyDefinition {
  id: DifficultyId;
  label: string;
  emoji: string;
  description: string;
}
