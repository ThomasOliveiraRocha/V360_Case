import React, { useState, useEffect } from 'react';
import { DragDropContext } from '@hello-pangea/dnd';
import Header from './components/Header';
import List from './components/List';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [lists, setLists] = useState([
    { id: 'list-1', title: 'A Fazer' },
    { id: 'list-2', title: 'Em Progresso' },
    { id: 'list-3', title: 'Concluído' },
  ]);

  const [cards, setCards] = useState([
    { id: 'card-1', text: 'Criar interface', listId: 'list-1', assignedUser: '👤 João' },
    { id: 'card-2', text: 'Fazer backend', listId: 'list-2', assignedUser: '👤 Maria' },
    { id: 'card-3', text: 'Testar', listId: 'list-3', assignedUser: '' },
  ]);

  // 🌙 Dark/Light
  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // ➕ Adicionar Card
  const handleAddCard = (listId, text, assignedUser) => {
    const newCard = {
      id: `card-${Date.now()}`,
      text,
      listId,
      assignedUser,
    };
    setCards([...cards, newCard]);
  };

  // ➕ Adicionar Lista
  const handleAddList = (title) => {
    const newList = {
      id: `list-${Date.now()}`,
      title,
    };
    setLists([...lists, newList]);
  };

  // 🗑️ Deletar Lista (e os cards dentro dela)
  const handleDeleteList = (listId) => {
    setLists(lists.filter((list) => list.id !== listId));
    setCards(cards.filter((card) => card.listId !== listId));
  };

  // 🗑️ Deletar Card
  const handleDeleteCard = (cardId) => {
    setCards(cards.filter((card) => card.id !== cardId));
  };

  const handleDragEnd = (result) => {
  const { destination, source, draggableId } = result;

  if (!destination) return;

  const draggedCard = cards.find((card) => card.id === draggableId);
  if (!draggedCard) return;

  const newCards = [...cards];

  // Atualiza o listId do card arrastado
  const updatedCard = { ...draggedCard, listId: destination.droppableId };

  // Remove o card da posição antiga (olha só dentro da lista antiga)
  const filteredCards = newCards.filter((card) => card.id !== draggableId);

  // Encontra os cards na nova lista
  const destinationCards = filteredCards.filter(
    (card) => card.listId === destination.droppableId
  );

  // Insere o card na nova posição da nova lista
  destinationCards.splice(destination.index, 0, updatedCard);

  // Junta tudo: os cards que não são da lista destino + os cards da lista destino atualizados
  const finalCards = [
    ...filteredCards.filter((card) => card.listId !== destination.droppableId),
    ...destinationCards,
  ];

  setCards(finalCards);
};


  return (
    <div>
      <Header toggleTheme={toggleTheme} theme={theme} />

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="board">
          {lists.map((list) => (
            <List
              key={list.id}
              list={list}
              cards={cards.filter((card) => card.listId === list.id)}
              onAddCard={handleAddCard}
              onDeleteList={handleDeleteList}
              onDeleteCard={handleDeleteCard}
            />
          ))}

          <div className="list">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const title = e.target.elements.title.value;
                if (!title) return;
                handleAddList(title);
                e.target.reset();
              }}
              className="list-form"
            >
              <input name="title" placeholder="Nova lista" />
              <button type="submit">Adicionar Lista</button>
            </form>
          </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
