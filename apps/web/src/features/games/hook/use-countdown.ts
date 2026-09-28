import { useEffect, useState } from "react";

export default function useCountDown({
  gameStatus,
  onCountDownDone,
}: {
  gameStatus: string;
  onCountDownDone: (status: string) => void;
}) {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (gameStatus !== "countdown") return;
    if (countdown === 0) {
      onCountDownDone("STARTED");
      return;
    }

    const timer = window.setTimeout(
      () => setCountdown((prev) => prev - 1),
      750,
    );

    return () => clearTimeout(timer);
  }, [gameStatus, countdown, onCountDownDone]);

  return {
    countdown,
  };
}
