import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Checklist({ card, onAdd, onDelete, onToggle, onAssignUserToItem }) {
  const { users } = useAppContext();

  const [text, setText] = useState('');
  const [assignedUser, setAssignedUser] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    onAdd(card.id, text.trim(), assignedUser || null);
    setText('');
    setAssignedUser('');
    setShowForm(false);
  };

  const handleToggle = (item) => {


    onToggle(card.id, item.id, { done: !item.done });
  };

  const handleDelete = (item) => {
    onDelete(card.id, item.id);
  };

  return (
    <div className="checklist">
      <div className="checklist-items">
        {card.checklist?.map((item) => (
          <div key={item.id} className="checklist-item">
            <input
              type="checkbox"
              checked={item.done}
              onChange={() => handleToggle(item)}
            />
            <span className={item.done ? 'done' : ''}>
              {item.text} {item.assigned_user_id && `(${users.find(u => u.id === item.assigned_user_id)?.name || 'Não atribuído'})`}
            </span>
            <button
              onClick={() => handleDelete(item)}
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
            required
          />

          <select
            value={assignedUser}
            onChange={(e) => setAssignedUser(e.target.value)}
          >
            <option value="">Atribuir usuário</option>
            {users.length > 0 ? (
              users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))
            ) : (
              <option disabled>Nenhum usuário</option>
            )}
          </select>

          <div className="subitem-buttons">
            <button type="submit">Adicionar</button>
            <button type="button" onClick={() => setShowForm(false)}>
              Cancelar
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
