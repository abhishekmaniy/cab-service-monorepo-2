import http from "http";
import SocketService from "./socket";
import dotenv from "dotenv";

async function init() {
  dotenv.config();

  const PORT = process.env.PORT || 8080;

  // Create an HTTP server with a request handler
  const httpServer = http.createServer((req, res) => {
    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("Hello World");
    }
  });

  const socketService = new SocketService(httpServer); // Pass httpServer

  httpServer.listen(PORT, () =>
    console.log(`🚀 HTTP Server started at PORT:${PORT}`)
  );

  socketService.initListeners();
}

init();
