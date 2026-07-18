import { useState, useEffect } from "react";
import { useBoard } from "./hooks/useBoard";
import { Board } from "./components/Board";
import "./App.css";

function App() {
const [boardId, setBoardId] = useState(() => localStorage.getItem("syncstack-boardId") || null);
const [username, setUsername] = useState(() => localStorage.getItem("syncstack-username") || null);
  const [boardInput, setBoardInput] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [theme, setTheme] = useState(() => localStorage.getItem("syncstack-theme") || "light");
  
  useEffect(() => {
    localStorage.setItem("syncstack-theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((t) => (t === "light" ? "dark" : "light"));
  }

  const { board, addCard, moveCard, deleteCard, updateCard, presence } = useBoard(boardId, username);

  function handleJoin() {
    if (!boardInput.trim() || !nameInput.trim()) return;
    const newBoardId = boardInput.trim();
    const newUsername = nameInput.trim();

    localStorage.setItem("syncstack-boardId", newBoardId);
    localStorage.setItem("syncstack-username", newUsername);

    setBoardId(newBoardId);
    setUsername(newUsername);
  }

  function handleLeave() {
    localStorage.removeItem("syncstack-boardId");
    localStorage.removeItem("syncstack-username");
    setBoardId(null);
    setUsername(null);
  }

  if (!boardId || !username) {
    return (
      <div className="app-root" data-theme={theme}>
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
      </div>
    );
  }

  return (
    <div className="app-root" data-theme={theme}>
    <header className="topbar">
      <h1>SyncStack — {boardId}</h1>
      <span className="presence-bar">
        <span className="presence-dot"></span>
        {presence.join(", ")}
      </span>
      <button className="theme-toggle" onClick={handleLeave}>Leave board</button>
      <button className="theme-toggle" onClick={toggleTheme}>
        {theme === "light" ? "Dark mode" : "Light mode"}
      </button>
    </header>
      <Board
        board={board}
        onAddCard={addCard}
        onMoveCard={moveCard}
        onDeleteCard={deleteCard}
        onUpdateCard={updateCard}
      />
    </div>
  );
}

export default App;