import React, { useState, useEffect, useRef } from 'react';
import './PingPongGame.css';

const PingPongGame = () => {
  const canvasRef = useRef(null);
  const [paddle1Y, setPaddle1Y] = useState(200);
  const [paddle2Y, setPaddle2Y] = useState(200);
  const [ballX, setBallX] = useState(300);
  const [ballY, setBallY] = useState(200);
  const [ballSpeedX, setBallSpeedX] = useState(5);
  const [ballSpeedY, setBallSpeedY] = useState(5);
  const [isRunning, setIsRunning] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);
  const [winner, setWinner] = useState('');
  const [player1Score, setPlayer1Score] = useState(0);
  const [player2Score, setPlayer2Score] = useState(0);
  const [rounds, setRounds] = useState(0);

  const PADDLE_HEIGHT = 100;
  const PADDLE_WIDTH = 10;
  const BALL_SIZE = 10;
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 400;

  const draw = (ctx) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, paddle1Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillRect(CANVAS_WIDTH - PADDLE_WIDTH, paddle2Y, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.beginPath();
    ctx.arc(ballX, ballY, BALL_SIZE, 0, 2 * Math.PI);
    ctx.fill();
  };

  const moveBall = () => {
    let newBallX = ballX + ballSpeedX;
    let newBallY = ballY + ballSpeedY;

    if (newBallY < BALL_SIZE || newBallY > CANVAS_HEIGHT - BALL_SIZE) {
      setBallSpeedY(-ballSpeedY);
    }

    if (newBallX < PADDLE_WIDTH && newBallY > paddle1Y && newBallY < paddle1Y + PADDLE_HEIGHT) {
      setBallSpeedX(-ballSpeedX);
    } else if (newBallX > CANVAS_WIDTH - PADDLE_WIDTH && newBallY > paddle2Y && newBallY < paddle2Y + PADDLE_HEIGHT) {
      setBallSpeedX(-ballSpeedX);
    } else if (newBallX < 0) {
      endRound('Player 2');
    } else if (newBallX > CANVAS_WIDTH) {
      endRound('Player 1');
    } else {
      setBallX(newBallX);
      setBallY(newBallY);
    }
  };

  const handleKeyDown = (e) => {
    switch (e.key) {
      case 'ArrowUp':
        setPaddle2Y((prev) => Math.max(prev - 20, 0));
        break;
      case 'ArrowDown':
        setPaddle2Y((prev) => Math.min(prev + 20, CANVAS_HEIGHT - PADDLE_HEIGHT));
        break;
      case 'w':
        setPaddle1Y((prev) => Math.max(prev - 20, 0));
        break;
      case 's':
        setPaddle1Y((prev) => Math.min(prev + 20, CANVAS_HEIGHT - PADDLE_HEIGHT));
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (isRunning) {
      const intervalId = setInterval(() => {
        moveBall();
        draw(ctx);
      }, 30);
      return () => clearInterval(intervalId);
    }
  }, [isRunning, ballX, ballY, paddle1Y, paddle2Y]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const startGame = () => {
    if (isGameOver) {
      resetGame();
    }
    setIsRunning(true);
  };

  const stopGame = () => setIsRunning(false);

  const resetGame = () => {
    setPaddle1Y(200);
    setPaddle2Y(200);
    setBallX(300);
    setBallY(200);
    setBallSpeedX(5);
    setBallSpeedY(5);
  };

  const restartGame = () => {
    setIsRunning(false);
    setIsGameOver(false);
    setPlayer1Score(0);
    setPlayer2Score(0);
    setRounds(0);
    setWinner('');
    resetGame();
    setIsRunning(true);
  };

  const endRound = (winningPlayer) => {
    setIsRunning(false);
    setRounds((prev) => prev + 1);

    if (winningPlayer === 'Player 1') {
      setPlayer1Score((prev) => prev + 1);
    } else {
      setPlayer2Score((prev) => prev + 1);
    }

    if (rounds + 1 >= 3) {
      setIsGameOver(true);
      if (player1Score === player2Score) {
        setWinner('Tie');
      } else if (player1Score > player2Score) {
        setWinner('Player 1');
      } else {
        setWinner('Player 2');
      }
    } else {
      resetGame();
      setIsRunning(true);
    }
  };

  return (
    <div className="game-container">
      <div className="player-names">
        <div className="player player1">Player 1: {player1Score}</div>
        <div className="player player2">Player 2: {player2Score}</div>
      </div>
      <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} />
      {isGameOver && (
        <div className="game-over">
          <h1>Game Over</h1>
          <h2>{player1Score === player2Score ? "It's a Tie!" : `${player1Score > player2Score ? 'Player 1 Wins!' : 'Player 2 Wins!'}`}</h2>
        </div>
      )}
      <div className="controls">
        <button onClick={startGame}>{isRunning ? 'Resume' : 'Start'}</button>
        <button onClick={stopGame}>Stop</button>
        <button onClick={restartGame}>Restart</button>
      </div>
    </div>
  );
};

export default PingPongGame;
