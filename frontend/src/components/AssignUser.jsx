import React from 'react';
import { useAppContext } from '../context/AppContext';

export default function AssignUser({ assignedUser, onChange }) {
  const { users } = useAppContext();

  return (
    <select value={assignedUser} onChange={e => onChange(e.target.value)}>
      <option value="">Sem atribuição</option>
      {users.map(user => (
        <option key={user} value={user}>
          {user}
        </option>
      ))}
    </select>
  );
}
