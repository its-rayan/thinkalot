import type { Question } from "./api/questions";

export interface GameProgressHistory extends Question {
  guess: string;
  isCorrect: boolean;
}
