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

export interface DailyQuiz {
  date: string;
  questions: Question[];
}
