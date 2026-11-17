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

/**
 * Base URL of the API, e.g. https://api.thinkalot.example. Set VITE_API_URL
 * in apps/web/.env locally and in your host's environment for deploys
 * (production builds fail without it; see vite.config.ts). Falls back to the
 * local API in development.
 */
const API_URL = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:3000" : "")
).replace(/\/+$/, "");

const API_ENDPOINT = `${API_URL}/api/v1`;

export const questionKeys = {
  all: ["questions"] as const,
  byDate: (date: string) => ["questions", date] as const,
};

export async function fetchQuestionsByDate(date: string): Promise<{
  status: number;
  data: Question[];
}> {
  const response = await fetch(`${API_ENDPOINT}/questions/${date}`);
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to fetch questions: ${errorBody || response.statusText}`,
    );
  }
  return response.json();
}

export async function postQuestionGuess(
  date: string,
  payload: QuestionGuessPayload,
): Promise<{
  status: number;
  data: QuestionGuess;
}> {
  const response = await fetch(`${API_ENDPOINT}/questions/${date}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to submit guess.");
  }

  return response.json();
}
