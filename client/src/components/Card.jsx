export function Card({ id, title }) {
  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", id);
  }

  return (
    <div className="card" draggable={true} onDragStart={handleDragStart}>
      {title}
    </div>
  );
}