import Fastify from "fastify";
import adminRoutes from "./api/v1/admin/routes.js";

const PORT = Number(process.env.PORT) || 3000;

const fastify = Fastify({
  logger: true,
});

fastify.get("/api/v1/", async (_request, _reply) => {
  return { hello: "world" };
});

fastify.register(adminRoutes, { prefix: "/api/v1/admin" });

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
