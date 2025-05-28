import React, { useState } from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';

import ConfirmModal from '../components/ConfirmModal';

export default function List({
  list,
  cards = [],
  users = [],
  onAddCard,
  onDeleteList,
  onDeleteCard,
  onUpdateListTitle,
  onUpdateCard,
  onAddChecklistItem,
  onDeleteChecklistItem,
  dragHandleProps,
  onAssignUser,
  onAssignUserToChecklistItem,
  onToggleChecklistItem,


}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(list.title);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await onDeleteList(list.id);

    } catch (error) {
      console.error('Erro ao deletar lista:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  const handleAddCard = (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value;
    const assignedUser = e.target.elements.assignedUser.value;
    if (!text) return;
    onAddCard(list.id, text, assignedUser ? parseInt(assignedUser) : null);
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
      <div className="list-header" {...dragHandleProps}>
        <div className="drag-handle" title="Arrastar lista"></div>
      </div>

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
            onClick={handleDelete}
            className="delete-button"
            title="Excluir lista"
          >
            &times;
          </button>
        </div>
      </div>

      <Droppable droppableId={`list-${list.id}`} type="card">
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
                key={`card-${card.id}`}
                users={users}
                card={card}
                index={index}
                onDelete={() => onDeleteCard(card.id)}
                onUpdate={onUpdateCard}
                onAddChecklistItem={onAddChecklistItem}
                onDeleteChecklistItem={onDeleteChecklistItem}
                onToggleChecklistItem={onToggleChecklistItem}
                onAssignUser={onAssignUser}
                onAssignUserToChecklistItem={onAssignUserToChecklistItem}
              />
            ))}

            {provided.placeholder}
          </div>
        )}
      </Droppable>


      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir a lista "${list.title}"? Todos os cards dentro dela também serão excluídos.`}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />

      <form onSubmit={handleAddCard} className="card-form">
        <input name="text" placeholder="Novo card" />

        <select name="assignedUser">
          <option value="">Atribuir usuário</option>
          {users.length > 0 ? (
            users.map((user) => (
              <option key={user.id} value={user.id}>
                👤 {user.name}
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
