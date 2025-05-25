import React, { createContext, useContext, useState } from 'react';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(['Thomas', 'Larissa']);
  const [lists, setLists] = useState([
    {
      id: Date.now(),
      title: 'To Do',
      cards: [
        {
          id: Date.now() + 1,
          text: 'Exemplo de Card',
          checklist: [],
        },
      ],
    },
  ]);

  const addUser = (name) => {
    if (users.includes(name)) {
      alert('Usuário já existe!');
      return;
    }
    setUsers(prev => [...prev, name]);
  };

  const deleteUser = (name) => {
    if (window.confirm(`Excluir usuário ${name}?`)) {
      setUsers(prev => prev.filter(u => u !== name));
    }
  };

  const addList = (title) => {
    if (lists.find(l => l.title === title)) {
      alert('Lista já existe!');
      return;
    }
    const newList = { id: Date.now(), title, cards: [] };
    setLists(prev => [...prev, newList]);
  };

  const deleteList = (id) => {
    if (window.confirm('Tem certeza que deseja excluir essa lista?')) {
      setLists(prev => prev.filter(l => l.id !== id));
    }
  };

  const addCard = (listId, text) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              cards: [...list.cards, { id: Date.now(), text, checklist: [] }],
            }
          : list
      )
    );
  };

  const deleteCard = (listId, cardId) => {
    if (window.confirm('Deseja excluir esse card?')) {
      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? {
                ...list,
                cards: list.cards.filter(card => card.id !== cardId),
              }
            : list
        )
      );
    }
  };

  const addChecklistItem = (listId, cardId, text, assignedUser) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map(card =>
                card.id === cardId
                  ? {
                      ...card,
                      checklist: [
                        ...card.checklist,
                        {
                          id: Date.now(),
                          text,
                          done: false,
                          assignedUser,
                        },
                      ],
                    }
                  : card
              ),
            }
          : list
      )
    );
  };

  const deleteChecklistItem = (listId, cardId, itemId) => {
    if (window.confirm('Excluir este subitem?')) {
      setLists(prev =>
        prev.map(list =>
          list.id === listId
            ? {
                ...list,
                cards: list.cards.map(card =>
                  card.id === cardId
                    ? {
                        ...card,
                        checklist: card.checklist.filter(item => item.id !== itemId),
                      }
                    : card
                ),
              }
            : list
        )
      );
    }
  };

  const toggleChecklistItem = (listId, cardId, itemId) => {
    setLists(prev =>
      prev.map(list =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map(card =>
                card.id === cardId
                  ? {
                      ...card,
                      checklist: card.checklist.map(item =>
                        item.id === itemId ? { ...item, done: !item.done } : item
                      ),
                    }
                  : card
              ),
            }
          : list
      )
    );
  };

  const moveCard = (sourceListId, cardId, targetListId) => {
    const card = lists
      .find(list => list.id === sourceListId)
      ?.cards.find(c => c.id === cardId);

    if (!card) return;

    setLists(prev =>
      prev.map(list => {
        if (list.id === sourceListId) {
          return { ...list, cards: list.cards.filter(c => c.id !== cardId) };
        } else if (list.id === targetListId) {
          return { ...list, cards: [...list.cards, card] };
        } else {
          return list;
        }
      })
    );
  };

  const moveList = (sourceIndex, targetIndex) => {
    const updated = [...lists];
    const [removed] = updated.splice(sourceIndex, 1);
    updated.splice(targetIndex, 0, removed);
    setLists(updated);
  };

  return (
    <AppContext.Provider
      value={{
        users,
        lists,
        addUser,
        deleteUser,
        addList,
        deleteList,
        addCard,
        deleteCard,
        addChecklistItem,
        deleteChecklistItem,
        toggleChecklistItem,
        moveCard,
        moveList,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
