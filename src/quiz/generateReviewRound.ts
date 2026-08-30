import type { Pokemon } from "../types/pokemon";
import type { QuizModeId, QuizQuestion } from "../types/quiz";
import { getQuizMode } from "./registry";
import { shuffle } from "../lib/arrayUtils";

export const MAX_REVIEW_QUESTIONS = 20;

/**
 * Generate a review round for specific due Pokémon.
 * Uses the full (unfiltered) pokemon roster for distractors.
 */
export function generateReviewRound(
  modeId: QuizModeId,
  duePokemonIds: number[],
  allPokemon: Pokemon[],
  maxQuestions: number = MAX_REVIEW_QUESTIONS,
): QuizQuestion[] {
  const mode = getQuizMode(modeId);
  const byId = new Map(allPokemon.map((p) => [p.id, p]));

  return shuffle(duePokemonIds)
    .slice(0, maxQuestions)
    .map((id) => byId.get(id))
    .filter((p): p is Pokemon => Boolean(p))
    .map((target) => mode.generateQuestionForPokemon(target, allPokemon));
}
