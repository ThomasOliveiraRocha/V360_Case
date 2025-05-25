import React from 'react';
import { useAppContext } from '../context/AppContext';
import Checklist from './Checklist';

export default function Card({ card, onDragStart }) {
  const { deleteCard } = useAppContext();

  return (
    <div
      className="card"
      draggable
      onDragStart={onDragStart}
    >
      <div className="card-header">
        <span>{card.text}</span>
        <button onClick={() => deleteCard(card.listId, card.id)}>🗑️</button>
      </div>
      <Checklist card={card} />
    </div>
  );
}
