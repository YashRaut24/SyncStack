import { Column } from "./Column";

export function Board({ board, onAddCard, onMoveCard, onDeleteCard, onUpdateCard }) {
  if (!board) {
    return <div className="board-loading">Opening the ledger…</div>;
  }

  if (!board.columns || board.columns.length === 0) {
    return <div className="board-empty">No columns on this board yet.</div>;
  }

  return (
    <div className="board">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          cards={board.cards}
          onAddCard={onAddCard}
          onMoveCard={onMoveCard}
          onDeleteCard={onDeleteCard}
          onUpdateCard={onUpdateCard}
        />
      ))}
    </div>
  );
}