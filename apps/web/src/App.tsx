import { Button } from "@thinkalot/ui/components/button";

function App() {
  return (
    <main className="bg-indigo-700 h-screen w-full">
      <section className="max-w-80 h-screen m-auto flex items-center justify-center">
        <div className="flex flex-col space-y-6">
          <div className="text-center space-y-2">
            <p className="text-lg text-muted antialiased">
              Daily trivia game. Beat the Buzzer. <br />
              10 questions.
            </p>
          </div>

          <Button
            size="lg"
            className="bg-pink-500 hover:bg-pink-500 hover:opacity-90 border-3 border-black uppercase font-bold"
          >
            Play today's game
          </Button>
        </div>
      </section>
    </main>
  );
}

export default App;
