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

  return (
    <div
      className="column"
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <h3>{column.title}</h3>

      {column.cardIds.map((cardId) => (
        <Card
          key={cardId}
          id={cardId}
          title={cards[cardId].title}
          onDelete={onDeleteCard}
          onUpdate={onUpdateCard}
        />
      ))}

      <button onClick={handleAddClick}>+ Add card</button>
    </div>
  );
}