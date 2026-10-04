import { useMutation } from "@tanstack/react-query";
import { postQuestionGuess, type QuestionGuessPayload } from "../api/questions";

export default function useSubmitQuestionGuess(date: string) {
  return useMutation({
    mutationFn: (payload: QuestionGuessPayload) =>
      postQuestionGuess(date, payload),
  });
}
