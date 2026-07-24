import { useState, useRef, useEffect } from "react";
import { Card } from "./Card";

export function Column({ column, cards, onAddCard, onMoveCard, onDeleteCard, onUpdateCard }) {
  const [isAdding, setIsAdding] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isAdding && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isAdding]);

  function openAddForm() {
    setDraftTitle("");
    setIsAdding(true);
  }

  function closeAddForm() {
    setIsAdding(false);
    setDraftTitle("");
  }

  function commitAdd() {
    const title = draftTitle.trim();
    if (!title) {
      closeAddForm();
      return;
    }
    onAddCard(column.id, title);
    closeAddForm();
  }

  function handleAddKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitAdd();
    } else if (e.key === "Escape") {
      closeAddForm();
    }
  }

  function handleDragOver(e) {
    e.preventDefault();
    setIsDragOver(true);
  }

  function handleDragLeave() {
    setIsDragOver(false);
  }

  function handleDrop(e) {
    const cardId = e.dataTransfer.getData("text/plain");
    onMoveCard(cardId, column.id);
    setIsDragOver(false);
  }

  // Find every card whose columnId matches this column — replaces
  // the old column.cardIds array entirely.
  const cardsInThisColumn = Object.values(cards).filter(
    (card) => card.columnId === column.id
  );

  const statusClass =
    column.id === "col-1" ? "todo" : column.id === "col-2" ? "inprogress" : "done";

  return (
    <div
      className={`column${isDragOver ? " drag-over" : ""}`}
      onDragEnter={(e) => e.preventDefault()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="column-rail">
        <span className={`status-dot ${statusClass}`}></span>
        <h3>{column.title}</h3>
        <span className="column-count">{cardsInThisColumn.length}</span>
      </div>

      {cardsInThisColumn.length === 0 && !isAdding && (
        <div className="column-empty">No entries yet</div>
      )}

      {cardsInThisColumn.map((card) => (
        <Card
          key={card._id}
          id={card._id}
          title={card.title}
          statusClass={statusClass}
          onDelete={onDeleteCard}
          onUpdate={onUpdateCard}
        />
      ))}

      <div className="add-card-row">
        {isAdding ? (
          <div className="add-card-form">
            <input
              ref={inputRef}
              type="text"
              placeholder="Card title"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              onKeyDown={handleAddKeyDown}
            />
            <div className="add-card-form-actions">
              <button className="add-card-confirm" onClick={commitAdd}>Add</button>
              <button className="add-card-cancel" onClick={closeAddForm}>Cancel</button>
            </div>
          </div>
        ) : (
          <button className="add-card-trigger" onClick={openAddForm}>+ Add card</button>
        )}
      </div>
    </div>
  );
}