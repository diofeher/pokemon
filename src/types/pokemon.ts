import type { DifficultyId } from "./difficulty";

export type PokemonType =
  | "normal"
  | "fire"
  | "water"
  | "electric"
  | "grass"
  | "ice"
  | "fighting"
  | "poison"
  | "ground"
  | "flying"
  | "psychic"
  | "bug"
  | "rock"
  | "ghost"
  | "dragon"
  | "dark"
  | "steel"
  | "fairy";

export interface Pokemon {
  id: number;
  name: string;
  types: PokemonType[];
  generation: number;
  regionId: string;
  spriteUrl: string;
  isLegendary: boolean;
  isMythical: boolean;
  isStarter: boolean;
  popularity: DifficultyId;
}
