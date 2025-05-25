import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Board from './components/Board';
import { AppProvider } from './context/AppContext';

export default function App() {
  const [theme, setTheme] = useState('light');

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  return (
    <AppProvider>
      <div className={`app ${theme}`}>
        <Sidebar />
        <div className="main">
          <Header toggleTheme={toggleTheme} theme={theme} />
          <Board />
        </div>
      </div>
    </AppProvider>
  );
}
