import type { QuizState, QuizAction } from "../types/quiz";

export const initialQuizState: QuizState = {
  status: "mode-select",
  modeId: null,
  difficultyId: null,
  questions: [],
  currentIndex: 0,
  selectedOptionId: null,
  isAnswered: false,
  isSkipped: false,
  isReviewMode: false,
  score: 0,
  skipped: 0,
};

function startRound(
  state: QuizState,
  action: { modeId: QuizState["modeId"]; difficultyId: QuizState["difficultyId"]; questions: QuizState["questions"] },
  isReviewMode: boolean,
): QuizState {
  return {
    ...state,
    status: "in-progress",
    modeId: action.modeId,
    difficultyId: action.difficultyId,
    questions: action.questions,
    currentIndex: 0,
    selectedOptionId: null,
    isAnswered: false,
    isSkipped: false,
    isReviewMode,
    score: 0,
    skipped: 0,
  };
}

export function quizReducer(state: QuizState, action: QuizAction): QuizState {
  switch (action.type) {
    case "SELECT_MODE":
      return startRound(state, action, false);

    case "START_REVIEW":
      return startRound(state, action, true);

    case "ANSWER": {
      if (state.isAnswered) return state;
      const currentQ = state.questions[state.currentIndex];
      const isCorrect = action.optionId === currentQ.correctOptionId;
      return {
        ...state,
        selectedOptionId: action.optionId,
        isAnswered: true,
        isSkipped: false,
        score: isCorrect ? state.score + 1 : state.score,
      };
    }

    case "SKIP": {
      if (state.isAnswered) return state;
      return {
        ...state,
        selectedOptionId: null,
        isAnswered: true,
        isSkipped: true,
        skipped: state.skipped + 1,
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
        isSkipped: false,
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
