import React from 'react';
import '../index.css';

export default function Header({ toggleTheme, theme }) {
  return (
    <div className="header">
      <h1>V360 Kanban</h1>
      <button className="theme-button" onClick={toggleTheme}>
        {theme === 'light' ? '🌙' : '☀️'}
      </button>
    </div>
  );
}