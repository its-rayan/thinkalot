import type { FastifyInstance } from "fastify";

import { checkUserGuess, getQuestions } from "./controller.js";
import {
  QuestionGuessBodySchema,
  type QuestionGuessBodyType,
  QuestionParamsSchema,
  type QuestionParamsType,
} from "./interfaces.js";

export default async function questionsRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: QuestionParamsType }>(
    "/questions/:date",
    { schema: { params: QuestionParamsSchema } },
    getQuestions,
  );

  fastify.post<{ Params: QuestionParamsType; Body: QuestionGuessBodyType }>(
    "/questions/:date/guess",
    { schema: { params: QuestionParamsSchema, body: QuestionGuessBodySchema } },
    checkUserGuess,
  );
}
