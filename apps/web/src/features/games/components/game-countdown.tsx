interface GameCountdownProps {
  countdown: number;
}

export default function GameCountdown({ countdown }: GameCountdownProps) {
  return (
    <section className="max-w-80 h-screen m-auto pt-40 flex justify-center">
      <div className="flex flex-col items-center space-y-2">
        <h1 className="text-pink-500 font-semiBold">Get Ready</h1>
        <p className="text-4xl font-bold">{countdown > 0 ? countdown : "GO"}</p>
      </div>
    </section>
  );
}
