import { createFileRoute, redirect } from "@tanstack/react-router";
import DailyGame from "@/features/daily-games/feature-root";
import {
  hasFinishedGame,
  useGameProgressStore,
} from "@/features/daily-games/store/use-game-progress";
import { useGameRoundStore } from "@/features/daily-games/store/use-game-round";

export const Route = createFileRoute("/games/daily")({
  beforeLoad: () => {
    // If the day has rolled over since the app loaded, switch to today's game
    // and load its progress (none, for a new day).
    if (useGameRoundStore.getState().syncToToday()) {
      useGameProgressStore.getState().initialise();
    }

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
