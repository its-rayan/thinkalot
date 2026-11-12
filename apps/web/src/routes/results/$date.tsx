import { createFileRoute } from "@tanstack/react-router";
import Results from "@/features/results/feature-root";

// When there's no finished game for the date, the page shows a message
// rather than redirecting.
export const Route = createFileRoute("/results/$date")({
  component: RouteComponent,
});

function RouteComponent() {
  return <Results />;
}
