import { useReducer, useCallback, useMemo } from "react";
import type { DifficultyId } from "../types/difficulty";
import type { QuizModeId, QuizQuestion } from "../types/quiz";
import { quizReducer, initialQuizState } from "../quiz/quizReducer";

export function useQuiz() {
  const [state, dispatch] = useReducer(quizReducer, initialQuizState);

  const start = useCallback(
    (
      modeId: QuizModeId,
      difficultyId: DifficultyId,
      questions: QuizQuestion[]
    ) => {
      dispatch({ type: "SELECT_MODE", modeId, difficultyId, questions });
    },
    []
  );

  const startReview = useCallback(
    (
      modeId: QuizModeId,
      difficultyId: DifficultyId,
      questions: QuizQuestion[]
    ) => {
      dispatch({ type: "START_REVIEW", modeId, difficultyId, questions });
    },
    []
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
    startReview,
    answer,
    next,
    restart,
    backToModes,
  };
}
