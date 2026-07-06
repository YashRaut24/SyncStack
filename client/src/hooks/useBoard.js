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

    socket.on("connect", onConnect);
    socket.on("board:state", onBoardState);
    socket.on("card:created", onCardCreated);

    return () => {
      socket.off("connect", onConnect);
      socket.off("board:state", onBoardState);
      socket.off("card:created", onCardCreated);
    };
  }, []);

  function addCard(columnId, title) {
    socket.emit("card:create", { columnId, title });
  }

  return { board, addCard };
}