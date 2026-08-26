/**
 * Compute popularity-based difficulty tier for a Pokemon.
 * First match wins.
 */

/** Hand-picked overrides for mons the heuristic gets wrong */
const CURATED_OVERRIDES = {
  // Bump to easy — universally recognized
  132: "easy", // Ditto
  133: "easy", // Eevee
  143: "easy", // Snorlax
  25: "easy",  // Pikachu (redundant safety — already starter-adjacent)
  26: "easy",  // Raichu
  39: "easy",  // Jigglypuff
  52: "easy",  // Meowth
  54: "easy",  // Psyduck
  55: "easy",  // Golduck
  74: "easy",  // Geodude
  94: "easy",  // Gengar
  129: "easy", // Magikarp
  130: "easy", // Gyarados
  131: "easy", // Lapras
  137: "easy", // Porygon
  142: "easy", // Aerodactyl
  147: "easy", // Dratini
  148: "easy", // Dragonair
  149: "easy", // Dragonite
  175: "easy", // Togepi
  196: "easy", // Espeon
  197: "easy", // Umbreon
  246: "easy", // Larvitar
  248: "easy", // Tyranitar
  252: "easy", // Treecko (starter)
  255: "easy", // Torchic (starter)
  258: "easy", // Mudkip (starter)
  359: "easy", // Absol
  374: "easy", // Beldum
  376: "easy", // Metagross
  384: "easy", // Rayquaza
  445: "easy", // Garchomp
  448: "easy", // Lucario
  778: "easy", // Mimikyu
  887: "easy", // Dragapult
  // Bump to hard — obscure despite legendary status
  // (none needed yet, but the shape is here)
};

// National Dex IDs of all starter Pokemon (all evolution stages)
const STARTER_IDS = new Set([
  // Gen 1
  1, 2, 3, 4, 5, 6, 7, 8, 9,
  // Gen 2
  152, 153, 154, 155, 156, 157, 158, 159, 160,
  // Gen 3
  252, 253, 254, 255, 256, 257, 258, 259, 260,
  // Gen 4
  387, 388, 389, 390, 391, 392, 393, 394, 395,
  // Gen 5
  495, 496, 497, 498, 499, 500, 501, 502, 503,
  // Gen 6
  650, 651, 652, 653, 654, 655, 656, 657, 658,
  // Gen 7
  722, 723, 724, 725, 726, 727, 728, 729, 730,
  // Gen 8
  810, 811, 812, 813, 814, 815, 816, 817, 818,
  // Gen 9
  906, 907, 908, 909, 910, 911, 912, 913, 914,
]);

export function computeDifficulty(pokemon) {
  const { id, isLegendary, isMythical } = pokemon;

  // 1. Curated overrides
  if (CURATED_OVERRIDES[id]) return CURATED_OVERRIDES[id];

  // 2. Starters are universally known
  if (STARTER_IDS.has(id)) return "easy";

  // 3. Legendaries and mythicals are famous
  if (isLegendary || isMythical) return "easy";

  // 4. Gen 1 Pokemon are generally well-known
  if (pokemon.generation === 1) return "easy";

  // 5. Gen 2-3 are fairly recognizable
  if (pokemon.generation <= 3) return "medium";

  // 6. Later gens default to medium, with some hard
  if (pokemon.generation >= 7) return "hard";

  // 7. Gen 4-6: medium
  return "medium";
}
