const API_URL = 'http://localhost:5000';

//  Lists
export const fetchLists = async () => {
  const res = await fetch(`${API_URL}/lists`);
  return res.json();
};

export async function createList(title) {
  const res = await fetch('http://localhost:5000/lists', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error('Erro ao criar lista');
  return await res.json();
}


export const deleteList = async (listId, user = 'Sistema') => {
  const res = await fetch(`${API_URL}/lists/${listId}`, {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user }),
  });
  return res.json();
};

//  Cards
export const createCard = async (listId, cardData, user = 'Sistema') => {
  const res = await fetch(`${API_URL}/lists/${listId}/cards`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ ...cardData, user }),
  });
  return res.json();
};

export const moveCard = async (cardId, newListId, user = 'Sistema') => {
  const res = await fetch(`${API_URL}/cards/${cardId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ new_list_id: newListId, user }),
  });
  return res.json();
};

export const deleteCard = async (cardId, user = 'Sistema') => {
  const res = await fetch(`${API_URL}/cards/${cardId}?user=${encodeURIComponent(user)}`, {
    method: 'DELETE',
  });
  return res.json();
};


//  Users
export const fetchUsers = async () => {
  const res = await fetch(`${API_URL}/users`);
  return res.json();
};

export const createUser = async (name) => {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const deleteUser = async (userId) => {
  const res = await fetch(`${API_URL}/users/${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erro ao deletar usuário');
  return res.json();
};


//  History
export const fetchHistory = async (page = 1, perPage = 20, user = '', resourceType = '') => {
  const query = new URLSearchParams({
    page,
    per_page: perPage,
    user,
    resource_type: resourceType,
  });

  const res = await fetch(`${API_URL}/history?${query}`);
  return res.json();
};


//  Checklist


export const addChecklistItem = async (cardId, text, assignedUserId = null, user = 'Sistema') => {
  const { data } = await axios.post(`${API_URL}/cards/${cardId}/checklist`, {
    text,
    assigned_user_id: assignedUserId,
    user,
  });
  return data;
};

export const updateChecklistItem = async (itemId, updates, user = 'Sistema') => {
  const { data } = await axios.put(`${API_URL}/checklist/${itemId}`, {
    ...updates,
    user,
  });
  return data;
};

export const deleteChecklistItem = async (itemId, user = 'Sistema') => {
  const { data } = await axios.delete(`${API_URL}/checklist/${itemId}?user=${encodeURIComponent(user)}`);
  return data;
};

