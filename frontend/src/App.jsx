import React, { useState, useEffect } from 'react';
import { useAppContext } from './context/AppContext';
//import { DragDropContext } from '@hello-pangea/dnd';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Header from './components/Header';
import List from './components/List';
import Toast from './components/Toast';
import ConfirmModal from './components/ConfirmModal';
import Sidebar from './components/Sidebar';
import './index.css';
import { fetchLists, createList } from './services/api';



function App() {
  const { users } = useAppContext();
  const [theme, setTheme] = useState('light');
  const { toast, clearToast, showToast } = useAppContext();
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });


  const [lists, setLists] = useState([
    { id: 'list-1', title: 'A Fazer' },
    { id: 'list-2', title: 'Em Progresso' },
    { id: 'list-3', title: 'Concluído' },
  ]);

  const [cards, setCards] = useState([
    { id: 'card-1', title: 'Criar interface', listId: 'list-1', assignedUser: 'Thomas' },
    { id: 'card-2', title: 'Fazer backend', listId: 'list-2', assignedUser: 'Larissa' },
    { id: 'card-3', title: 'Testar', listId: 'list-3', assignedUser: '' },
  ]);

  useEffect(() => {
    document.body.className = theme === 'dark' ? 'dark' : '';
  }, [theme]);


  useEffect(() => {
    fetchLists().then(setLists);
  }, []);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  // ➕ Adicionar Card
  const handleAddCard = (listId, text, assignedUser) => {
    const cardExists = cards.find((c) => c.text === text);
    if (cardExists) {
      showToast('❌ Já existe um card com esse nome!', 'error');
      return;
    }

    const newCard = {
      id: `card-${Date.now()}`,
      text,
      listId,
      assignedUser,
    };

    setCards([...cards, newCard]);
    showToast('✅ Card criado com sucesso!', 'success');
  };
  // ➕ Adicionar Lista
  const handleAddList = async (title) => {
    if (lists.find((l) => l.title === title)) {
      showToast('❌ Já existe uma lista com esse nome!', 'error');
      return;
    }
    try {
      const newList = await createList(title);
      setLists([...lists, newList]);
      showToast('✅ Lista criada com sucesso!', 'success');
    } catch {
      showToast('❌ Erro ao criar lista!', 'error');
    }
  };


  // 🗑️ Deletar Lista
  const handleDeleteList = (listId) => {
    openConfirm(
      'Excluir Lista',
      'Tem certeza que deseja excluir esta lista e todos os seus cards?',
      () => {
        setLists(lists.filter((list) => list.id !== listId));
        setCards(cards.filter((card) => card.listId !== listId));
        showToast('🗑️ Lista excluída com sucesso!', 'success');
        closeConfirm();
      }
    );
  };


  // 🗑️ Deletar Card
  const handleDeleteCard = (cardId) => {
    openConfirm(
      'Excluir Card',
      'Tem certeza que deseja excluir este card?',
      () => {
        setCards(cards.filter((card) => card.id !== cardId));
        showToast('🗑️ Card excluído com sucesso!', 'success');
        closeConfirm();
      }
    );
  };


  // 🧠 Função genérica para abrir o modal
  const openConfirm = (title, message, onConfirm) => {
    setConfirmData({
      isOpen: true,
      title,
      message,
      onConfirm
    });
  };

  // 🧠 Fecha o modal
  const closeConfirm = () => {
    setConfirmData({ ...confirmData, isOpen: false });
  };

  // ✅ Checklist functions
  const handleAddChecklistItem = (listId, cardId, text, assignedUser) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId && card.listId === listId
          ? {
            ...card,
            checklist: [
              ...(card.checklist || []),
              {
                id: `item-${Date.now()}`,
                text,
                done: false,
                assignedUser
              }
            ]
          }
          : card
      )
    );
  };

  const handleToggleChecklistItem = (listId, cardId, itemId) => {
    setCards(prev =>
      prev.map(card =>
        card.id === cardId && card.listId === listId
          ? {
            ...card,
            checklist: card.checklist.map(item =>
              item.id === itemId ? { ...item, done: !item.done } : item
            )
          }
          : card
      )
    );
  };
  const handleUpdateListTitle = (listId, newTitle) => {
    setLists(
      lists.map((list) =>
        list.id === listId ? { ...list, title: newTitle } : list
      )
    );
  };

  const handleUpdateCard = (cardId, newText) => {
    setCards(
      cards.map((card) =>
        card.id === cardId ? { ...card, text: newText } : card
      )
    );
  };

  const handleDeleteChecklistItem = (listId, cardId, itemId) => {
    openConfirm(
      'Excluir Subitem',
      'Tem certeza que deseja excluir este Subitem?',
      () => {
        setCards(prev =>
          prev.map(card =>
            card.id === cardId && card.listId === listId
              ? {
                ...card,
                checklist: card.checklist.filter(item => item.id !== itemId)
              }
              : card
          )
        );
        showToast('🗑️ Subitem excluído com sucesso!', 'success');
        closeConfirm();
      }
    );

  };





  const handleDragEnd = (result) => {
    const { destination, source, draggableId, type } = result;

    if (!destination) return;
    //  Movendo listas
    if (type === 'list') {
      const newLists = Array.from(lists);
      const [moved] = newLists.splice(source.index, 1);
      newLists.splice(destination.index, 0, moved);
      setLists(newLists);
      return;
    }


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
      <Toast message={toast.message} type={toast.type} onClose={clearToast} />

      <div className="main">
        <Sidebar /> {/* ⬅️ Aqui está a Sidebar */}

        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId="board" direction="horizontal" type="list">
            {(provided) => (
              <div
                className="board"
                ref={provided.innerRef}
                {...provided.droppableProps}
              >
                {lists.map((list, index) => (
                  <Draggable key={list.id} draggableId={list.id} index={index}>
                    {(provided) => (
                      <div
                        className="list"
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                      >
                        <List
                          list={list}
                          users={users}
                          cards={cards.filter((card) => card.listId === list.id)}
                          onAddCard={handleAddCard}
                          onDeleteList={handleDeleteList}
                          onDeleteCard={handleDeleteCard}
                          onAddChecklistItem={handleAddChecklistItem}
                          onDeleteChecklistItem={handleDeleteChecklistItem}
                          onToggleChecklistItem={handleToggleChecklistItem}
                          onUpdateListTitle={handleUpdateListTitle}
                          onUpdateCard={handleUpdateCard}
                          dragHandleProps={provided.dragHandleProps} // repassa pro List
                        />
                      </div>
                    )}
                  </Draggable>
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

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </div>
      <ConfirmModal
        isOpen={confirmData.isOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={closeConfirm}
      />
    </div>
  );
}

export default App;
