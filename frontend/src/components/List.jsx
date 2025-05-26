import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';

export default function List({
  list,
  cards,
  users = [],
  onAddCard,
  onDeleteList,
  onDeleteCard,
  onUpdateListTitle,
  onUpdateCard,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onToggleChecklistItem,
  dragHandleProps,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);

  const handleAddCard = (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value;
    const assignedUser = e.target.elements.assignedUser.value;
    if (!text) return;
    onAddCard(list.id, text, assignedUser || 'Não atribuído');
    e.target.reset();
  };

  const handleSaveTitle = () => {
    if (newTitle.trim()) {
      onUpdateListTitle(list.id, newTitle.trim());
      setIsEditing(false);
    }
  };

  return (
    <div className="list">
      {/* Handle de arrastar */}
      <div className="list-header" {...dragHandleProps}>
        <div className="drag-handle" title="Arrastar lista"></div>
      </div>

      {/* Header da lista com título e botões */}
      <div className="list-header">
        {isEditing ? (
          <input
            className="edit-input"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            onBlur={handleSaveTitle}
            onKeyDown={(e) => e.key === 'Enter' && handleSaveTitle()}
            autoFocus
          />
        ) : (
          <h3>{list.title}</h3>
        )}

        <div>
          <button
            onClick={() => setIsEditing(true)}
            className="edit-button"
            title="Editar lista"
          >
            ✏️
          </button>
          <button
            onClick={() => onDeleteList(list.id)}
            className="delete-button"
            title="Excluir lista"
          >
            &times;
          </button>
        </div>
      </div>


      <Droppable droppableId={list.id}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="card-container"
          >
            {cards.length === 0 && (
              <div className="empty-message">Solte um card aqui</div>
            )}

            {cards.map((card, index) => (
              <Card
                key={card.id}
                users={users}
                card={card}
                index={index}
                onDelete={() => onDeleteCard(card.id)}
                onUpdate={onUpdateCard}
                onAddChecklistItem={onAddChecklistItem}
                onDeleteChecklistItem={onDeleteChecklistItem}
                onToggleChecklistItem={onToggleChecklistItem}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <form onSubmit={handleAddCard} className="card-form">
        <input name="text" placeholder="Novo card" />

        <select name="assignedUser">
          <option value="">Atribuir usuário</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user} value={user}>
                👤 {user}
              </option>
            ))
          ) : (
            <option disabled>Nenhum usuário</option>
          )}
        </select>

        <button type="submit">Adicionar Card</button>
      </form>
    </div>
  );
}
