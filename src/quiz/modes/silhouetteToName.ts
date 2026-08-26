import type { Pokemon } from "../../types/pokemon";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { generateId } from "../../lib/arrayUtils";
import { formatTypeLabel } from "../../lib/format";
import { buildOptions, pickUnusedPokemon } from "../questionFactory";

export const silhouetteToNameMode: QuizModeDefinition = {
  id: "silhouette-to-name",
  label: "Who's That Pokémon?",
  emoji: "🌑",
  description: "Identify the Pokémon from its silhouette",

  generateQuestion(pokemon: Pokemon[], usedIds: Set<number>): QuizQuestion {
    const target = pickUnusedPokemon(pokemon, usedIds);
    if (!target) throw new Error("No unused Pokémon available");
    usedIds.add(target.id);

    const options = buildOptions(
      target,
      pokemon,
      (p) => `#${String(p.id).padStart(4, "0")} ${p.name}`
    );

    return {
      id: generateId(),
      modeId: "silhouette-to-name",
      prompt: "Who's that Pokémon?",
      promptImageUrl: target.spriteUrl,
      options,
      correctOptionId: String(target.id),
      correctDetail: formatTypeLabel(target.types),
    };
  },
};
