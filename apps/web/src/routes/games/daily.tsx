import { createFileRoute, redirect } from "@tanstack/react-router";
import DailyGame from "@/features/daily-games/feature-root";
import { hasFinishedGame } from "@/features/daily-games/store/use-game-progress";
import { useGameRoundStore } from "@/features/daily-games/store/use-game-round";

export const Route = createFileRoute("/games/daily")({
  beforeLoad: () => {
    const { date } = useGameRoundStore.getState();
    // The daily game can only be played once per date.
    if (hasFinishedGame(date)) {
      throw redirect({ to: "/results/$date", params: { date }, replace: true });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <DailyGame />;
}
