import { COUNTRIES, COUNTRY_CODES } from "@/utils/constants/countries";

export const generateFlagUrl = (countryCode: string): string => {
  return `https://flagcdn.com/${countryCode.toLowerCase()}.svg`;
};

export const generateQuestion = () => {
  const randomIndex = Math.floor(Math.random() * COUNTRY_CODES.length);
  const randomCountryCode = COUNTRY_CODES[randomIndex];

  const correctAnswer = {
    code: randomCountryCode,
    name: COUNTRIES[randomCountryCode],
    status: "correct",
    flagUrl: generateFlagUrl(randomCountryCode),
  };

  const wrongAnswers = COUNTRY_CODES.filter(
    (code) => code !== randomCountryCode,
  )
    .sort(() => 0.5 - Math.random())
    .slice(0, 2)
    .map((code) => ({
      code,
      name: COUNTRIES[code],
      status: "wrong",
    }));

  return {
    options: [...wrongAnswers],
    correctAnswer,
  };
};
