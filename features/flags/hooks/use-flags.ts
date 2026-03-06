import { COUNTRIES, COUNTRY_CODES } from "@/utils/constants/countries";
import { useState } from "react";
import { fetchFlagImage } from "../api/flagApi";
import { Question } from "../model";

const DEFAULT_QUIZ_LENGTH = 5;

interface UseFlagsReturnType {
  currentQuestion: Question;
  score: number;
  isComplete: boolean;
  onAnswer: (answer: string) => void;
}

function createQuestions(length: number): Question[] {
  const usedIndices: number[] = [];

  const getUniqueRandomIndex = (): number => {
    const index = Math.floor(Math.random() * COUNTRY_CODES.length);
    if (usedIndices.includes(index)) return getUniqueRandomIndex();
    usedIndices.push(index);
    return index;
  };

  return Array.from({ length }, () => {
    const randomIndex = getUniqueRandomIndex();
    const randomCountryCode = COUNTRY_CODES[randomIndex];
    const answer = COUNTRIES[randomCountryCode];
    const options = COUNTRY_CODES.filter((code) => code !== randomCountryCode)
      .sort(() => 0.5 - Math.random())
      .slice(0, 2)
      .map((code) => COUNTRIES[code]);

    return {
      flagImage: fetchFlagImage(randomCountryCode),
      options: [...options, answer].sort(() => 0.5 - Math.random()),
      answer,
    };
  });
}

export default function useFlags(): UseFlagsReturnType {
  const [questions] = useState<Question[]>(() =>
    createQuestions(DEFAULT_QUIZ_LENGTH),
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

  return {
    currentQuestion: questions[questionPosition],
    score,
    isComplete,
    onAnswer,
  };
}
