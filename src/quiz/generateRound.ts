import type { Pokemon } from "../types/pokemon";
import type { QuizModeId, QuizQuestion } from "../types/quiz";
import { getQuizMode } from "./registry";

export const QUESTIONS_PER_ROUND = 10;

export function generateRound(
  modeId: QuizModeId,
  pokemon: Pokemon[],
  count: number = QUESTIONS_PER_ROUND
): QuizQuestion[] {
  const mode = getQuizMode(modeId);
  const usedIds = new Set<number>();
  const questions: QuizQuestion[] = [];

  for (let i = 0; i < count; i++) {
    try {
      questions.push(mode.generateQuestion(pokemon, usedIds));
    } catch {
      // Ran out of unused Pokemon — return what we have
      break;
    }
  }

  return questions;
}
