import React, { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!message) return null;

  const colors = {
    error: '#e74c3c',
    success: '#2ecc71',
    info: '#3498db',
  };

  return (
    <div
      className="toast"
      style={{ backgroundColor: colors[type] || '#333' }}
    >
      {message}
    </div>
  );
}
