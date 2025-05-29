import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { useAppContext } from './context/AppContext';
import List from './components/List';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import '../public/index.css';

export default function App() {
  const {
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
    updateChecklistItem,
    handleDragEnd,
    assignUserToCard,
    assignUserToChecklistItem,
  } = useAppContext();



  const [newListTitle, setNewListTitle] = useState('');
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.body.className = newTheme;

  };

  const handleAddList = (e) => {
    e.preventDefault();
    if (!newListTitle.trim()) return;
    addList(newListTitle);
    setNewListTitle('');
  };

  return (
    <div className={`app ${theme}`}>
      <Header toggleTheme={toggleTheme} theme={theme} />
      <div className="main-container">
        <Sidebar />
        <div className="board-container">
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="board" direction="horizontal" type="list">
              {(provided) => (
                <div
                  className="board"
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {lists.map((list, index) => (
                    <Draggable key={`list-${list.id}`} draggableId={`list-${list.id}`} index={index}>
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                        >

                          <List
                            list={list}
                            cards={list.cards}
                            users={users}
                            onAddCard={addCard}
                            onDeleteList={deleteList}
                            onDeleteCard={(cardId) =>
                              deleteCard(list.id, cardId)
                            }
                            onUpdateListTitle={updateListTitle}
                            onUpdateCard={updateCard}
                            onAddChecklistItem={addChecklistItem}
                            onDeleteChecklistItem={deleteChecklistItem}
                            onToggleChecklistItem={updateChecklistItem}

                            dragHandleProps={provided.dragHandleProps}
                            onAssignUser={assignUserToCard}
                            onAssignUserToChecklistItem={assignUserToChecklistItem}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}

                  <form onSubmit={handleAddList} className="list-form">
                    <input
                      value={newListTitle}
                      onChange={(e) => setNewListTitle(e.target.value)}
                      placeholder="Nova lista"
                    />
                    <button type="submit">Adicionar Lista</button>
                  </form>
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}
