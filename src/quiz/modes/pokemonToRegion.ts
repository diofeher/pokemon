import type { Pokemon } from "../../types/pokemon";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { sampleSize, shuffle, generateId } from "../../lib/arrayUtils";
import { pickUnusedPokemon } from "../questionFactory";
import { REGIONS, getRegionName } from "../../data/regions";

export const pokemonToRegionMode: QuizModeDefinition = {
  id: "pokemon-to-region",
  label: "Pokémon → Region",
  emoji: "🗺️",
  description: "Guess which region a Pokémon is from",

  generateQuestion(pokemon: Pokemon[], usedIds: Set<number>): QuizQuestion {
    const target = pickUnusedPokemon(pokemon, usedIds);
    if (!target) throw new Error("No unused Pokémon available");
    usedIds.add(target.id);

    // 1 correct region + 3 random wrong regions
    const wrongRegions = sampleSize(
      REGIONS.filter((r) => r.id !== target.regionId),
      3
    );

    const options = shuffle([
      { id: target.regionId, label: getRegionName(target.regionId) },
      ...wrongRegions.map((r) => ({ id: r.id, label: r.name })),
    ]);

    return {
      id: generateId(),
      modeId: "pokemon-to-region",
      prompt: `Which region is #${String(target.id).padStart(4, "0")} ${target.name} from?`,
      promptImageUrl: target.spriteUrl,
      options,
      correctOptionId: target.regionId,
      correctDetail: `Generation ${target.generation}`,
    };
  },
};
