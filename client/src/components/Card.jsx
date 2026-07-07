export function Card({ id, title, onDelete }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDeleteClick() {
    onDelete(id);
  }

  return (
    <div className="card" draggable={true} onDragStart={handleDragStart}>
      {title}
      <button onClick={handleDeleteClick}>Delete</button>
    </div>
  );
}