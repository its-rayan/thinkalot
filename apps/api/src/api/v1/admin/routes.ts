import type { FastifyInstance } from "fastify";
import createQuestions from "./questions/controller.js";

export default async function questionsRoutes(fastify: FastifyInstance) {
  fastify.get("/questions/:month", createQuestions);
}
