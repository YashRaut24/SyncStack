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

  function handleJoinKeyDown(e) {
    if (e.key === "Enter") handleJoin();
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
          <div className="join-form-pane">
            <div className="join-wordmark">
              <span className="join-wordmark-mark"></span>
              <span>Live board</span>
            </div>
            <h1>SyncStack</h1>
            <p className="join-sub">
              A shared ledger for your team's work. Enter a name and a board — everyone
              on it sees changes the moment they happen.
            </p>

            <div className="join-field">
              <label htmlFor="join-name">Your name</label>
              <input
                id="join-name"
                type="text"
                placeholder="e.g. Priya"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                onKeyDown={handleJoinKeyDown}
              />
            </div>

            <div className="join-field">
              <label htmlFor="join-board">Board name</label>
              <input
                id="join-board"
                type="text"
                placeholder="e.g. launch-plan"
                value={boardInput}
                onChange={(e) => setBoardInput(e.target.value)}
                onKeyDown={handleJoinKeyDown}
              />
            </div>

            <button onClick={handleJoin}>Join board</button>
          </div>

          <div className="join-preview">
            <div className="ledger-preview">
              <div className="ledger-preview-heading">To Do</div>
              <div className="ledger-preview-row">
                <span className="ledger-preview-tick" style={{ background: "var(--status-todo)" }}></span>
                <span className="ledger-preview-line" style={{ width: "70%" }}></span>
              </div>
              <div className="ledger-preview-row">
                <span className="ledger-preview-tick" style={{ background: "var(--status-inprogress)" }}></span>
                <span className="ledger-preview-line" style={{ width: "45%" }}></span>
              </div>
              <div className="ledger-preview-row">
                <span className="ledger-preview-tick" style={{ background: "var(--status-done)" }}></span>
                <span className="ledger-preview-line" style={{ width: "58%" }}></span>
              </div>
              <div className="ledger-preview-row">
                <span className="ledger-preview-tick" style={{ background: "var(--status-todo)" }}></span>
                <span className="ledger-preview-line" style={{ width: "33%" }}></span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-root" data-theme={theme}>
      <header className="topbar">
        <div className="topbar-identity">
          <h1>SyncStack</h1>
          <span className="board-id">— {boardId}</span>
        </div>
        <div className="topbar-meta">
          <span className="presence-bar">
            <span className="presence-dot"></span>
            {presence.join(", ")}
          </span>
          <div className="topbar-actions">
            <button className="theme-toggle" onClick={handleLeave}>Leave board</button>
            <button className="theme-toggle" onClick={toggleTheme}>
              {theme === "light" ? "Dark mode" : "Light mode"}
            </button>
          </div>
        </div>
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