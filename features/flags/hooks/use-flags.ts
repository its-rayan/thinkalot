import { COUNTRIES, COUNTRY_CODES } from "@/utils/constants/countries";
import { useState } from "react";
import { fetchFlagImage } from "../api/flagApi";
import { Question } from "../model";

interface UseFlagsReturnType {
  createQuestions: (length: number) => Question[];
}

export default function useFlags(): UseFlagsReturnType {
  const [existinIndices, setExistinIndices] = useState<number[]>([]);
  const getRandomNumber = () =>
    Math.floor(Math.random() * COUNTRY_CODES.length);

  const generateRandomIndex = (): number => {
    const randomIndex = getRandomNumber();
    const isExistingIndex = existinIndices.some(
      (existingIndex) => existingIndex === randomIndex,
    );
    if (isExistingIndex) return generateRandomIndex();

    // add new index to existingIndices
    setExistinIndices((existinIndices) => [...existinIndices, randomIndex]);
    return randomIndex;
  };

  const createQuestions = (length: number) => {
    const arrayWithLength = Array.from(
      { length: length },
      (_: undefined, index: number) => index,
    );
    return arrayWithLength.map(() => {
      const randomIndex = generateRandomIndex();
      const randomCountryCode = COUNTRY_CODES[randomIndex];
      const answer = COUNTRIES[randomCountryCode];
      const options = COUNTRY_CODES.filter((code) => code !== randomCountryCode)
        .sort(() => 0.5 - Math.random())
        .slice(0, 2)
        .map((code) => COUNTRIES[code]);

      return {
        flagImage: fetchFlagImage(randomCountryCode),
        options: [...options, answer],
        answer: COUNTRIES[randomCountryCode],
      };
    });
  };

  return {
    createQuestions,
  };
}
