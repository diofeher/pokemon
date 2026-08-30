import { useState, useCallback, useMemo } from "react";
import type { QuizModeId } from "../types/quiz";
import { getNewCardState, calculateNextReview } from "../spacedRepetition/sm2";
import { buildCardId } from "../spacedRepetition/cardId";
import { loadCards, persistCards, type CardMap } from "../spacedRepetition/cardStore";
import { getDueCardsForMode, getDueCountsByMode, type DueCard } from "../spacedRepetition/dueCards";

export function useSpacedRepetition() {
  const [cards, setCards] = useState<CardMap>(loadCards);

  const recordReview = useCallback(
    (modeId: QuizModeId, pokemonId: number, quality: number) => {
      setCards((prev) => {
        const cardId = buildCardId(modeId, pokemonId);
        const existing = prev[cardId] ?? getNewCardState(cardId);
        const updated = calculateNextReview(existing, quality);
        const next = { ...prev, [cardId]: updated };
        persistCards(next);
        return next;
      });
    },
    [],
  );

  const getDueCards = useCallback(
    (modeId: QuizModeId): DueCard[] => {
      return getDueCardsForMode(cards, modeId);
    },
    [cards],
  );

  const dueCountsByMode = useMemo(
    () => getDueCountsByMode(cards),
    [cards],
  );

  const resetCards = useCallback(() => {
    persistCards({});
    setCards({});
  }, []);

  return { cards, recordReview, getDueCards, dueCountsByMode, resetCards };
}
