import type { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import Fastify from "fastify";
import adminRoutes from "./api/v1/admin/routes.js";
import questionsRoutes from "./api/v1/questions/routes.js";

const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({
  logger: true,
}).withTypeProvider<TypeBoxTypeProvider>();

fastify.get("/api/v1/", async (_request, _reply) => {
  return { hello: "world" };
});

fastify.register(adminRoutes, { prefix: "/api/v1/admin" });
fastify.register(questionsRoutes, { prefix: "/api/v1" });

const start = async () => {
  try {
    await fastify.listen({
      // Render requires binding to 0.0.0.0 for API deployment
      host: "0.0.0.0",
      port: PORT,
    });
    fastify.log.info(`server listening on ${PORT}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
