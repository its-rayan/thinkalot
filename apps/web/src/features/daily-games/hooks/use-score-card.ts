import type { GameProgress } from "./useGameProgress";

interface Args {
  dailyProgress: GameProgress | null;
}

export default function useScoreCard({ dailyProgress }: Args) {
  const progress = dailyProgress ? dailyProgress.result : [];

  const history = progress.map((h) => ({
    id: h.id,
    kind: h.isCorrect ? "correct" : "wrong",
    pickedIndex: 0,
    points: 188,
    buzzMs: 1200,
  }));

  return {
    history,
  };
}
