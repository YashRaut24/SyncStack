import { useState, useEffect } from "react";
import { socket } from "../socket";

export function useBoard() {
  const [board, setBoard] = useState(null);

  useEffect(() => {
    function onConnect() {
      console.log("Connected:", socket.id);
    }

    function onBoardState(data) {
      setBoard(data);
    }

    function onCardCreated({ columnId, card }) {
      setBoard((prevBoard) => {
        const newCards = { ...prevBoard.cards, [card.id]: card };
        const newColumns = prevBoard.columns.map((col) => {
          if (col.id !== columnId) return col;
          return { ...col, cardIds: [...col.cardIds, card.id] };
        });
        return { ...prevBoard, columns: newColumns, cards: newCards };
      });
    }

    function onCardMoved({ cardId, toColumnId }) {
        console.log("card:moved received", cardId, toColumnId); 
        setBoard((prevBoard) => {
        const newColumns = prevBoard.columns.map((col) => {
        const filteredCardIds = col.cardIds.filter((id) => id !== cardId);

        if (col.id === toColumnId) {
            return { ...col, cardIds: [...filteredCardIds, cardId] };
        }
        return { ...col, cardIds: filteredCardIds };
        });

        return { ...prevBoard, columns: newColumns };
    });
    }

    function onCardUpdated({ cardId, title }) {
      setBoard((prevBoard) => {
        const newCards = {
          ...prevBoard.cards,
          [cardId]: { ...prevBoard.cards[cardId], title },
        };

        return { ...prevBoard, cards: newCards };
      });
    }

    function onCardDeleted({ cardId }) {
      setBoard((prevBoard) => {
        const newColumns = prevBoard.columns.map((col) => ({
          ...col,
          cardIds: col.cardIds.filter((id) => id !== cardId),
        }));

        const newCards = { ...prevBoard.cards };
        delete newCards[cardId];

        return { ...prevBoard, columns: newColumns, cards: newCards };
      });
    }
    
    socket.on("connect", onConnect);
    socket.on("board:state", onBoardState);
    socket.on("card:created", onCardCreated);
    socket.on("card:moved", onCardMoved);
    socket.on("card:updated", onCardUpdated);
    socket.on("card:deleted", onCardDeleted);

    return () => {
      socket.off("connect", onConnect);
      socket.off("board:state", onBoardState);
      socket.off("card:created", onCardCreated);
      socket.off("card:moved", onCardMoved);
      socket.off("card:updated", onCardUpdated);
      socket.off("card:deleted", onCardDeleted);
    };
  }, []);

  function addCard(columnId, title) {
    socket.emit("card:create", { columnId, title });
  }

  function moveCard(cardId, toColumnId) {
    socket.emit("card:move", { cardId, toColumnId });
  }

  function updateCard(cardId, title) {
    socket.emit("card:update", { cardId, title });
  }

  function deleteCard(cardId){
    socket.emit("card:delete", {cardId});
  }

  return { board, addCard, moveCard, deleteCard, updateCard };
}