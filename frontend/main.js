const API = "http://localhost:5000";

async function fetchData(endpoint) {
    const res = await fetch(`${API}/${endpoint}`);
    return res.json();
}

async function addUser() {
    const name = document.getElementById('userName').value;
    const res = await fetch(`${API}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });
    const data = await res.json();
    alert(`User added: ${data.name}`);
}

async function addList() {
    const title = document.getElementById('listTitle').value;
    const res = await fetch(`${API}/lists`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title })
    });
    const data = await res.json();
    alert(`List added: ${data.title}`);
}

async function addCard() {
    const title = document.getElementById('cardTitle').value;
    const description = document.getElementById('cardDescription').value;
    const list_id = parseInt(document.getElementById('cardListId').value);

    const res = await fetch(`${API}/cards`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, list_id })
    });
    const data = await res.json();
    alert(`Card added: ${data.title}`);
}

async function render() {
    const users = await fetchData('users');
    const lists = await fetchData('lists');
    const cards = await fetchData('cards');

    document.getElementById('output').textContent =
        `Users:\n${JSON.stringify(users, null, 2)}\n\n` +
        `Lists:\n${JSON.stringify(lists, null, 2)}\n\n` +
        `Cards:\n${JSON.stringify(cards, null, 2)}`;
}
