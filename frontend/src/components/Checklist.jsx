import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Checklist({ card, onAdd, onDelete, onToggle }) {
  const { users } = useAppContext();
  const [text, setText] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    const userToAssign = assignedUser || 'Não atribuído';
    onAdd(card.listId, card.id, text.trim(), userToAssign);
    setText('');
    setAssignedUser('');
    setShowForm(false); // esconde o formulário após adicionar
  };

  return (
    <div className="checklist">
      <div className="checklist-items">
        {card.checklist?.map((item) => (
          <div key={item.id} className="checklist-item">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => onToggle(card.listId, card.id, item.id)}
            />
            <span className={item.done ? 'done' : ''}>
              {item.text} {item.assignedUser && `(${item.assignedUser})`}
            </span>
            <button
              onClick={() => onDelete(card.listId, card.id, item.id)}
              className="delete-button"
              title="Remover"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {!showForm ? (
        <button onClick={() => setShowForm(true)} className="add-subitem-button">
          + Adicionar Subitem
        </button>
      ) : (
        <form onSubmit={handleSubmit} className="subitem-form">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Novo subitem"
          />

          <select
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
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

          <div className="subitem-buttons">
            <button type="submit">Adicionar</button>
            <button type="button" onClick={() => setShowForm(false)}>Cancelar</button>
          </div>
        </form>
      )}
    </div>
  );
}
