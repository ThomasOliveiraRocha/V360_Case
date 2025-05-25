import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import Card from './Card';

export default function List({ list }) {
  const { addCard, deleteList, moveCard } = useAppContext();
  const [draggedCard, setDraggedCard] = useState(null);

  const handleAddCard = () => {
    const text = prompt('Texto do novo card:');
    if (text) {
      addCard(list.id, text);
    }
  };

  const handleDragStart = (card) => {
    setDraggedCard(card);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    if (draggedCard) {
      moveCard(draggedCard.listId, draggedCard.id, list.id);
      setDraggedCard(null);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="list"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="list-header">
        <h3>{list.title}</h3>
        <button onClick={() => deleteList(list.id)}>🗑️</button>
      </div>
      <div className="cards">
        {list.cards.map((card) => (
          <Card
            key={card.id}
            card={{ ...card, listId: list.id }}
            onDragStart={() => handleDragStart({ ...card, listId: list.id })}
          />
        ))}
      </div>
      <button className="add-card-button" onClick={handleAddCard}>
        + Adicionar Card
      </button>
    </div>
  );
}
