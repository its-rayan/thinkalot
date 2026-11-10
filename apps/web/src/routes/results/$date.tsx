import { createFileRoute, redirect } from "@tanstack/react-router";
import { hasFinishedGame } from "@/features/daily-games/store/use-game-progress";
import Results from "@/features/results/feature-root";

export const Route = createFileRoute("/results/$date")({
  beforeLoad: ({ params }) => {
    // Results are only available once the game for that date is finished.
    if (!hasFinishedGame(params.date)) {
      throw redirect({ to: "/", replace: true });
    }
  },
  component: RouteComponent,
});

function RouteComponent() {
  return <Results />;
}
