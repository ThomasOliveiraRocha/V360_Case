import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

export default function Card({ card, index, onDelete }) {
  return (
    <Draggable draggableId={card.id} index={index}>
      {(provided) => (
        <div
          className="card"
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          <p>{card.text}</p>
          
          <div className="card-footer">
            <small>
              {card.assignedUser ? card.assignedUser : 'Não atribuído'}
            </small>

            <button onClick={onDelete} className="delete-button" title="Excluir">
              &times;
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
