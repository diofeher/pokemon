import type { Region } from "../types/region";

export const REGIONS: Region[] = [
  { id: "kanto", name: "Kanto", generation: 1 },
  { id: "johto", name: "Johto", generation: 2 },
  { id: "hoenn", name: "Hoenn", generation: 3 },
  { id: "sinnoh", name: "Sinnoh", generation: 4 },
  { id: "unova", name: "Unova", generation: 5 },
  { id: "kalos", name: "Kalos", generation: 6 },
  { id: "alola", name: "Alola", generation: 7 },
  { id: "galar", name: "Galar", generation: 8 },
  { id: "paldea", name: "Paldea", generation: 9 },
];

export function getRegionName(id: string): string {
  return REGIONS.find((r) => r.id === id)?.name ?? id;
}

export function getRegionByGeneration(gen: number): Region | undefined {
  return REGIONS.find((r) => r.generation === gen);
}
