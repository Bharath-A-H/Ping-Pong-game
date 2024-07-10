// src/App.js
import React from 'react';
import PingPongGame from './PingPongGame';
import './App.css';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>Ping Pong Game</h1>
        <PingPongGame />
      </header>
    </div>
  );
}

export default App;
