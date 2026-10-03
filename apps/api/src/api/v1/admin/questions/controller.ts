import type { FastifyReply, FastifyRequest } from "fastify";
import { generateQuestions, writeQuestionsFile } from "./services.js";

export default async function createQuestions(
  request: FastifyRequest,
  reply: FastifyReply,
) {
  const { month } = request.params as {
    month: string;
  };

  const data = await generateQuestions();

  await writeQuestionsFile(month, data);

  reply.code(200).send({
    status: 200,
    message: `successfully created questions for ${month}`,
  });
}
