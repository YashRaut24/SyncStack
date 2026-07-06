import { Card } from "./Card";

export function Column({ column, cards, onAddCard }) {
  function handleAddClick() {
    const title = prompt("Card title:");
    if (!title) return;
    onAddCard(column.id, title);
  }

  return (
    <div className="column">
      <h3>{column.title}</h3>

      {column.cardIds.map((cardId) => (
        <Card key={cardId} title={cards[cardId].title} />
      ))}

      <button onClick={handleAddClick}>+ Add card</button>
    </div>
  );
}