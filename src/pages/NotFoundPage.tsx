import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const DinoGame: React.FC = () => {
  const [gameStarted, setGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [isJumping, setIsJumping] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const dinoRef = useRef<HTMLDivElement>(null);
  const obstacleRef = useRef<HTMLDivElement>(null);
  const gameAreaRef = useRef<HTMLDivElement>(null);

  const dinoSymbol = "🦖";
  const obstacleSymbols = ["🌵"];

  useEffect(() => {
    if (gameStarted && !gameOver) {
      const gameLoop = setInterval(() => {
        if (dinoRef.current && obstacleRef.current) {
          const dinoRect = dinoRef.current.getBoundingClientRect();
          const obstacleRect = obstacleRef.current.getBoundingClientRect();

          if (
            dinoRect.right > obstacleRect.left &&
            dinoRect.left < obstacleRect.right &&
            dinoRect.bottom > obstacleRect.top
          ) {
            setGameOver(true);
            clearInterval(gameLoop);
          } else {
            setScore((prevScore) => prevScore + 1);
          }
        }
      }, 100);

      return () => clearInterval(gameLoop);
    }
  }, [gameStarted, gameOver]);

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setGameOver(false);
  };

  const jump = () => {
    if (!isJumping && gameStarted && !gameOver) {
      setIsJumping(true);
      setTimeout(() => setIsJumping(false), 500);
    }
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.code === 'Space') {
      if (!gameStarted) {
        startGame();
      } else {
        jump();
      }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStarted, isJumping, gameOver]);

  return (
    <div 
      ref={gameAreaRef}
      className="w-full h-64 bg-gradient-to-b from-blue-300 to-blue-500 relative overflow-hidden cursor-pointer rounded-lg shadow-lg"
      onClick={gameStarted ? jump : startGame}
    >
      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-green-700 to-green-500" />
      <div 
        ref={dinoRef}
        className={`absolute left-16 bottom-16 text-6xl transition-all duration-500 ${isJumping ? 'transform -translate-y-24' : ''}`}
        style={{ transform: `scaleX(-1) ${isJumping ? 'translateY(-6rem)' : ''}` }}
      >
        {dinoSymbol}
      </div>
      {gameStarted && !gameOver && (
        <div 
          ref={obstacleRef}
          className="absolute bottom-16 right-0 text-6xl animate-obstacle"
        >
          {obstacleSymbols[Math.floor(Math.random() * obstacleSymbols.length)]}
        </div>
      )}
      <div className="absolute top-4 right-4 text-white font-bold bg-blue-600 px-3 py-1 rounded-full shadow">
        Score: {score}
      </div>
      {!gameStarted && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center bg-blue-600 p-4 rounded-lg shadow-lg">
          <p className="mb-2 font-bold text-xl">Dino Jump</p>
          <p className="mb-2">Press Space or Click to start</p>
        </div>
      )}
      {gameOver && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-white text-center bg-blue-600 p-6 rounded-lg shadow-lg">
          <p className="mb-2 font-bold text-2xl">Game Over!</p>
          <p className="mb-4 text-xl">Score: {score}</p>
          <button 
            onClick={startGame}
            className="px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors text-lg font-semibold"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-[#08081d] to-[#1a1a3a] text-white p-4">
      <h1 className="text-6xl font-bold mb-4 text-center">404</h1>
      <p className="text-xl mb-2 text-center">Oops! Page not found.</p>
      <p className="text-md text-gray-400 mb-8 text-center">
        The requested URL was not found. But don't worry, you can play a game while you're here!
      </p>
      <div className="w-full max-w-lg">
        <DinoGame />
      </div>
      <button
        onClick={() => navigate("/")}
        className="mt-8 px-6 py-3 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition-colors text-lg font-semibold"
      >
        Go Home
      </button>
    </div>
  );
};

export default NotFoundPage;