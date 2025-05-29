import React from 'react';
import '../../public/index.css';

function ConfirmModal({ isOpen, title, message, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{title}</h2>
        <p>{message}</p>
        <div className="modal-buttons">
          <button className="confirm-btn" onClick={onConfirm}>Confirmar</button>
          <button className="cancel-btn" onClick={onCancel}>Cancelar</button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
