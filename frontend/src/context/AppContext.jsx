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
          assignedUser: 'Thomas',
        },
      ],
    },
    {
      id: Date.now() + 2,
      title: 'Doing',
      cards: [],
    },
    {
      id: Date.now() + 3,
      title: 'Done',
      cards: [],
    },
  ]);

  // Usuários
  const addUser = (name) => {
    if (users.includes(name)) {
      alert('Usuário já existe!');
      return;
    }
    setUsers((prev) => [...prev, name]);
  };

  const deleteUser = (name) => {
    if (window.confirm(`Excluir usuário ${name}?`)) {
      setUsers((prev) => prev.filter((u) => u !== name));
    }
  };

  // Listas
  const addList = (title) => {
    if (lists.find((l) => l.title === title)) {
      alert('Lista já existe!');
      return;
    }
    const newList = { id: Date.now(), title, cards: [] };
    setLists((prev) => [...prev, newList]);
  };

  const deleteList = (id) => {
    if (window.confirm('Tem certeza que deseja excluir essa lista?')) {
      setLists((prev) => prev.filter((l) => l.id !== id));
    }
  };

  const moveList = (sourceIndex, targetIndex) => {
    setLists((prev) => {
      const updated = [...prev];
      const [moved] = updated.splice(sourceIndex, 1);
      updated.splice(targetIndex, 0, moved);
      return updated;
    });
  };

  // Cards
  const addCard = (listId, text, assignedUser = '') => {
    setLists((prev) =>
      prev.map((list) => {
        if (list.id === listId) {
          if (list.cards.find((c) => c.text === text)) {
            alert('Já existe um card com esse nome nessa lista!');
            return list;
          }
          return {
            ...list,
            cards: [
              ...list.cards,
              {
                id: Date.now(),
                text,
                checklist: [],
                assignedUser,
              },
            ],
          };
        }
        return list;
      })
    );
  };

  const deleteCard = (listId, cardId) => {
    if (window.confirm('Deseja excluir esse card?')) {
      setLists((prev) =>
        prev.map((list) =>
          list.id === listId
            ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
            : list
        )
      );
    }
  };

  const updateCardUser = (listId, cardId, user) => {
    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? {
              ...list,
              cards: list.cards.map((card) =>
                card.id === cardId ? { ...card, assignedUser: user } : card
              ),
            }
          : list
      )
    );
  };

  const moveCard = (sourceListId, targetListId, sourceCardIndex, targetCardIndex) => {
    setLists((prevLists) => {
      const newLists = [...prevLists];

      const sourceList = newLists.find((list) => list.id === sourceListId);
      const targetList = newLists.find((list) => list.id === targetListId);

      if (!sourceList || !targetList) return prevLists;

      const [movedCard] = sourceList.cards.splice(sourceCardIndex, 1);
      targetList.cards.splice(targetCardIndex, 0, movedCard);

      return newLists;
    });
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
        updateCardUser,
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
