import type { FastifyReply, FastifyRequest } from "fastify";

import questionBank from "../../../../db/question-bank.json" with {
  type: "json",
};

interface QuestionObject {
  id: string;
  question: string;
  answers: { A: string; B: string; C: string; D: string };
  correctAnswer: string;
  category: string;
  difficulty: string;
  explanation: string;
}

// Helper function to pick N random question objects without duplication
function getRandomQuestions(bank: QuestionObject[], count: number = 10) {
  const shuffled = [...bank].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, Math.min(count, bank.length));
}

export default async function createQuestions(
  _request: FastifyRequest,
  reply: FastifyReply,
) {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth(); // 0-indexed (0 = January, 11 = December)

  // Find the last day of the current month
  const lastDayOfMonth = new Date(year, month + 1, 0).getDate();
  const startDay = today.getDate();

  const daysList = [];

  for (let day = startDay; day <= lastDayOfMonth; day++) {
    const currentDate = new Date(year, month, day);

    // Format local date safely as YYYY-MM-DD without UTC shift
    const fYear = currentDate.getFullYear();
    const fMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const fDay = String(currentDate.getDate()).padStart(2, "0");
    const dateString = `${fYear}-${fMonth}-${fDay}`;

    daysList.push({
      date: dateString,
      dayOfWeek: currentDate.toLocaleDateString("en-US", { weekday: "long" }),
      dayNumber: day,
      questions: getRandomQuestions(questionBank.questions, 10), // Pick 10 random questions per day
    });
  }

  reply.code(200).send({ status: 200, data: daysList });
}
