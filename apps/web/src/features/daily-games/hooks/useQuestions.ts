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
    queryKey: questionKeys.byDate(date),
    queryFn: () => fetchQuestionsByDate(date),
  });

  console.log("result: ", result);
  console.log("date: ", date);
  console.log("questionIndex: ", questionIndex);

  const question = result?.data?.find(
    (q) => q.id === `${date}-q${questionIndex}`,
  );

  // The API returns no questions when the bank has none for this date.
  const hasNoGame = !isLoading && !isError && (result?.data?.length ?? 0) === 0;

  return {
    question,
    questionIndex,
    isLoading,
    isError,
    hasNoGame,
  };
}
