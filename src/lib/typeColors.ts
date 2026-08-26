import type { PokemonType } from "../types/pokemon";

interface TypeStyle {
  bg: string;
  text: "#1c1c1e" | "#ffffff";
}

export const TYPE_COLORS: Record<PokemonType, TypeStyle> = {
  normal: { bg: "#A8A878", text: "#1c1c1e" },
  fire: { bg: "#F08030", text: "#ffffff" },
  water: { bg: "#6890F0", text: "#ffffff" },
  electric: { bg: "#F8D030", text: "#1c1c1e" },
  grass: { bg: "#78C850", text: "#ffffff" },
  ice: { bg: "#98D8D8", text: "#1c1c1e" },
  fighting: { bg: "#C03028", text: "#ffffff" },
  poison: { bg: "#A040A0", text: "#ffffff" },
  ground: { bg: "#E0C068", text: "#1c1c1e" },
  flying: { bg: "#A890F0", text: "#ffffff" },
  psychic: { bg: "#F85888", text: "#ffffff" },
  bug: { bg: "#A8B820", text: "#1c1c1e" },
  rock: { bg: "#B8A038", text: "#1c1c1e" },
  ghost: { bg: "#705898", text: "#ffffff" },
  dragon: { bg: "#7038F8", text: "#ffffff" },
  dark: { bg: "#705848", text: "#ffffff" },
  steel: { bg: "#B8B8D0", text: "#1c1c1e" },
  fairy: { bg: "#EE99AC", text: "#1c1c1e" },
};
