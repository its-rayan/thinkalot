import { useState } from "react";
import { Question } from "../model";

const DEFAULT_QUIZ_LENGTH = 5;

interface UseQuizReturnType {
  currentQuestion: Question;
  score: number;
  isComplete: boolean;
  onAnswer: (answer: string) => void;
  onPlayAgain: () => void;
}

export default function useQuiz(
  createQuestions: (length: number) => Question[],
  length = DEFAULT_QUIZ_LENGTH,
): UseQuizReturnType {
  const [questions, setQuestions] = useState<Question[]>(() =>
    createQuestions(length),
  );
  const [questionPosition, setQuestionPosition] = useState(0);
  const [score, setScore] = useState(0);

  const isComplete = questionPosition === questions.length;

  const onAnswer = (answer: string) => {
    if (answer === questions[questionPosition].answer) {
      setScore((prev) => prev + 1);
    }
    setQuestionPosition((prev) => prev + 1);
  };

  const onPlayAgain = () => {
    setQuestions(createQuestions(length));
    setQuestionPosition(0);
    setScore(0);
  };

  return {
    currentQuestion: questions[questionPosition],
    score,
    isComplete,
    onAnswer,
    onPlayAgain,
  };
}
