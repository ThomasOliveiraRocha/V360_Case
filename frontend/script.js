let users = [];
let lists = [];
let cardId = 1;

// Adiciona usuário
function addUser() {
  const input = document.getElementById('newUserName');
  const name = input.value.trim();
  if (name) {
    users.push({ id: users.length + 1, name });
    input.value = '';
    renderUsers();
  }
}

function renderUsers() {
  const ul = document.getElementById('userList');
  ul.innerHTML = '';
  users.forEach(user => {
    const li = document.createElement('li');
    li.textContent = user.name;
    ul.appendChild(li);
  });
}

// Adiciona lista
function addList() {
  const input = document.getElementById('newListName');
  const title = input.value.trim();
  if (title) {
    lists.push({ id: lists.length + 1, title, cards: [] });
    input.value = '';
    renderLists();
  }
}

// Adiciona cartão
function addCard(listId, inputId) {
  const input = document.getElementById(inputId);
  const text = input.value.trim();
  if (text) {
    const list = lists.find(l => l.id === listId);
    list.cards.push({ id: cardId++, text });
    input.value = '';
    renderLists();
  }
}

// Renderiza listas e cartões
function renderLists() {
  const container = document.getElementById('listsContainer');
  container.innerHTML = '';

  lists.forEach(list => {
    const div = document.createElement('div');
    div.className = 'list';
    div.dataset.listId = list.id;
    div.innerHTML = `
      <h3>${list.title}</h3>
      <div class="cards" id="cards-${list.id}"></div>
      <div class="add-card">
        <input type="text" id="input-card-${list.id}" placeholder="Novo card">
        <button onclick="addCard(${list.id}, 'input-card-${list.id}')">Adicionar</button>
      </div>
    `;
    container.appendChild(div);

    const cardsContainer = div.querySelector('.cards');

    list.cards.forEach(card => {
      const c = document.createElement('div');
      c.className = 'card';
      c.draggable = true;
      c.dataset.cardId = card.id;
      c.innerText = card.text;

      // Eventos de drag
      c.addEventListener('dragstart', dragStart);
      c.addEventListener('dragend', dragEnd);

      cardsContainer.appendChild(c);
    });

    // Eventos de drag no container de cards
    cardsContainer.addEventListener('dragover', dragOver);
    cardsContainer.addEventListener('drop', drop);
  });
}

// Drag & Drop
let draggedCard = null;

function dragStart(e) {
  draggedCard = this;
  setTimeout(() => this.style.display = 'none', 0);
}

function dragEnd(e) {
  this.style.display = 'block';
  draggedCard = null;
}

function dragOver(e) {
  e.preventDefault();
}

function drop(e) {
  this.appendChild(draggedCard);
  const listId = parseInt(this.id.split('-')[1]);
  const cardId = parseInt(draggedCard.dataset.cardId);

  // Remove de onde estava
  lists.forEach(list => {
    list.cards = list.cards.filter(c => c.id !== cardId);
  });

  // Adiciona na nova lista
  const targetList = lists.find(l => l.id === listId);
  targetList.cards.push({ id: cardId, text: draggedCard.innerText });
}
