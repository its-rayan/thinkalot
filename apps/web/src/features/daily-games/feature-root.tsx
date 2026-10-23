import { Button } from "@thinkalot/ui/components/button";
import useQuestions from "../daily-games/hooks/useQuestions";
import QuestionContainer from "./components/question-container";
import QuestionOptions from "./components/question-options";
import RevealAnswer from "./components/reveal-answer";
import RoundHeader from "./components/round-header";
import ScoreCard from "./components/score-card";
import useGameProgress from "./hooks/useGameProgress";
import useSubmitQuestionGuess from "./hooks/useSubmitQuestionGuess";

export default function DailyGame() {
  const date = "2026-10-03";
  const { questionIndex, roundLength, progressRound, isLastQuestion } =
    useGameProgress(date);
  const { question, isLoading, isError } = useQuestions(date, questionIndex);

  const { onGuess, revealAnswer } = useSubmitQuestionGuess(date);

  if (isLoading || !question) return <div>Loading...</div>;

  if (isError) return <div>Something went wrong :(</div>;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[760px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-5">
        <RoundHeader questionIndex={questionIndex} roundLength={roundLength} />
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <QuestionContainer prompt={question.question}>
            <QuestionOptions
              question={question}
              revealAnswer={revealAnswer}
              onGuess={onGuess}
            />

            {revealAnswer && (
              <RevealAnswer
                revealAnswer={revealAnswer}
                isLastQuestion={isLastQuestion}
                onClick={() =>
                  progressRound({ ...question, guess: revealAnswer.guess })
                }
              />
            )}
          </QuestionContainer>

          <ScoreCard />
        </div>
      </main>
    </div>
  );
}
