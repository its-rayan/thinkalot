import { WebSocketServer, WebSocket } from "ws";

/**
 * FYI: Websocket state
 * 0: CONNECTING
 * 1: OPEN
 * 2: CLOSING
 * 3: CLOSED
 */

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", (socket, request) => {
  console.log("Client connected");

  const clientIp = request.socket.remoteAddress;

  socket.on("message", (rawMessage) => {
    const message = rawMessage.toString();
    console.log(`Received message from ${clientIp}: ${message}`);

    wss.clients.forEach((client) => {
      if (client !== socket && client.readyState === WebSocket.OPEN) {
        client.send(`Broadcast from ${clientIp}: ${message}`);
      }
    });
  });

  socket.on("close", () => {
    console.log(`Client disconnected: ${clientIp}`);
  });
});

console.log("WebSocket server is running on ws://localhost:8080");
