import React, { createContext, useContext, useEffect, useState } from 'react';
import axios from 'axios';
import { useToast } from './ToastContext';

const AppContext = createContext();


export const AppProvider = ({ children }) => {
  const [lists, setLists] = useState([]);
  const [users, setUsers] = useState([]);
  const { showToast } = useToast();

  const API_URL = 'http://localhost:5000';

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [listsRes, usersRes] = await Promise.all([
        axios.get(`${API_URL}/lists`),
        axios.get(`${API_URL}/users`),
      ]);

      setLists(listsRes.data);
      setUsers(usersRes.data);
      showToast('Dados carregados com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao buscar dados:', error);
      showToast('Erro ao buscar dados!', 'error');
    }
  };

  // Listas
  const addList = async (title) => {
    try {
      const res = await axios.post(`${API_URL}/lists`, { title });
      const newList = { ...res.data, cards: [] };

      setLists([...lists, newList]);
      showToast('Lista criada com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar lista:', error);
      showToast('Erro ao adicionar lista.', 'error');
    }
  };


  const deleteList = async (listId, user = 'Sistema') => {
    try {
      await axios.delete(`${API_URL}/lists/${listId}?user=${encodeURIComponent(user)}`);

      // Atualiza o estado removendo a lista imediatamente
      setLists((prev) => prev.filter((list) => list.id !== listId));

      showToast('Lista deletada com sucesso!', 'success');
    } catch (error) {
      if (error.response?.status === 404) {
        // Se deu 404, significa que a lista já não existe no backend, então trata como sucesso no frontend
        setLists((prev) => prev.filter((list) => list.id !== listId));
        showToast('Lista já não existia no backend, removida localmente.', 'info');
      } else {
        console.error('Erro ao excluir lista:', error);
        showToast('Erro ao deletar a lista.', 'error');
      }
    }
  };



  const updateListTitle = async (listId, newTitle) => {
    try {
      await axios.put(`${API_URL}/lists/${listId}`, { title: newTitle });
      setLists(
        lists.map((list) => (list.id === listId ? { ...list, title: newTitle } : list))

      );
      showToast('Titulo da lista atualizado com sucesso!.', 'success');
    } catch (error) {
      console.error('Erro ao atualizar título da lista:', error);
      showToast('Erro ao atualizar título da lista.', 'error');
    }
  };
  // Drag and Drop
  const handleDragEnd = async (result) => {
    const { source, destination, type } = result;

    if (!destination) return;

    try {
      if (type === 'list') {
        const reorderedLists = Array.from(lists);
        const [removed] = reorderedLists.splice(source.index, 1);
        reorderedLists.splice(destination.index, 0, removed);


        setLists(reorderedLists);

        try {

          await axios.put(`${API_URL}/lists/${removed.id}/move`, {
            new_position: destination.index,
            user: 'Sistema',
          });
        } catch (error) {
          console.error('Erro ao mover lista:', error);
          showToast('Erro ao mover a lista.', 'error');
        }

        return;
      }


      if (type === 'card') {
        const sourceList = lists.find((l) => l.id === source.droppableId);
        const destList = lists.find((l) => l.id === destination.droppableId);

        if (!sourceList || !destList) return;

        const sourceCards = [...sourceList.cards];
        const [movedCard] = sourceCards.splice(source.index, 1);

        const destCards = [...destList.cards, movedCard]; // adiciona no final da lista de destino

        const updatedLists = lists.map((list) => {
          if (list.id === sourceList.id) return { ...list, cards: sourceCards };
          if (list.id === destList.id) return { ...list, cards: destCards };
          return list;
        });

        setLists(updatedLists);

        // 🔥 Faz a requisição apenas para atualizar a lista do card
        await axios.put(`${API_URL}/cards/${movedCard.id}/move`, {
          list_id: destList.id,
        });
      }
    } catch (error) {
      console.error('Erro ao mover:', error);
      showToast('Erro ao mover o card.', 'error');
    }
  };



  // Cards
  const addCard = async (listId, title, assignedUser) => {
    try {
      const res = await axios.post(`${API_URL}/lists/${listId}/cards`, {
        title,
        assigned_user_id: assignedUser,
      });
      setLists(
        lists.map((list) =>
          list.id === listId ? { ...list, cards: [...list.cards, res.data] } : list
        )
      );
      showToast('Card adicionado com sucesso!.', 'success');
    } catch (error) {
      console.error('Erro ao adicionar card:', error);
      showToast('Erro ao adicionar card.', 'error');
    }
  };

  const deleteCard = async (listId, cardId, user = 'Sistema') => {
    try {
      await axios.delete(`${API_URL}/cards/${cardId}?user=${encodeURIComponent(user)}`);

      setLists(
        lists.map((list) =>
          list.id === listId
            ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
            : list
        )
      );

      showToast('Card excluído com sucesso!', 'success');
    } catch (error) {
      if (error.response?.status === 404) {
        // Trata como sucesso no frontend
        setLists(
          lists.map((list) =>
            list.id === listId
              ? { ...list, cards: list.cards.filter((card) => card.id !== cardId) }
              : list
          )
        );
        showToast('Card já não existia no backend, removido localmente.', 'info');
      } else {
        console.error('Erro ao excluir card:', error);
        showToast('Erro ao excluir card.', 'error');
      }
    }
  };



  const updateCard = async (cardId, newText, assignedUserId) => {
    try {
      const response = await axios.put(`${API_URL}/cards/${cardId}`, {
        title: newText,
        assigned_user_id: assignedUserId,
      });

      const updatedCard = response.data;

      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId ? { ...card, ...updatedCard } : card
          ),
        }))
      );

      showToast('Card atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar card:', error);
      showToast('Erro ao atualizar card!', 'error');
    }
  };



  // Checklist
  const addChecklistItem = async (cardId, text, assigned_user_id = null) => {
    try {
      const res = await axios.post(`${API_URL}/cards/${cardId}/checklist`, {
        text,
        assigned_user_id,
        user: 'Sistema',
      });

      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? { ...card, checklist: [...card.checklist, res.data] }
              : card
          ),
        }))
      );
      showToast('Subitem adicionado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao adicionar subitem:', error);
      showToast('Erro ao adicionar subitem.', 'error');
    }
  };

  const updateChecklistItem = async (itemId, cardId, updates) => {
    try {
      const res = await axios.put(`${API_URL}/checklist/${itemId}`, {
        ...updates,
        user: 'Sistema',
      });

      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? {
                ...card,
                checklist: card.checklist.map((item) =>
                  item.id === itemId ? res.data : item
                ),
              }
              : card
          ),
        }))
      );

      showToast('Subitem atualizado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao atualizar subitem:', error);
      showToast('Erro ao atualizar subitem.', 'error');
    }
  };





  const deleteChecklistItem = async (itemId, cardId) => {
    try {
      await axios.delete(`${API_URL}/checklist/${itemId}?user=Sistema`);

      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId
              ? {
                ...card,
                checklist: card.checklist.filter((item) => item.id !== itemId),
              }
              : card
          ),
        }))
      );

      showToast('Subitem deletado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao deletar subitem:', error);
      showToast('Erro ao deletar subitem.', 'error');
    }
  };



  // Users
  const addUser = async (name) => {
    try {
      const res = await axios.post(`${API_URL}/users`, { name });
      setUsers([...users, res.data]);
      showToast('Usuário criado com sucesso!.', 'success');
    } catch (error) {
      console.error('Erro ao adicionar usuário:', error);
      showToast('Erro ao adicionar usuário!.', 'error');
    }
  };

  const deleteUser = async (userId) => {
    console.log("ID recebido:", userId);
    try {
      await axios.delete(`${API_URL}/users/${userId}`);
      setUsers(users.filter((user) => user.id !== userId));
      showToast('Usuário deletado com sucesso!', 'success');
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
      showToast('Erro ao excluir usuário!', 'error');
    }
  };

  const assignUserToCard = async (cardId, userId) => {
    try {
      const res = await axios.put(`${API_URL}/cards/${cardId}`, {
        assigned_user_id: userId,
        user: 'Sistema',
      });

      setLists((prevLists) =>
        prevLists.map((list) => ({
          ...list,
          cards: list.cards.map((card) =>
            card.id === cardId ? { ...card, ...res.data } : card
          ),
        }))
      );

      showToast('Usuário atribuído ao card!', 'success');
    } catch (error) {
      console.error('Erro ao atribuir usuário ao card:', error);
      showToast('Erro ao atribuir usuário.', 'error');
    }
  };

  const assignUserToChecklistItem = async (itemId, cardId, userId) => {
    try {
      await updateChecklistItem(itemId, cardId, { assigned_user_id: userId });
      showToast('Usuário atribuído ao subitem!', 'success');
    } catch (error) {
      console.error('Erro ao atribuir usuário ao subitem:', error);
      showToast('Erro ao atribuir usuário.', 'error');
    }
  };




  return (
    <AppContext.Provider
      value={{
        lists,
        users,
        addList,
        deleteList,
        updateListTitle,
        addCard,
        deleteCard,
        updateCard,
        addChecklistItem,
        deleteChecklistItem,
        addUser,
        deleteUser,
        handleDragEnd,
        assignUserToCard,
        assignUserToChecklistItem,
        updateChecklistItem,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
