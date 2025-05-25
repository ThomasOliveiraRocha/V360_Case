import React from 'react';
import { useAppContext } from '../context/AppContext';
import List from './List';

export default function Board() {
  const { lists, addList, moveList } = useAppContext();

  const handleAddList = () => {
    const title = prompt('Nome da nova lista:');
    if (title) {
      addList(title);
    }
  };

  const handleDragStart = (e, index) => {
    e.dataTransfer.setData('listIndex', index);
  };

  const handleDrop = (e, targetIndex) => {
    const sourceIndex = e.dataTransfer.getData('listIndex');
    moveList(Number(sourceIndex), targetIndex);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div className="board">
      <div className="board-header">
        <button onClick={handleAddList}>+ Adicionar Lista</button>
      </div>
      <div className="lists">
        {lists.map((list, index) => (
          <div
            key={list.id}
            draggable
            onDragStart={(e) => handleDragStart(e, index)}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
          >
            <List list={list} />
          </div>
        ))}
      </div>
    </div>
  );
}
