import { Navigate, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import useQuestions from "../daily-games/hooks/useQuestions";
import GuessError from "./components/guess-error";
import NoGameToday from "./components/no-game-today";
import QuestionContainer from "./components/question-container";
import QuestionOptions from "./components/question-options";
import QuestionTimer from "./components/question-timer";
import QuitGameDialog from "./components/quit-game-dialog";
import RevealAnswer from "./components/reveal-answer";
import RoundHeader from "./components/round-header";
import ScoreCard from "./components/score-card";
import useGameProgress from "./hooks/useGameProgress";
import useSubmitQuestionGuess, {
  TIMED_OUT_GUESS,
} from "./hooks/useSubmitQuestionGuess";
import { useGameProgressStore } from "./store/use-game-progress";
import { useGameRoundStore } from "./store/use-game-round";

/** Time allowed to answer each question. */
const QUESTION_DURATION_MS = 10_000;

export default function DailyGame() {
  const { questionIndex, progressRound } = useGameProgress();
  const {
    updateProgress: _,
    resetProgress,
    ...dailyProgress
  } = useGameProgressStore();
  const navigate = useNavigate();
  const [isQuitDialogOpen, setIsQuitDialogOpen] = useState(false);
  const { roundLength, gamePhase, setGamePhase } = useGameRoundStore();
  const { question, isLoading, isError, hasNoGame } =
    useQuestions(questionIndex);

  const { onGuess, revealAnswer, isGuessError, retryGuess } =
    useSubmitQuestionGuess();

  if (dailyProgress.isGameFinished) {
    return (
      <Navigate to="/results/$date" params={{ date: dailyProgress.date }} />
    );
  }

  // Check errors before the missing-question case, otherwise a failed request
  // would show "Loading..." forever.
  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Something went wrong :(</div>;

  if (hasNoGame) return <NoGameToday />;

  if (!question) return <div>Loading...</div>;

  const quitGame = () => {
    resetProgress();
    setGamePhase("answering");
    navigate({ to: "/" });
  };

  const submitGuess = (questionId: string, guess: string) => {
    // Read the phase straight from the store so a click and the timer
    // expiring in the same tick can't both submit.
    if (useGameRoundStore.getState().gamePhase !== "answering") return;
    setGamePhase("reveal");
    onGuess(questionId, guess);
  };

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden="true"
        className="bg-rays pointer-events-none absolute inset-x-0 -top-40 h-[760px]"
      />

      <main className="relative mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-8 px-5 py-5">
        <RoundHeader
          questionIndex={questionIndex}
          roundLength={roundLength}
          onQuit={() => setIsQuitDialogOpen(true)}
        />
        <div className="grid flex-1 items-start gap-8 lg:grid-cols-[minmax(0,1fr)_280px]">
          <QuestionContainer
            prompt={question.question}
            timer={
              <QuestionTimer
                key={question.id}
                duration={QUESTION_DURATION_MS}
                // Paused while the quit confirmation is open.
                isRunning={gamePhase === "answering" && !isQuitDialogOpen}
                onExpire={() => submitGuess(question.id, TIMED_OUT_GUESS)}
              />
            }
          >
            <QuestionOptions
              question={question}
              interactive={gamePhase === "answering"}
              gamePhase={gamePhase}
              revealAnswer={revealAnswer}
              onGuess={submitGuess}
            />

            {gamePhase === "reveal" && isGuessError && (
              <GuessError onRetry={retryGuess} />
            )}

            {gamePhase === "reveal" && revealAnswer && (
              <RevealAnswer
                revealAnswer={revealAnswer}
                isLastQuestion={dailyProgress.isLastQuestion}
                date={dailyProgress.date}
                onClick={() => {
                  progressRound({
                    ...question,
                    guess: revealAnswer.guess,
                    isCorrect: revealAnswer.isCorrect,
                  });
                  setGamePhase("answering");
                }}
              />
            )}
          </QuestionContainer>

          <ScoreCard
            dailyProgress={dailyProgress}
            gameLength={dailyProgress.roundLength}
            questionIndex={questionIndex}
          />
        </div>
      </main>

      <QuitGameDialog
        open={isQuitDialogOpen}
        onCancel={() => setIsQuitDialogOpen(false)}
        onConfirm={quitGame}
      />
    </div>
  );
}
