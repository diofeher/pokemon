import type { DifficultyId } from "./difficulty";

export type QuizModeId =
  | "silhouette-to-name"
  | "name-to-type"
  | "pokemon-to-region";

export interface QuizOption {
  id: string;
  label: string;
  imageUrl?: string;
}

export interface QuizQuestion {
  id: string;
  modeId: QuizModeId;
  targetPokemonId: number;
  prompt: string;
  promptImageUrl?: string;
  options: QuizOption[];
  correctOptionId: string;
  /** Extra detail shown after answering */
  correctDetail?: string;
}

export interface QuizModeDefinition {
  id: QuizModeId;
  label: string;
  emoji: string;
  description: string;
  /** Generate a question for a random unused Pokémon from the pool */
  generateQuestion: (
    pokemon: import("./pokemon").Pokemon[],
    usedIds: Set<number>
  ) => QuizQuestion;
  /** Generate a question for a specific target Pokémon (used by review mode) */
  generateQuestionForPokemon: (
    target: import("./pokemon").Pokemon,
    pool: import("./pokemon").Pokemon[]
  ) => QuizQuestion;
}

export type QuizStatus = "idle" | "mode-select" | "in-progress" | "finished";

export interface QuizState {
  status: QuizStatus;
  modeId: QuizModeId | null;
  difficultyId: DifficultyId | null;
  questions: QuizQuestion[];
  currentIndex: number;
  selectedOptionId: string | null;
  isAnswered: boolean;
  isSkipped: boolean;
  isReviewMode: boolean;
  score: number;
  skipped: number;
}

export type QuizAction =
  | {
      type: "SELECT_MODE";
      modeId: QuizModeId;
      difficultyId: DifficultyId;
      questions: QuizQuestion[];
    }
  | {
      type: "START_REVIEW";
      modeId: QuizModeId;
      difficultyId: DifficultyId;
      questions: QuizQuestion[];
    }
  | { type: "ANSWER"; optionId: string }
  | { type: "SKIP" }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "BACK_TO_MODES" };
