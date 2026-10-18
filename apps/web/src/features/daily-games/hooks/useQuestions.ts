import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsByDate, questionKeys } from "../api/questions";

export default function useQuestions(date: string) {
  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: questionKeys.all,
    queryFn: () => fetchQuestionsByDate(date),
  });

  const questionIndex = 1;

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
