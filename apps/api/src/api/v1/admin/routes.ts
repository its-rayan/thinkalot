import type { FastifyInstance } from "fastify";
import createQuestions from "./create-questions/controller.js";

export default async function questionsRoutes(fastify: FastifyInstance) {
  fastify.get("/questions", createQuestions);
}
