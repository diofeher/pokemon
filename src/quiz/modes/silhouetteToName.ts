import type { Pokemon } from "../../types/pokemon";
import type { QuizModeDefinition } from "../../types/quiz";
import { generateId } from "../../lib/arrayUtils";
import { formatTypeLabel } from "../../lib/format";
import { buildOptions, createModeGenerators } from "../questionFactory";

export const silhouetteToNameMode: QuizModeDefinition = {
  id: "silhouette-to-name",
  label: "Who's That Pokémon?",
  emoji: "🌑",
  description: "Identify the Pokémon from its silhouette",

  ...createModeGenerators((target: Pokemon, pool: Pokemon[]) => ({
    id: generateId(),
    modeId: "silhouette-to-name",
    targetPokemonId: target.id,
    prompt: "Who's that Pokémon?",
    promptImageUrl: target.spriteUrl,
    options: buildOptions(
      target,
      pool,
      (p) => `#${String(p.id).padStart(4, "0")} ${p.name}`
    ),
    correctOptionId: String(target.id),
    correctDetail: formatTypeLabel(target.types),
  })),
};
