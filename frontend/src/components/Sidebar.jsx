import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

export default function Sidebar() {
  const { users, addUser, deleteUser } = useAppContext();
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() === '') return;
    if (users.includes(input.trim())) {
      alert('Usuário já existe!');
      return;
    }
    addUser(input.trim());
    setInput('');
  };

  return (
    <div className="sidebar">
      <h2>Equipe</h2>
      <ul>
        {users.map((user) => (
          <li key={user}>
            {user}
            <button onClick={() => {
              if (window.confirm(`Deseja excluir ${user}?`)) {
                deleteUser(user);
              }
            }}>🗑️</button>
          </li>
        ))}
      </ul>
      <div className="add-user">
        <input
          placeholder="Novo usuário"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button onClick={handleAdd}>Adicionar</button>
      </div>
    </div>
  );
}
