/**
 * Maps generation number to region ID.
 */
const GEN_TO_REGION = {
  1: "kanto",
  2: "johto",
  3: "hoenn",
  4: "sinnoh",
  5: "unova",
  6: "kalos",
  7: "alola",
  8: "galar",
  9: "paldea",
};

export function resolveRegion(generation) {
  return GEN_TO_REGION[generation] ?? "unknown";
}
