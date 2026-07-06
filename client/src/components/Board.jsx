import { Column } from "./Column";

export function Board({ board, onAddCard, onMoveCard }) {
  if (!board) return <div>Loading board...</div>;

  return (
    <div className="board">
      {board.columns.map((column) => (
        <Column
          key={column.id}
          column={column}
          cards={board.cards}
          onAddCard={onAddCard}
          onMoveCard={onMoveCard}
        />
      ))}
    </div>
  );
}