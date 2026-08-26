import type { QuizModeDefinition, QuizModeId } from "../types/quiz";
import { silhouetteToNameMode } from "./modes/silhouetteToName";
import { nameToTypeMode } from "./modes/nameToType";
import { pokemonToRegionMode } from "./modes/pokemonToRegion";

export const QUIZ_MODES: QuizModeDefinition[] = [
  silhouetteToNameMode,
  nameToTypeMode,
  pokemonToRegionMode,
];

export function getQuizMode(id: QuizModeId): QuizModeDefinition {
  const mode = QUIZ_MODES.find((m) => m.id === id);
  if (!mode) throw new Error(`Unknown quiz mode: ${id}`);
  return mode;
}
