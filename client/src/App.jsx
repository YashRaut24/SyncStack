import { useBoard } from "./hooks/useBoard";
import { Board } from "./components/Board";
import "./App.css";

function App() {
  const { board, addCard, moveCard, deleteCard } = useBoard();

  return (
    <>
      <h1>SyncStack</h1>
      <Board board={board} onAddCard={addCard} onMoveCard={moveCard} onDeleteCard={deleteCard} />
    </>
  );
}

export default App;