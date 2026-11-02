import { useQuery } from "@tanstack/react-query";
import { fetchQuestionsByDate, questionKeys } from "../api/questions";
import { useGameRoundStore } from "../store/use-game-round";

export default function useQuestions(questionIndex: number) {
  const { date } = useGameRoundStore();
  const {
    data: result,
    isLoading,
    isError,
  } = useQuery({
    queryKey: questionKeys.all,
    queryFn: () => fetchQuestionsByDate(date),
  });

  console.log("result: ", result);
  console.log("date: ", date);
  console.log("questionIndex: ", questionIndex);

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
