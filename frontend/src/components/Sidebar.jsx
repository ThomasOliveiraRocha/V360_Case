import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { users, addUser, deleteUser } = useAppContext();
  const [newUser, setNewUser] = useState('');

  const handleAddUser = () => {
    const trimmed = newUser.trim();
    if (!trimmed) return;
    addUser(trimmed);
    setNewUser('');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <h2>Equipe</h2>
        <ul className="user-list">
          {users.map((user) => (
            <li key={user} className="user-item">
              <span>{user}</span>
              <button
                className="delete-button"
                onClick={() => deleteUser(user)}
                title="Remover usuário"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  fill="currentColor"
                  viewBox="0 0 16 16"
                >
                  <path d="M4.646 4.646a.5.5 0 011 0L8 7.293l2.354-2.647a.5.5 0 11.708.708L8.707 8l2.647 2.354a.5.5 0 11-.708.708L8 8.707l-2.354 2.647a.5.5 0 11-.708-.708L7.293 8 4.646 5.646a.5.5 0 010-.708z"/>
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="sidebar-footer">
        <input
          placeholder="Novo usuário"
          value={newUser}
          onChange={(e) => setNewUser(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAddUser()}
        />
        <button onClick={handleAddUser}>Adicionar</button>
      </div>
    </div>
  );
}
