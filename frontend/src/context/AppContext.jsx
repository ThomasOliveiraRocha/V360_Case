import React, { createContext, useContext, useState } from 'react';
import ConfirmModal from '../components/ConfirmModal';

const AppContext = createContext();

export function AppProvider({ children }) {
  const [users, setUsers] = useState(['Thomas', 'Larissa']);
  const [toast, setToast] = useState({ message: '', type: '' });
  const [confirmData, setConfirmData] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { }
  });



  // Modal de confirmação
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

  //Mensagens de erro
  const showToast = (message, type = 'error') => {
    setToast({ message, type });
  };

  const clearToast = () => {
    setToast({ message: '', type: '' });
  };

  //Listas
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
      showToast('❌ Usuário já existe!', 'error');
      return;
    }
    setUsers((prev) => [...prev, name]);
    showToast('✅ Usuário adicionado!', 'success');
  };

  const deleteUser = (name) => {
    openConfirm(
      'Excluir Usuário',
      'Tem certeza que deseja excluir este Usuário?',
      () => {
        setUsers((prev) => prev.filter((u) => u !== name));
        showToast('🗑️ Usuário excluído!', 'info');
        closeConfirm();
      }
    );

  };



  // Listas
  const addList = (title) => {
    if (lists.find((l) => l.title === title)) {
      showToast('❌ Lista já existe!', 'error');
      return;
    }
    const newList = { id: Date.now(), title, cards: [] };
    setLists((prev) => [...prev, newList]);
    showToast('✅ Lista criada!', 'success');
  };

  const deleteList = (id) => {

    setLists((prev) => prev.filter((l) => l.id !== id));
    showToast('🗑️ Lista excluída!', 'info');
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
            showToast('❌ Card já existe!', 'error');
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

    setLists((prev) =>
      prev.map((list) =>
        list.id === listId
          ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
          : list
      )
    );
    showToast('🗑️ Card excluído!', 'info');

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
        showToast,
        clearToast,
        toast,
        openConfirm,
        closeConfirm,
        confirmData,
      }}
    >
      {children}
      {/* 🔥 Modal de confirmação global */}
      <ConfirmModal
        isOpen={confirmData.isOpen}
        title={confirmData.title}
        message={confirmData.message}
        onConfirm={confirmData.onConfirm}
        onCancel={closeConfirm}
      />
    </AppContext.Provider>
  );
}

export function useAppContext() {
  return useContext(AppContext);
}
