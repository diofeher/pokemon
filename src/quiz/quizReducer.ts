import type { QuizState, QuizAction } from "../types/quiz";

export const initialQuizState: QuizState = {
  status: "mode-select",
  modeId: null,
  difficultyId: null,
  questions: [],
  currentIndex: 0,
  selectedOptionId: null,
  isAnswered: false,
  score: 0,
};

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_MODE":
      return {
        ...state,
        status: "in-progress",
        modeId: action.modeId,
        difficultyId: action.difficultyId,
        questions: action.questions,
        currentIndex: 0,
        selectedOptionId: null,
        isAnswered: false,
        score: 0,
      };

    case "ANSWER": {
      if (state.isAnswered) return state;
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = action.optionId === currentQ.correctOptionId;
      return {
        ...state,
        selectedOptionId: action.optionId,
        isAnswered: true,
        score: isCorrect ? state.score + 1 : state.score,
      };
    }

    case "NEXT": {
      const nextIndex = state.currentIndex + 1;
      if (nextIndex >= state.questions.length) {
        return { ...state, status: "finished" };
      }
      return {
        ...state,
        currentIndex: nextIndex,
        selectedOptionId: null,
        isAnswered: false,
      };
    }

    case "RESTART":
      return initialQuizState;

    case "BACK_TO_MODES":
      return initialQuizState;

    default:
      return state;
  }
}
