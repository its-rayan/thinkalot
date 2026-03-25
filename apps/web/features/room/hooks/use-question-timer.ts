import { useState } from "react";

const QUESTION_TIME_LIMIT = 30; // Time limit for each question in seconds

interface QuestionTimerReturn {
  timer: number;
  startTimer: () => void;
}

export default function useQuestionTimer(): QuestionTimerReturn {
  const [timer, setTimer] = useState(QUESTION_TIME_LIMIT);

  const startTimer = () => {
    let secondsRemaining = QUESTION_TIME_LIMIT;

    const intervalId = setInterval(() => {
      secondsRemaining -= 1;
      setTimer(secondsRemaining);

      if (secondsRemaining <= 0) {
        clearInterval(intervalId);
        setTimer(QUESTION_TIME_LIMIT); // Reset timer after time is up
      }
    }, 1000); // Update every second
  };

  return {
    timer,
    startTimer,
  };
}
