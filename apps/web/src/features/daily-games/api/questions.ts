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
  guess: string;
}

const API_ENDPOINT = `http://localhost:3000/api/v1`;

export const questionKeys = {
  all: ["questions"] as const,
};

export async function fetchQuestionsByDate(date: string): Promise<Question[]> {
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
): Promise<void> {
  const response = await fetch(`${API_ENDPOINT}/questions/${date}/guess`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!response.ok) {
    throw new Error("Failed to submit guess.");
  }
}
