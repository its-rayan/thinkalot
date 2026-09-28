import { createFileRoute } from "@tanstack/react-router";
import Game from "@/features/games/feature-root";

export const Route = createFileRoute("/games/$gameId")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Game />;
}
