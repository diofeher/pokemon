import { useReducer, useCallback, useMemo } from "react";
import type { Pokemon } from "../types/pokemon";
import type { DifficultyId } from "../types/difficulty";
import type { QuizModeId } from "../types/quiz";
import { quizReducer, initialQuizState } from "../quiz/quizReducer";
import { generateRound } from "../quiz/generateRound";

export function useQuiz(pokemon: Pokemon[], difficulty: DifficultyId) {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  const start = useCallback(
    (modeId: QuizModeId) => {
      const questions = generateRound(modeId, pokemon);
      dispatch({
        type: "SELECT_MODE",
        modeId,
        difficultyId: difficulty,
        questions,
      });
    },
    [pokemon, difficulty]
  );

  const answer = useCallback((optionId: string) => {
    dispatch({ type: "ANSWER", optionId });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "NEXT" });
  }, []);

  const restart = useCallback(() => {
    dispatch({ type: "RESTART" });
  }, []);

  const backToModes = useCallback(() => {
    dispatch({ type: "BACK_TO_MODES" });
  }, []);

  const currentQuestion = useMemo(
    () =>
      state.status === "in-progress"
        ? state.questions[state.currentIndex]
        : null,
    [state.status, state.questions, state.currentIndex]
  );

  return {
    ...state,
    currentQuestion,
    totalQuestions: state.questions.length,
    currentIndex: state.currentIndex,
    start,
    answer,
    next,
    restart,
    backToModes,
  };
}
