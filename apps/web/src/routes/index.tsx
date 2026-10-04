import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@thinkalot/ui/components/button";

export const Route = createFileRoute("/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <section className="max-w-80 h-screen m-auto flex items-center justify-center">
      <div className="flex flex-col items-center space-y-6">
        <div className="text-center space-y-2">
          <p className="text-lg text-muted antialiased">
            Daily trivia game.{" "}
            {import.meta.env.VITE_APP_MVP_VERSION !== "v1" && (
              <>
                Beat the Buzzer.
                <br />
              </>
            )}
            10 questions.
          </p>
        </div>
        <Link to="/games/daily">
          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-500 hover:opacity-90 border-3 border-black uppercase font-bold"
          >
            Play today's game
          </Button>
        </Link>
      </div>
    </section>
  );
}
