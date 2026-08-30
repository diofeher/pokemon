import { useEffect, useRef } from "react";
import type { QuizQuestion } from "../../../types/quiz";
import { PokemonSprite } from "../../../components/ui/PokemonSprite";
import { playCorrect, playWrong } from "../../../lib/sounds";
import styles from "./QuestionCard.module.css";

interface QuestionCardProps {
  question: QuizQuestion;
  selectedOptionId: string | null;
  isAnswered: boolean;
  onAnswer: (optionId: string, timeMs: number) => void;
  onNext: () => void;
}

export function QuestionCard({
  question,
  selectedOptionId,
  isAnswered,
  onAnswer,
  onNext,
}: QuestionCardProps) {
  const isSilhouetteMode = question.modeId === "silhouette-to-name";
  const hasPlayedSound = useRef(false);
  const questionStartTime = useRef(Date.now());

  // Reset timer when question changes
  useEffect(() => {
    questionStartTime.current = Date.now();
  }, [question.id]);

  // Play sound on answer
  useEffect(() => {
    if (isAnswered && !hasPlayedSound.current) {
      hasPlayedSound.current = true;
      if (selectedOptionId === question.correctOptionId) {
        playCorrect();
      } else {
        playWrong();
      }
    }
    if (!isAnswered) {
      hasPlayedSound.current = false;
    }
  }, [isAnswered, selectedOptionId, question.correctOptionId]);

  const handleAnswer = (optionId: string) => {
    if (isAnswered) return;
    const timeMs = Date.now() - questionStartTime.current;
    onAnswer(optionId, timeMs);
  };

  return (
    <div className={styles.card}>
      <h3 className={styles.prompt}>{question.prompt}</h3>

      {question.promptImageUrl && (
        <div className={styles.promptImage}>
          <PokemonSprite
            src={question.promptImageUrl}
            alt="Pokémon"
            size="xl"
            silhouette={isSilhouetteMode && !isAnswered}
          />
        </div>
      )}

      <div className={styles.options}>
        {question.options.map((option) => {
          let optionClass = styles.option;
          if (isAnswered) {
            if (option.id === question.correctOptionId) {
              optionClass += ` ${styles.correct}`;
            } else if (option.id === selectedOptionId) {
              optionClass += ` ${styles.wrong}`;
            } else {
              optionClass += ` ${styles.dimmed}`;
            }
          }

          return (
            <button
              key={option.id}
              className={optionClass}
              onClick={() => handleAnswer(option.id)}
              disabled={isAnswered}
            >
              <span className={styles.optionLabel}>{option.label}</span>
            </button>
          );
        })}
      </div>

      {isAnswered && (
        <div className={styles.feedback}>
          <p className={styles.feedbackText}>
            {selectedOptionId === question.correctOptionId ? (
              <span className={styles.correctText}>
                ✅ Correct!
                {question.correctDetail && (
                  <> — {question.correctDetail}</>
                )}
              </span>
            ) : (
              <span className={styles.wrongText}>
                ❌ Wrong! The answer was{" "}
                <strong>
                  {question.options.find((o) => o.id === question.correctOptionId)?.label}
                </strong>
                {question.correctDetail && (
                  <> ({question.correctDetail})</>
                )}
              </span>
            )}
          </p>
          <button className={styles.nextButton} onClick={onNext}>
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
