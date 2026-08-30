import { useEffect, useRef, useMemo, useCallback } from "react";
import { POKEMON } from "../../data/pokemon";
import { useQuiz } from "../../hooks/useQuiz";
import { useStatsContext } from "../../context/StatsContext";
import { useDifficultyContext } from "../../context/DifficultyContext";
import { useSpacedRepetitionContext } from "../../context/SpacedRepetitionContext";
import { qualityFromAnswer } from "../../spacedRepetition/sm2";
import { filterPokemonByDifficulty } from "../../quiz/pokemonFilters";
import { generateRound } from "../../quiz/generateRound";
import { generateReviewRound } from "../../quiz/generateReviewRound";
import type { QuizModeId } from "../../types/quiz";
import { ScreenBezel } from "../../components/layout/ScreenBezel";
import { ModeSelector } from "./components/ModeSelector";
import { ProgressBar } from "./components/ProgressBar";
import { QuestionCard } from "./components/QuestionCard";
import { ResultsSummary } from "./components/ResultsSummary";
import styles from "./QuizPage.module.css";

export function QuizPage() {
  const { difficulty } = useDifficultyContext();
  const pokemon = useMemo(
    () => filterPokemonByDifficulty(POKEMON, difficulty),
    [difficulty]
  );
  const quiz = useQuiz();
  const { recordResult } = useStatsContext();
  const sr = useSpacedRepetitionContext();
  const hasRecorded = useRef(false);

  // Start a practice round
  const startPractice = useCallback(
    (modeId: QuizModeId) => {
      const questions = generateRound(modeId, pokemon);
      quiz.start(modeId, difficulty, questions);
    },
    [pokemon, difficulty, quiz]
  );

  // Start a review round for due cards in a specific mode
  const startReview = useCallback(
    (modeId: QuizModeId) => {
      const dueCards = sr.getDueCards(modeId);
      if (dueCards.length === 0) return;
      const duePokemonIds = dueCards.map((c) => c.pokemonId);
      const questions = generateReviewRound(modeId, duePokemonIds, POKEMON);
      if (questions.length === 0) return;
      quiz.startReview(modeId, difficulty, questions);
    },
    [sr, difficulty, quiz]
  );

  // Handle answer: dispatch to quiz reducer + record SR data
  const handleAnswer = useCallback(
    (optionId: string, timeMs: number) => {
      const q = quiz.currentQuestion;
      if (!q) return;
      const correct = optionId === q.correctOptionId;
      quiz.answer(optionId);
      sr.recordReview(q.modeId, q.targetPokemonId, qualityFromAnswer(correct, timeMs));
    },
    [quiz, sr]
  );

  // Record stats only for practice rounds (not review)
  useEffect(() => {
    if (
      quiz.status === "finished" &&
      quiz.modeId &&
      quiz.difficultyId &&
      !quiz.isReviewMode &&
      !hasRecorded.current
    ) {
      hasRecorded.current = true;
      recordResult(
        quiz.modeId,
        quiz.difficultyId,
        quiz.score,
        quiz.totalQuestions
      );
    }
    if (quiz.status !== "finished") {
      hasRecorded.current = false;
    }
  }, [
    quiz.status,
    quiz.modeId,
    quiz.difficultyId,
    quiz.isReviewMode,
    quiz.score,
    quiz.totalQuestions,
    recordResult,
  ]);

  return (
    <ScreenBezel>
      {quiz.status === "mode-select" && (
        <ModeSelector
          onSelect={startPractice}
          onReview={startReview}
          dueCountsByMode={sr.dueCountsByMode}
          srStats={sr.srStats}
        />
      )}

      {quiz.status === "in-progress" && quiz.currentQuestion && (
        <div className={styles.quizArea}>
          <ProgressBar
            current={quiz.currentIndex}
            total={quiz.totalQuestions}
            score={quiz.score}
            onQuit={quiz.backToModes}
          />
          <QuestionCard
            question={quiz.currentQuestion}
            selectedOptionId={quiz.selectedOptionId}
            isAnswered={quiz.isAnswered}
            onAnswer={handleAnswer}
            onNext={quiz.next}
          />
        </div>
      )}

      {quiz.status === "finished" && quiz.modeId && quiz.difficultyId && (
        <ResultsSummary
          modeId={quiz.modeId}
          difficultyId={quiz.difficultyId}
          score={quiz.score}
          total={quiz.totalQuestions}
          isReviewMode={quiz.isReviewMode}
          onPlayAgain={
            quiz.isReviewMode
              ? () => startReview(quiz.modeId!)
              : () => startPractice(quiz.modeId!)
          }
          onChangeModes={quiz.backToModes}
        />
      )}
    </ScreenBezel>
  );
}
