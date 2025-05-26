import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import Checklist from './Checklist';

export default function Card({
  card,
  index,
  onDelete,
  onUpdate,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onToggleChecklistItem,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(card.text);

  const handleSave = () => {
    if (newText.trim()) {
      onUpdate(card.id, newText.trim());
      setIsEditing(false);
    }
  };

  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {isEditing ? (
            <input
              className="edit-input"
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onBlur={handleSave}
              onKeyDown={(e) => e.key === 'Enter' && handleSave()}
              autoFocus
            />
          ) : (
            <p>{card.text}</p>
          )}

          <Checklist
            card={card}
            onAdd={onAddChecklistItem}
            onDelete={onDeleteChecklistItem}
            onToggle={onToggleChecklistItem}
          />

          <div className="card-footer">
            <small>
              {card.assignedUser ? card.assignedUser : 'Não atribuído'}
            </small>

            <div>
              <button
                onClick={() => setIsEditing(true)}
                className="edit-button"
                title="Editar card"
              >
                ✏️
              </button>

              <button
                onClick={onDelete}
                className="delete-button"
                title="Excluir"
              >
                &times;
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
