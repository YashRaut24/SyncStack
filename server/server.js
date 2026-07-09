const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" } 
});

require("dotenv").config();
const mongoose = require("mongoose");
const Board = require("./models/Board");
const Card = require("./models/Card");

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));


  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    let currentBoardId = null; 

    socket.on("join-board", async ({ boardId }) => {
      currentBoardId = boardId;
      socket.join(boardId);

      let board = await Board.findOne({ boardId });

      if (!board) {
        board = await Board.create({
          boardId,
          columns: [
            { id: "col-1", title: "To Do" },
            { id: "col-2", title: "In Progress" },
            { id: "col-3", title: "Done" },
          ],
        });
      }

      const cards = await Card.find({ boardId });

      socket.emit("board:state", { columns: board.columns, cards });
    });

    socket.on("card:create", async ({ columnId, title }) => {
      const card = await Card.create({
        boardId: currentBoardId,
        columnId,
        title,
      });

      io.to(currentBoardId).emit("card:created", { card });
    });

    socket.on("card:move", async ({ cardId, toColumnId }) => {
      await Card.findByIdAndUpdate(cardId, { columnId: toColumnId });

      io.to(currentBoardId).emit("card:moved", { cardId, toColumnId });
    });

    socket.on("card:update", async ({ cardId, title }) => {
      await Card.findByIdAndUpdate(cardId, { title });

      io.to(currentBoardId).emit("card:updated", { cardId, title });
    });

    socket.on("card:delete", async ({ cardId }) => {
      await Card.findByIdAndDelete(cardId);

      io.to(currentBoardId).emit("card:deleted", { cardId });
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
});

const PORT = 4000;
server.listen(PORT, () => {
  console.log(`SyncStack server running on port ${PORT}`);
});