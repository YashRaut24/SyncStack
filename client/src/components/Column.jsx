import { Card } from "./Card";

export function Column({ column, cards, onAddCard, onMoveCard }) {
  function handleAddClick() {
    const title = prompt("Card title:");
    if (!title) return;
    onAddCard(column.id, title);
  }
  
    function handleDragOver(e) {
    console.log("dragover firing"); // temp debug
    e.preventDefault();
    }

  function handleDrop(e){
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
        <Card key={cardId} id={cardId} title={cards[cardId].title} />
      ))}

      <button onClick={handleAddClick}>+ Add card</button>
    </div>
  );
}