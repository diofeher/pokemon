/** Pure business queries over a CardMap */

import type { QuizModeId } from "../types/quiz";
import type { CardState } from "./sm2";
import type { CardMap } from "./cardStore";
import { isDue } from "./sm2";
import { parseCardId } from "./cardId";

export interface DueCard {
  cardId: string;
  modeId: QuizModeId;
  pokemonId: number;
  state: CardState;
}

/** Get all due cards for a specific mode */
export function getDueCardsForMode(
  cards: CardMap,
  modeId: QuizModeId,
): DueCard[] {
  const result: DueCard[] = [];
  for (const [cardId, state] of Object.entries(cards)) {
    if (!isDue(state)) continue;
    const parsed = parseCardId(cardId);
    if (!parsed || parsed.modeId !== modeId) continue;
    result.push({ cardId, modeId: parsed.modeId, pokemonId: parsed.pokemonId, state });
  }
  return result;
}

/** Get due counts per mode (for badges) */
export function getDueCountsByMode(
  cards: CardMap,
): Record<QuizModeId, number> {
  const counts: Record<string, number> = {
    "silhouette-to-name": 0,
    "name-to-type": 0,
    "pokemon-to-region": 0,
  };
  for (const [cardId, state] of Object.entries(cards)) {
    if (!isDue(state)) continue;
    const parsed = parseCardId(cardId);
    if (parsed && parsed.modeId in counts) {
      counts[parsed.modeId] += 1;
    }
  }
  return counts as Record<QuizModeId, number>;
}

/** Get tracked card counts per mode */
export function getTrackedCountsByMode(
  cards: CardMap,
): Record<QuizModeId, number> {
  const counts: Record<string, number> = {
    "silhouette-to-name": 0,
    "name-to-type": 0,
    "pokemon-to-region": 0,
  };
  for (const cardId of Object.keys(cards)) {
    const parsed = parseCardId(cardId);
    if (parsed && parsed.modeId in counts) {
      counts[parsed.modeId] += 1;
    }
  }
  return counts as Record<QuizModeId, number>;
}

export interface SRStats {
  tracked: number;
  learning: number;
  mastered: number;
  due: number;
}

/** Aggregate SR stats across all modes */
export function getAggregateStats(cards: CardMap): SRStats {
  let tracked = 0;
  let learning = 0;
  let mastered = 0;
  let due = 0;

  for (const state of Object.values(cards)) {
    tracked += 1;
    if (state.interval > 21) {
      mastered += 1;
    } else {
      learning += 1;
    }
    if (isDue(state)) {
      due += 1;
    }
  }

  return { tracked, learning, mastered, due };
}

