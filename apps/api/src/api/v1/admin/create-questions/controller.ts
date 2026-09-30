import type { FastifyReply, FastifyRequest } from "fastify";

// import questions from "../../../../db/question-bank.json" with { type: "json" };

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
    });
  }

  reply.code(200).send({ status: 200, data: daysList });
}
