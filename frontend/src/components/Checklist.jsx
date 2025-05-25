import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function Checklist({ card }) {
  const {
    users,
    addChecklistItem,
    deleteChecklistItem,
    toggleChecklistItem,
  } = useAppContext();

  const handleAdd = () => {
    const text = prompt('Texto do subitem:');
    if (!text) return;
    const assignedUser = prompt(
      `Atribuir para qual usuário?\n(${users.join(', ')})`
    );
    if (!assignedUser || !users.includes(assignedUser)) {
      alert('Usuário inválido!');
      return;
    }
    addChecklistItem(card.listId, card.id, text, assignedUser);
  };

  return (
    <div className="checklist">
      {card.checklist.map(item => (
        <div key={item.id} className="checklist-item">
          <input
            type="checkbox"
            checked={item.done}
            onChange={() =>
              toggleChecklistItem(card.listId, card.id, item.id)
            }
          />
          <span className={item.done ? 'done' : ''}>
            {item.text} ({item.assignedUser})
          </span>
          <button
            onClick={() =>
              deleteChecklistItem(card.listId, card.id, item.id)
            }
          >
            🗑️
          </button>
        </div>
      ))}
      <button className="add-subitem-button" onClick={handleAdd}>
        + Adicionar Subitem
      </button>
    </div>
  );
}
