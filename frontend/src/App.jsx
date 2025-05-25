import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
import { DragDropContext } from '@hello-pangea/dnd';
import Header from './components/Header';
import List from './components/List';
import Sidebar from './components/Sidebar'; // ⬅️ Importa a Sidebar
import './index.css';

function App() {
  const { users } = useAppContext();
  const [theme, setTheme] = useState('light');

  const [lists, setLists] = useState([
    { id: 'list-1', title: 'A Fazer' },
    { id: 'list-2', title: 'Em Progresso' },
    { id: 'list-3', title: 'Concluído' },
  ]);

  const [cards, setCards] = useState([
    { id: 'card-1', text: 'Criar interface', listId: 'list-1', assignedUser: 'Thomas' },
    { id: 'card-2', text: 'Fazer backend', listId: 'list-2', assignedUser: 'Larissa' },
    { id: 'card-3', text: 'Testar', listId: 'list-3', assignedUser: '' },
  ]);

  // 🌙 Tema
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

  // 🗑️ Deletar Lista
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

  // Se soltar no mesmo lugar, não faz nada
  if (
    destination.droppableId === source.droppableId &&
    destination.index === source.index
  ) {
    return;
  }

  setCards((prevCards) => {
    const draggedCard = prevCards.find((card) => card.id === draggableId);
    if (!draggedCard) return prevCards;

    // Remove o card da posição original
    const updatedCards = prevCards.filter((card) => card.id !== draggableId);

    // Filtra os cards da lista de destino
    const destinationCards = updatedCards.filter(
      (card) => card.listId === destination.droppableId
    );

    // Atualiza o listId do card
    const newCard = { ...draggedCard, listId: destination.droppableId };

    // Insere no índice correto na lista de destino
    destinationCards.splice(destination.index, 0, newCard);

    // Junta os cards que não são da lista de destino com os atualizados
    const finalCards = [
      ...updatedCards.filter(
        (card) => card.listId !== destination.droppableId
      ),
      ...destinationCards,
    ];

    return finalCards;
  });
};


  return (
    <div>
      <Header toggleTheme={toggleTheme} theme={theme} />

      <div className="main">
        <Sidebar /> {/* ⬅️ Aqui está a Sidebar */}

        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="board">
            {lists.map((list) => (
              <List
                key={list.id}
                list={list}
                users={users}
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
    </div>
  );
}

export default App;
