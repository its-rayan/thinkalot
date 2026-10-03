import type { FastifyInstance } from "fastify";

import { getQuestions } from "./controller.js";
import { QuestionParamsSchema, type QuestionParamsType } from "./interfaces.js";

export default async function questionsRoutes(fastify: FastifyInstance) {
  fastify.get<{ Params: QuestionParamsType }>(
    "/questions/:date",
    { schema: { params: QuestionParamsSchema } },
    getQuestions,
  );

  // users guess for question
  //   fastify.put("/questions/:date/:questionId/guess", () => {});
}
