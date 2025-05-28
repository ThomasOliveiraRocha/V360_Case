import React, { useEffect } from 'react';

export default function Toast({ message, type = 'error', onClose }) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    error: '#e74c3c',
    success: '#2ecc71',
    info: '#3498db',
  };

  const bgColor = colors[type] || '#333';

  return (
    <div
      className="toast"
      style={{
        backgroundColor: bgColor,
        color: '#fff',
        padding: '12px 20px',
        borderRadius: '8px',
        marginBottom: '10px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
        minWidth: '200px',
      }}
    >
      {message}
    </div>
  );
}
