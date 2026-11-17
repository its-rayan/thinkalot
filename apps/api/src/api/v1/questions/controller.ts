import type { FastifyReply, FastifyRequest } from "fastify";
import { isPlayableDate } from "../../../utils/dates.js";
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

  // Future games aren't available yet. Respond as if there's no game, which
  // the web app shows as "No game today" (e.g. if a player's clock is wrong).
  if (!isPlayableDate(date)) {
    return reply.code(200).send({ status: 200, data: [] });
  }

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

  // Don't reveal answers to games that haven't started anywhere yet.
  if (!isPlayableDate(date)) {
    return reply.code(403).send({
      status: 403,
      message: "This game hasn't started yet.",
    });
  }

  // get the month of the date: YYYY-MM
  const month = getMonthForDailyGame(date);

  const monthlyQuestions = await readQuestionFile(month);

  const dailyQuestions = monthlyQuestions
    ?.filter((q) => q.date === date)
    .flatMap((data) => data.questions);

  // find the question the guess is for
  const question = dailyQuestions?.find((data) => data.id === questionId);
  const data = {
    isCorrect: guess !== undefined && question?.correctAnswer === guess,
    correctAnswer: question?.correctAnswer,
    explanation: question?.explanation,
  };

  reply.code(200).send({
    status: 200,
    data,
  });
}
