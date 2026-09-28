import { Button } from "@thinkalot/ui/components/button";
import { useState } from "react";
import GameCountdown from "./components/game-countdown";
import useCountDown from "./hook/use-countdown";

export default function Game() {
  const [gameStatus, setGameStatus] = useState("countdown");
  const { countdown } = useCountDown({
    gameStatus,
    onCountDownDone: (status) => setGameStatus(status),
  });

  const question = "How many bones are there in the adult human body?";
  const answers = ["answer 1", "answer 2", "answer 3", "answer 4"];

  if (gameStatus === "countdown")
    return <GameCountdown countdown={countdown} />;

  return (
    <section className="max-w-xl h-screen m-auto flex pt-40 justify-center">
      <div className="flex flex-col bg-white items-center space-y-6  rounded-xl p-6 w-full h-125">
        <h1 className="text-black text-3xl font-bold leading-tight">
          {question}
        </h1>

        <div className="flex flex-col w-full items-center space-y-4">
          {answers.map((answer) => (
            <Button
              variant="secondary"
              key={answer}
              size="lg"
              className="border-3 border-black uppercase font-bold w-full p-6"
            >
              {answer}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
