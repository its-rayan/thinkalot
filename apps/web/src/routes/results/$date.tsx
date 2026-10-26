import { createFileRoute } from "@tanstack/react-router";
import Results from "@/features/results/feature-root";

export const Route = createFileRoute("/results/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Results />;
}
