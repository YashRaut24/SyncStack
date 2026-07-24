import { useState, useRef, useEffect } from "react";

export function Card({ id, title, statusClass, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState(title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!isEditing) setDraftTitle(title);
  }, [title, isEditing]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  function handleDragStart(e) {
    e.dataTransfer.setData("text/plain", id);
  }

  function handleDeleteClick() {
    onDelete(id);
  }

  function startEditing() {
    setDraftTitle(title);
    setIsEditing(true);
  }

  function commitEdit() {
    const next = draftTitle.trim();
    if (next && next !== title) {
      onUpdate(id, next);
    }
    setIsEditing(false);
  }

  function handleEditKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      commitEdit();
    } else if (e.key === "Escape") {
      setDraftTitle(title);
      setIsEditing(false);
    }
  }

  return (
    <div className="card" draggable={!isEditing} onDragStart={handleDragStart}>
      <span className={`card-tick status-dot ${statusClass}`}></span>
      <div className="card-body">
        {isEditing ? (
          <input
            ref={inputRef}
            className="card-edit-input"
            type="text"
            value={draftTitle}
            onChange={(e) => setDraftTitle(e.target.value)}
            onBlur={commitEdit}
            onKeyDown={handleEditKeyDown}
          />
        ) : (
          <span className="card-title" onClick={startEditing}>{title}</span>
        )}
        <button className="card-delete" onClick={handleDeleteClick} aria-label="Delete card">✕</button>
      </div>
    </div>
  );
}