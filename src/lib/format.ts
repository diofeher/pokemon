import type { PokemonType } from "../types/pokemon";

/**
 * Capitalize a string (first letter uppercase).
 */
export function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a Pokemon's type(s) as a display label.
 * e.g. ["fire", "flying"] → "Fire / Flying"
 */
export function formatTypeLabel(types: PokemonType[]): string {
  return types.map(capitalize).join(" / ");
}
