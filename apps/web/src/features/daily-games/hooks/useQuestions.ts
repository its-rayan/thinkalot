import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsByDate, questionKeys } from "../api/questions";

export default function useQuestions(date: string, questionIndex: number) {
  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: questionKeys.all,
    queryFn: () => fetchQuestionsByDate(date),
  });

  const question = result?.data?.find(
    (q) => q.id === `${date}-q${questionIndex}`,
  );

  return {
    question,
    questionIndex,
    isLoading,
    isError,
  };
}
