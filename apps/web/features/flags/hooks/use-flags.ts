import { COUNTRIES, COUNTRY_CODES } from "@/utils/constants/countries";
import { fetchFlagImage } from "../api/flagApi";
import { Question } from "@/features/quiz/model";
import useQuiz from "@/features/quiz/hooks/use-quiz";

function createFlagQuestions(length: number): Question[] {
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
      prompt: fetchFlagImage(randomCountryCode),
      options: [...options, answer].sort(() => 0.5 - Math.random()),
      answer,
    };
  });
}

export default function useFlags() {
  return useQuiz(createFlagQuestions);
}
