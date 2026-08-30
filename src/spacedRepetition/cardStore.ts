/** localStorage persistence for SR cards via lib/storage.ts */

import type { CardState } from "./sm2";
import { getItem, setItem } from "../lib/storage";

export type CardMap = Record<string, CardState>;

const SR_KEY = "spaced-repetition";

export function loadCards(): CardMap {
  return getItem<CardMap>(SR_KEY, {});
}

export function persistCards(cards: CardMap): void {
  setItem(SR_KEY, cards);
}
