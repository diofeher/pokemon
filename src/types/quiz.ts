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
  generateQuestion: (
    pokemon: import("./pokemon").Pokemon[],
    usedIds: Set<number>
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
  score: number;
}

export type QuizAction =
  | {
      type: "SELECT_MODE";
      modeId: QuizModeId;
      difficultyId: DifficultyId;
      questions: QuizQuestion[];
    }
  | { type: "ANSWER"; optionId: string }
  | { type: "NEXT" }
  | { type: "RESTART" }
  | { type: "BACK_TO_MODES" };
