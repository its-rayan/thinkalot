"use client";

import { generateQuestion } from "@/utils/functions/flags";
import { useState } from "react";
import Image from "next/image";

export default function Home() {
  const [question, setQuestion] = useState(generateQuestion());

  const onClick = (e) => {
    console.log(e);
    const clickedName = e.target.textContent;
    if (clickedName === question.correctAnswer.name) {
      alert("Correct!");
    } else {
      alert("Wrong!");
    }
  };

  return (
    <div>
      <h2>Guess the country&apos;s flag</h2>
      <div>
        <Image
          src={question.correctAnswer.flagUrl}
          alt="Flag"
          width={200}
          height={120}
        />
      </div>
      <div>
        <button onClick={onClick}>{question.correctAnswer.name}</button>
        {question.options.map((option) => (
          <button key={option.code} onClick={onClick}>
            {option.name}
          </button>
        ))}
      </div>
    </div>
  );
}
