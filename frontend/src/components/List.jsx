import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import Card from './Card';

export default function List({
  list,
  cards,
  users = [],
  onAddCard,
  onDeleteList,
  onDeleteCard,
  onUpdateCard,
}) {
  const handleAddCard = (e) => {
    e.preventDefault();
    const text = e.target.elements.text.value;
    const assignedUser = e.target.elements.assignedUser.value;
    if (!text) return;
    onAddCard(list.id, text, assignedUser || 'Não atribuído');
    e.target.reset();
  };

  return (
    <div className="list">
      <div className="list-header">
        <h3>{list.title}</h3>
        <button
          onClick={() => onDeleteList(list.id)}
          className="delete-button"
          title="Excluir lista"
        >
          &times;
        </button>
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
