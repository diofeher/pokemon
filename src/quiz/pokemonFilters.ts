import type { Pokemon } from "../types/pokemon";
import type { DifficultyId } from "../types/difficulty";

const MIN_POOL_SIZE = 10;

export function filterPokemonByDifficulty(
  pokemon: Pokemon[],
  difficulty: DifficultyId
): Pokemon[] {
  let filtered: Pokemon[];

  switch (difficulty) {
    case "easy":
      filtered = pokemon.filter((p) => p.popularity === "easy");
      break;
    case "medium":
      // Medium includes easy + medium for a bigger pool
      filtered = pokemon.filter(
        (p) => p.popularity === "easy" || p.popularity === "medium"
      );
      break;
    case "hard":
      // Hard includes everything
      filtered = pokemon;
      break;
    default:
      filtered = pokemon;
  }

  return filtered.length >= MIN_POOL_SIZE ? filtered : pokemon;
}

export function countPokemonByDifficulty(
  pokemon: Pokemon[]
): Record<DifficultyId, number> {
  return {
    easy: pokemon.filter((p) => p.popularity === "easy").length,
    medium: pokemon.filter(
      (p) => p.popularity === "easy" || p.popularity === "medium"
    ).length,
    hard: pokemon.length,
  };
}
