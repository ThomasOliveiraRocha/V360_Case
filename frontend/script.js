const apiUrl = 'http://127.0.0.1:5000/api';

async function fetchLists() {
  const res = await fetch(`${apiUrl}/lists`);
  const lists = await res.json();

  const container = document.getElementById('lists');
  container.innerHTML = '';

  lists.forEach(list => {
    const div = document.createElement('div');
    div.className = 'list';
    div.innerHTML = `
      <h2>${list.name} <button onclick="deleteList(${list.id})">🗑️</button></h2>
      <ul>
        ${list.items.map(item => `
          <li>
            <input type="checkbox" ${item.completed ? 'checked' : ''} onchange="toggleItem(${item.id}, ${!item.completed})">
            ${item.completed ? `<span class="completed">${item.content}</span>` : item.content}
            <button onclick="deleteItem(${item.id})">❌</button>
          </li>
        `).join('')}
      </ul>
      <input type="text" id="input-${list.id}" placeholder="Novo item">
      <button onclick="addItem(${list.id})">Adicionar</button>
    `;
    container.appendChild(div);
  });
}

async function createList() {
  const name = document.getElementById('newListName').value;
  if (!name) return;
  await fetch(`${apiUrl}/lists`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name })
  });
  document.getElementById('newListName').value = '';
  fetchLists();
}

async function addItem(listId) {
  const input = document.getElementById(`input-${listId}`);
  const content = input.value;
  if (!content) return;
  
  await fetch(`${apiUrl}/lists/${listId}/items`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ content })
  });
  input.value = '';
  fetchLists();
}

async function toggleItem(itemId, completed) {
  await fetch(`${apiUrl}/items/${itemId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed })
  });
  fetchLists();
}

async function deleteItem(itemId) {
  await fetch(`${apiUrl}/items/${itemId}`, { method: 'DELETE' });
  fetchLists();
}

async function deleteList(listId) {
  await fetch(`${apiUrl}/lists/${listId}`, { method: 'DELETE' });
  fetchLists();
}

fetchLists();
