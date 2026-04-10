import http from "http";
import app from "@/app";
import { attachWebSocketServer } from "@/ws/server";

const PORT = Number(process.env.PORT || 8000);
const HOST = process.env.HOST || "0.0.0.0";

const server = http.createServer(app);

// initial WebSocket server setup
const { broadcast } = attachWebSocketServer(server);
app.locals.broadcast = broadcast;

server
  .listen(PORT, HOST, () => {
    const baseUrl =
      HOST === "0.0.0.0"
        ? `http://localhost:${PORT}`
        : `http://${HOST}:${PORT}`;

    console.log(`Server is running on port ${baseUrl}`);
    console.log(
      `WebSocket server is available at ${baseUrl.replace("http", "ws")}/ws`,
    );
  })
  .on("error", (err) => {
    console.error("Failed to start server:", err);
  });
