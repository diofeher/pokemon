import type { Pokemon } from "../types/pokemon";
import type { QuizOption, QuizQuestion } from "../types/quiz";
import { sampleSize, shuffle } from "../lib/arrayUtils";

/**
 * Build a set of quiz options: one correct + N distractors.
 * Prefers distractors sharing the same primary type for difficulty.
 */
export function buildOptions(
  correctPokemon: Pokemon,
  allPokemon: Pokemon[],
  labelFn: (p: Pokemon) => string,
  imageFn?: (p: Pokemon) => string,
  distractorCount: number = 3
): QuizOption[] {
  const sameType = allPokemon.filter(
    (p) =>
      p.types[0] === correctPokemon.types[0] && p.id !== correctPokemon.id
  );

  let distractors: Pokemon[];
  if (sameType.length >= distractorCount) {
    distractors = sampleSize(sameType, distractorCount);
  } else {
    const others = allPokemon.filter((p) => p.id !== correctPokemon.id);
    distractors = sampleSize(others, distractorCount);
  }

  const correct: QuizOption = {
    id: String(correctPokemon.id),
    label: labelFn(correctPokemon),
    imageUrl: imageFn?.(correctPokemon),
  };

  const wrong: QuizOption[] = distractors.map((p) => ({
    id: String(p.id),
    label: labelFn(p),
    imageUrl: imageFn?.(p),
  }));

  return shuffle([correct, ...wrong]);
}

/**
 * Pick a Pokemon from the pool that hasn't been used yet.
 */
export function pickUnusedPokemon(
  pokemon: Pokemon[],
  usedIds: Set<number>
): Pokemon | null {
  const available = pokemon.filter((p) => !usedIds.has(p.id));
  if (available.length === 0) return null;
  return available[Math.floor(Math.random() * available.length)];
}

/**
 * Create both generateQuestion and generateQuestionForPokemon from a single
 * buildQuestion function, eliminating boilerplate in each mode file.
 */
export function createModeGenerators(
  buildQuestion: (target: Pokemon, pool: Pokemon[]) => QuizQuestion
) {
  return {
    generateQuestion(pokemon: Pokemon[], usedIds: Set<number>): QuizQuestion {
      const target = pickUnusedPokemon(pokemon, usedIds);
      if (!target) throw new Error("No unused Pokémon available");
      usedIds.add(target.id);
      return buildQuestion(target, pokemon);
    },
    generateQuestionForPokemon(target: Pokemon, pool: Pokemon[]): QuizQuestion {
      return buildQuestion(target, pool);
    },
  };
}

