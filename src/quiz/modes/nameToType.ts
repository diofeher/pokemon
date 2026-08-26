import type { Pokemon } from "../../types/pokemon";
import type { QuizModeDefinition, QuizQuestion } from "../../types/quiz";
import { sampleSize, shuffle, generateId } from "../../lib/arrayUtils";
import { formatTypeLabel } from "../../lib/format";
import { pickUnusedPokemon } from "../questionFactory";

export const nameToTypeMode: QuizModeDefinition = {
  id: "name-to-type",
  label: "Name → Type",
  emoji: "🔥",
  description: "Guess the Pokémon's type(s)",

  generateQuestion(pokemon: Pokemon[], usedIds: Set<number>): QuizQuestion {
    const target = pickUnusedPokemon(pokemon, usedIds);
    if (!target) throw new Error("No unused Pokémon available");
    usedIds.add(target.id);

    const correctLabel = formatTypeLabel(target.types);

    // Build distractors from distinct type combinations in the pool
    const seenLabels = new Set<string>([correctLabel]);
    const distractorPool = pokemon.filter((p) => {
      const label = formatTypeLabel(p.types);
      if (seenLabels.has(label)) return false;
      seenLabels.add(label);
      return true;
    });

    const distractors = sampleSize(distractorPool, 3);

    const options = shuffle([
      { id: correctLabel, label: correctLabel },
      ...distractors.map((p) => {
        const label = formatTypeLabel(p.types);
        return { id: label, label };
      }),
    ]);

    return {
      id: generateId(),
      modeId: "name-to-type",
      prompt: `What type is #${String(target.id).padStart(4, "0")} ${target.name}?`,
      promptImageUrl: target.spriteUrl,
      options,
      correctOptionId: correctLabel,
    };
  },
};
