const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "http://localhost:5173" } // Vite's default dev port
});

function createNewBoard() {
  return {
    columns: [
      {id: "col-1", title: "To Do", cardIds: []},
      {id: "col-2", title: "In Progress", cardIds: []},
      {id: "col-3", title: "Done", cardIds: []},
    ],
    cards: {},
  };
}

const boards = {}

function getOrCreateBoard(boardId){
  if(!boards[boardId]){
    boards[boardId] = createNewBoard();
  }

  return boards[boardId];
}


io.on("connection", (socket) => {
  console.log("Socket connected:", socket.id);

  let currentBoardId = null; 

socket.on("join-board", ({ boardId }) => {
  console.log("join-board received:", boardId); // temp debug
  currentBoardId = boardId;
  socket.join(boardId);

  const board = getOrCreateBoard(boardId);
  console.log("sending board:state", board); // temp debug
  socket.emit("board:state", board);
});
  socket.on("card:create", ({ columnId, title }) => {
    const board = getOrCreateBoard(currentBoardId);
    const cardId = "card-" + Date.now();
    const card = { id: cardId, title };

    board.cards[cardId] = card;
    const column = board.columns.find((col) => col.id === columnId);
    column.cardIds.push(cardId);

    io.to(currentBoardId).emit("card:created", { columnId, card });
  });

  socket.on("card:move", ({ cardId, toColumnId }) => {
    const board = getOrCreateBoard(currentBoardId);
    board.columns.forEach((col) => {
      col.cardIds = col.cardIds.filter((id) => id !== cardId);
    });

    const toColumn = board.columns.find((col) => col.id === toColumnId);
    toColumn.cardIds.push(cardId);

    io.to(currentBoardId).emit("card:moved", { cardId, toColumnId });
  });

  socket.on("card:update", ({ cardId, title }) => {
    const board = getOrCreateBoard(currentBoardId);
    const card = board.cards[cardId];
    if (!card) return;

    card.title = title;
    io.to(currentBoardId).emit("card:updated", { cardId, title });
  });

  socket.on("card:delete", ({ cardId }) => {
    const board = getOrCreateBoard(currentBoardId);
    board.columns.forEach((col) => {
      col.cardIds = col.cardIds.filter((id) => id !== cardId);
    });
    delete board.cards[cardId];

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