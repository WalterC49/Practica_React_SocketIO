import express from "express";
import http from "http";
import { Server as SocketServer } from "socket.io";

const app = express();
const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: "http://localhost:5173",
  },
});

io.on("connection", (socket) => {
  socket.on("client:message", (data) => {
    socket.broadcast.emit("server:message", {
      body: data,
      from: socket.id.slice(6),
    });
  });
});

const PORT = 3000;

server.listen(PORT, () => {
  console.log(`Server up on: http://localhost:${PORT}`);
});
