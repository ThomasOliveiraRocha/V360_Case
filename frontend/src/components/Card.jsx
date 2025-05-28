import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import Checklist from './Checklist';
import ConfirmModal from '../components/ConfirmModal';

export default function Card({
  card,
  index,
  users,
  onDelete,
  onUpdate,
  onAddChecklistItem,
  onDeleteChecklistItem,
  onToggleChecklistItem,
  onAssignUserToChecklistItem,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [newText, setNewText] = useState(card.title);
  const [selectedUser, setSelectedUser] = useState(card.assigned_user_id);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = () => {
    if (newText.trim()) {
      onUpdate(card.id, newText.trim(), selectedUser);
      setIsEditing(false);
    }
  };

  const handleDelete = () => {
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await onDelete(card.list_id, card.id);
    } catch (error) {
      console.error('Erro ao deletar card:', error);
    } finally {
      setIsModalOpen(false);
    }
  };

  return (
    <>
      <Draggable draggableId={`card-${card.id}`} index={index}>
        {(provided) => (
          <div
            className="card"
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
          >
            {isEditing ? (
              <div className="edit-container">
                <input
                  className="edit-input"
                  value={newText}
                  onChange={(e) => setNewText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  autoFocus
                />
                <select
                  className="edit-select"
                  value={selectedUser || ''}
                  onChange={(e) => setSelectedUser(e.target.value)}
                >
                  <option value="">Atribuir usuário</option>
                  {users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
                </select>
                <button onClick={handleSave} className="save-button">
                  Salvar
                </button>
              </div>
            ) : (
              <p>{card.title}</p>
            )}

            <Checklist
              card={card}
              onAdd={onAddChecklistItem}
              onDelete={onDeleteChecklistItem}
              onToggle={onToggleChecklistItem}
              onAssignUserToItem={onAssignUserToChecklistItem}
            />

            <div className="card-footer">
              {/* Exibir usuário atribuído */}
              {card.assigned_user_id && (
                <div className="assigned-info">
                  Atribuído a:{' '}
                  {users.find((u) => u.id === card.assigned_user_id)?.name ||
                    'Não encontrado'}
                </div>
              )}

              {!isEditing && (
                <>
                  <button
                    onClick={() => {
                      setIsEditing(true);
                      setNewText(card.title);
                      setSelectedUser(card.assigned_user_id);
                    }}
                    className="edit-button"
                    title="Editar card"
                  >
                    ✏️
                  </button>

                  <button
                    onClick={handleDelete}
                    className="delete-button"
                    title="Excluir"
                  >
                    &times;
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </Draggable>

      <ConfirmModal
        isOpen={isModalOpen}
        title="Confirmar Exclusão"
        message={`Tem certeza que deseja excluir o card "${card.title}"?`}
        onConfirm={confirmDelete}
        onCancel={() => setIsModalOpen(false)}
      />
    </>
  );
}
