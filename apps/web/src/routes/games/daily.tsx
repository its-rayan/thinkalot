import { createFileRoute } from "@tanstack/react-router";
import DailyGame from "@/features/daily-games/feature-root";

export const Route = createFileRoute("/games/daily")({
  component: RouteComponent,
});

function RouteComponent() {
  return <DailyGame />;
}
