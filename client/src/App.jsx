import { useState } from "react";
import { useBoard } from "./hooks/useBoard";
import { Board } from "./components/Board";
import "./App.css";

function App() {
  const [boardId, setBoardId] = useState(null);
  const [username, setUsername] = useState(null);

  const [boardInput, setBoardInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const { board, addCard, moveCard, deleteCard, updateCard, presence } = useBoard(boardId, username);

  function handleJoin() {
    if (!boardInput.trim() || !nameInput.trim()) return;
    setBoardId(boardInput.trim());
    setUsername(nameInput.trim());
  }

  if (!boardId || !username) {
    return (
      <div className="join-screen">
        <h1>SyncStack</h1>
        <input
          type="text"
          placeholder="Your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
        />
        <input
          type="text"
          placeholder="Enter board name"
          value={boardInput}
          onChange={(e) => setBoardInput(e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    );
  }

  return (
    <>
      <h1>SyncStack — {boardId}</h1>
      <div className="presence-bar">
        Online: {presence.join(", ")}
      </div>
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