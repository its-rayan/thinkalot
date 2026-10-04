import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsByDate, questionKeys } from "../api/questions";

export default function useQuestions(date: string) {
  return useQuery({
    queryKey: questionKeys.all,
    queryFn: () => fetchQuestionsByDate(date),
    initialData: [],
  });
}
