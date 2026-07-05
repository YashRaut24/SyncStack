const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" } // Vite's default dev port
});

const board = {
  columns: [
    { id: "col-1", title: "To Do", cardIds: [] },
    { id: "col-2", title: "In Progress", cardIds: [] },
    { id: "col-3", title: "Done", cardIds: [] },
  ],
  cards: {},
};

io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  socket.emit("board:state", board);

  socket.on("disconnect", () => {
    console.log("Socket disconnected:", socket.id);
  });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`SyncStack server running on port ${PORT}`);
});