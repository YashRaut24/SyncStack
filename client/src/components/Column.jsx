import { Card } from "./Card";

export function Column({ column, cards, onAddCard, onMoveCard, onDeleteCard, onUpdateCard }) {
  function handleAddClick() {
    const title = prompt("Card title:");
    if (!title) return;
    onAddCard(column.id, title);
  }

  function handleDragOver(e) {
    e.preventDefault();
  }

  function handleDrop(e) {
    const cardId = e.dataTransfer.getData("text/plain");
    onMoveCard(cardId, column.id);
  }

  // Find every card whose columnId matches this column — replaces
  // the old column.cardIds array entirely.
  const cardsInThisColumn = Object.values(cards).filter(
    (card) => card.columnId === column.id
  );

  return (
    <div
      className="column"
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>
        <span className={`status-dot ${
          column.id === "col-1" ? "todo" : column.id === "col-2" ? "inprogress" : "done"
        }`}></span>
        {column.title}
      </h3>

      {cardsInThisColumn.map((card) => (
        <Card
          key={card._id}
          id={card._id}
          title={card.title}
          onDelete={onDeleteCard}
          onUpdate={onUpdateCard}
        />
      ))}

      <button onClick={handleAddClick}>+ Add card</button>
    </div>
  );
}