import http from "http";
import SocketService from "./socket";
import dotenv from "dotenv";

async function init() {
  dotenv.config();

  const httpServer = http.createServer();
  const PORT = process.env.PORT || 8000;

  const socketService = new SocketService(httpServer); // Pass httpServer

  httpServer.listen(PORT, () =>
    console.log(`🚀 HTTP Server started at PORT:${PORT}`)
  );

  socketService.initListeners();
}

init();
