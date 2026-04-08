import "dotenv/config";
import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";

// y-websocket utility for setting up shared document connections
// eslint-disable-next-line @typescript-eslint/no-require-imports
const { setupWSConnection } = require("y-websocket/bin/utils");

const PORT = parseInt(process.env.YJS_PORT || "1234", 10);

const wss = new WebSocketServer({ port: PORT });

wss.on("connection", (ws: WebSocket, req: IncomingMessage) => {
  // Extract the document name from the URL path (e.g., /prescription-123)
  const docName = req.url?.slice(1) || "default";

  console.log(
    `[yjs] Client connected — doc: "${docName}" | clients: ${wss.clients.size}`
  );

  // Delegate to y-websocket's built-in connection handler
  setupWSConnection(ws, req, { docName });

  ws.on("close", () => {
    console.log(
      `[yjs] Client disconnected — doc: "${docName}" | clients: ${wss.clients.size}`
    );
  });
});

console.log(`[yjs] WebSocket server listening on ws://localhost:${PORT}`);

// Graceful shutdown
function shutdown(signal: string) {
  console.log(`\n[yjs] Received ${signal}, shutting down gracefully...`);

  wss.clients.forEach((client) => {
    client.close();
  });

  wss.close(() => {
    console.log("[yjs] Server closed.");
    process.exit(0);
  });

  // Force exit after 5 seconds if graceful shutdown stalls
  setTimeout(() => {
    console.error("[yjs] Forced shutdown after timeout.");
    process.exit(1);
  }, 5000);
}

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));
