import { WebSocket, WebSocketServer } from "ws";
import { type Server } from "http";

function sendJSON(socket: WebSocket, payload: any) {
  // check if the socket is still open before sending
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload));
}

function broadcastJSON(wss: WebSocketServer, payload: any) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) return;
    client.send(JSON.stringify(payload));
  }
}

export function attachWebSocketServer(server: Server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws",
    maxPayload: 1024 * 1024, // 1 MB
  });

  wss.on("connection", (socket) => {
    sendJSON(socket, {
      type: "welcome",
      message: "Welcome to the WebSocket server!",
    });

    socket.on("error", console.error);
  });

  function broadcast(payload: any) {
    broadcastJSON(wss, { type: "game_created", date: payload });
  }

  return { broadcast };
}
