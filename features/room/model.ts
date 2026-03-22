export const DEFAULT_QUIZ_LENGTH = 10;

export interface Question {
  prompt: string;
  options: string[];
  answer: string;
  type: "text" | "image";
}
