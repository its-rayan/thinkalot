import type { FastifyReply, FastifyRequest } from "fastify";
import type {
  QuestionGuessBodyType,
  QuestionParamsType,
} from "./interfaces.js";
import { readQuestionFile } from "./services.js";

function getMonthForDailyGame(date: string) {
  return date.substring(0, 7);
}

export async function getQuestions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date } = request.params as QuestionParamsType;

  // get the month of the date: YYYY-MM
  const month = getMonthForDailyGame(date);

  const monthlyQuestions = await readQuestionFile(month);

  const dailyQuestions = monthlyQuestions
    ?.filter((q) => q.date === date)
    .flatMap((data) => {
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

export async function checkUserGuess(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { date } = request.params as QuestionParamsType;

  const { questionId, guess } = request.body as QuestionGuessBodyType;

  // get the month of the date: YYYY-MM
  const month = getMonthForDailyGame(date);

  const monthlyQuestions = await readQuestionFile(month);

  const dailyQuestions = monthlyQuestions
    ?.filter((q) => q.date === date)
    .flatMap((data) => data.questions);

  // find the question the guess is for
  const question = dailyQuestions?.find((data) => data.id === questionId);
  const data = {
    isCorrect: question?.correctAnswer === guess,
    correctAnswer: question?.correctAnswer,
    explanation: question?.explanation,
  };

  reply.code(200).send({
    status: 200,
    data,
  });
}
