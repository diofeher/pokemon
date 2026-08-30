/** Card identity: ${modeId}:${pokemonId} */

import type { QuizModeId } from "../types/quiz";

const SEPARATOR = ":";

export function buildCardId(modeId: QuizModeId, pokemonId: number): string {
  return `${modeId}${SEPARATOR}${pokemonId}`;
}

export interface ParsedCardId {
  modeId: QuizModeId;
  pokemonId: number;
}

export function parseCardId(cardId: string): ParsedCardId | null {
  const sepIndex = cardId.lastIndexOf(SEPARATOR);
  if (sepIndex === -1) return null;

  const modeId = cardId.slice(0, sepIndex) as QuizModeId;
  const pokemonId = Number(cardId.slice(sepIndex + 1));

  if (isNaN(pokemonId)) return null;
  return { modeId, pokemonId };
}
