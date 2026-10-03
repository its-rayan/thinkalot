import type { FastifyReply, FastifyRequest } from "fastify";
import type { QuestionParamsType } from "./interfaces.js";
import { readQuestionFile } from "./services.js";

export async function getQuestions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date } = request.params as QuestionParamsType;

  // get questions for the month of the date: YYYY-MM
  const month = date.substring(0, 7);

  const monthlyQuestions = await readQuestionFile(month);

  const dailyQuestions = monthlyQuestions
    ?.filter((q) => q.date === date)
    .map((data) => {
      // remove explanation and correctAnswer from questions
      const amendedQuestions = data.questions.map((question) => {
        const { correctAnswer, explanation, ...updatedQuestion } = question;
        return updatedQuestion;
      });

      return amendedQuestions;
    });

  reply.code(200).send({
    status: 200,
    data: dailyQuestions,
  });
}
