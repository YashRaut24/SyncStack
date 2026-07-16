import { useState, useEffect } from "react";
import { socket } from "../socket";

export function useBoard(boardId, username) {
  const [board, setBoard] = useState(null);
  const [presence, setPresence] = useState([]);

  useEffect(() => {
    if (!boardId) return;

    function onConnect() {
      console.log("Connected:", socket.id);
      socket.emit("join-board", { boardId, username });
    }

    function onBoardState(data) {
      const cardsById = {};
      data.cards.forEach((card) => {
        cardsById[card._id] = card;
      });
      setBoard({ columns: data.columns, cards: cardsById });
    }

    function onCardCreated({ card }) {
      setBoard((prevBoard) => ({
        ...prevBoard,
        cards: { ...prevBoard.cards, [card._id]: card },
      }));
    }

    function onCardMoved({ cardId, toColumnId }) {
      setBoard((prevBoard) => ({
        ...prevBoard,
        cards: {
          ...prevBoard.cards,
          [cardId]: { ...prevBoard.cards[cardId], columnId: toColumnId },
        },
      }));
    }

    function onCardUpdated({ cardId, title }) {
      setBoard((prevBoard) => ({
        ...prevBoard,
        cards: {
          ...prevBoard.cards,
          [cardId]: { ...prevBoard.cards[cardId], title },
        },
      }));
    }

    function onCardDeleted({ cardId }) {
      setBoard((prevBoard) => {
        const newCards = { ...prevBoard.cards };
        delete newCards[cardId];
        return { ...prevBoard, cards: newCards };
      });
    }

    function onPresenceUpdate(usernames) {
      setPresence(usernames);
    }

    socket.on("connect", onConnect);
    socket.on("board:state", onBoardState);
    socket.on("card:created", onCardCreated);
    socket.on("card:moved", onCardMoved);
    socket.on("card:updated", onCardUpdated);
    socket.on("card:deleted", onCardDeleted);
    socket.on("presence:update", onPresenceUpdate);

    if (socket.connected) {
      onConnect();
    }

    return () => {
      socket.off("connect", onConnect);
      socket.off("board:state", onBoardState);
      socket.off("card:created", onCardCreated);
      socket.off("card:moved", onCardMoved);
      socket.off("card:updated", onCardUpdated);
      socket.off("card:deleted", onCardDeleted);
      socket.off("presence:update", onPresenceUpdate);
    };
  }, [boardId, username]);

  function addCard(columnId, title) {
    socket.emit("card:create", { columnId, title });
  }

  function moveCard(cardId, toColumnId) {
    socket.emit("card:move", { cardId, toColumnId });
  }

  function updateCard(cardId, title) {
    socket.emit("card:update", { cardId, title });
  }

  function deleteCard(cardId) {
    socket.emit("card:delete", { cardId });
  }

  return { board, addCard, moveCard, deleteCard, updateCard, presence };
}