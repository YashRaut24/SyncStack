import { useState } from "react";
import { useBoard } from "./hooks/useBoard";
import { Board } from "./components/Board";
import "./App.css";

function App() {
  const [boardId, setBoardId] = useState(null);
  const [inputValue, setInputValue] = useState("");

  const { board, addCard, moveCard, deleteCard, updateCard } = useBoard(boardId);

  function handleJoin() {
    if (!inputValue.trim()) return;
    setBoardId(inputValue.trim());
  }

  if (!boardId) {
    return (
      <div className="join-screen">
        <h1>SyncStack</h1>
        <input
          type="text"
          placeholder="Enter board name"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return (
    <>
      <h1>SyncStack — {boardId}</h1>
      <Board
        board={board}
        onAddCard={addCard}
        onMoveCard={moveCard}
        onDeleteCard={deleteCard}
        onUpdateCard={updateCard}
      />
    </>
  );
}

export default App;