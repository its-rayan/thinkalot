export type Difficulty = "Easy" | "Medium" | "Hard";

export type Category =
  | "General Knowledge"
  | "Science"
  | "History"
  | "Geography"
  | "Sport"
  | "Entertainment";

export interface Question {
  id: string;
  question: string;
  answers: {
    A: string;
    B: string;
    C: string;
    D: string;
  };
  correctAnswer: "A" | "B" | "C" | "D";
  category: Category;
  difficulty: Difficulty;
  explanation: string;
}

export interface QuestionGuessPayload {
  questionId: string;
  /** Omitted when the player runs out of time without answering. */
  guess?: string;
}

export interface QuestionGuess {
  isCorrect: boolean;
  correctAnswer: string;
  explanation: string;
}

export const questionKeys = {
  all: ["questions"] as const,
  byDate: (date: string) => ["questions", date] as const,
};

/**
 * Loads a day's questions from the static files the build publishes at
 * /questions/YYYY-MM-DD.json (see vite-plugin-questions.ts). A day with no
 * file comes back empty, which the game shows as "No game today".
 */
export async function fetchQuestionsByDate(date: string): Promise<{
  status: number;
  data: Question[];
}> {
  const response = await fetch(
    `${import.meta.env.BASE_URL}questions/${date}.json`,
  );

  // Static hosts often answer unknown paths with index.html and a 200 (the
  // single-page-app fallback), so treat anything that isn't JSON as missing.
  const isJson = response.headers.get("content-type")?.includes("json");
  if (response.status === 404 || (response.ok && !isJson)) {
    return { status: 200, data: [] };
  }

  if (!response.ok) {
    throw new Error(`Failed to fetch questions: ${response.statusText}`);
  }

  return { status: 200, data: (await response.json()) as Question[] };
}

/** Checks a guess against the day's questions, which include the answers. */
export function checkGuess(
  questions: Question[],
  { questionId, guess }: QuestionGuessPayload,
): QuestionGuess {
  const question = questions.find((q) => q.id === questionId);

  return {
    isCorrect: guess !== undefined && question?.correctAnswer === guess,
    correctAnswer: question?.correctAnswer ?? "",
    explanation: question?.explanation ?? "",
  };
}
