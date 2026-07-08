export function Card({ id, title, onDelete, onUpdate }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDeleteClick() {
    onDelete(id);
  }

  function handleTitleClick() {
    const newTitle = prompt("Edit title:", title);
    if (!newTitle) return;
    onUpdate(id, newTitle);
  }

  return (
    <div className="card" draggable={true} onDragStart={handleDragStart}>
      <span onClick={handleTitleClick}>{title}</span>
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
}