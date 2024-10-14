import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Redo } from 'lucide-react';

type Board = number[][];

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Board>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const newBoard = Array(4).fill(null).map(() => Array(4).fill(0));
    addNewTile(newBoard);
    addNewTile(newBoard);
    setBoard(newBoard);
    setScore(0);
    setGameOver(false);
  };

  const addNewTile = (board: Board) => {
    const emptyTiles = [];
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) {
          emptyTiles.push([i, j]);
        }
      }
    }
    if (emptyTiles.length > 0) {
      const [row, col] = emptyTiles[Math.floor(Math.random() * emptyTiles.length)];
      board[row][col] = Math.random() < 0.9 ? 2 : 4;
    }
  };

  const moveLeft = (board: Board): [Board, number] => {
    let score = 0;
    const newBoard = board.map(row => {
      const newRow = row.filter(cell => cell !== 0);
      for (let i = 0; i < newRow.length - 1; i++) {
        if (newRow[i] === newRow[i + 1]) {
          newRow[i] *= 2;
          score += newRow[i];
          newRow.splice(i + 1, 1);
        }
      }
      while (newRow.length < 4) {
        newRow.push(0);
      }
      return newRow;
    });
    return [newBoard, score];
  };

  const rotate = (board: Board): Board => {
    return board[0].map((_, index) => board.map(row => row[index]).reverse());
  };

  const move = (direction: 'left' | 'right' | 'up' | 'down') => {
    let rotations = 0;
    if (direction === 'up') rotations = 1;
    if (direction === 'right') rotations = 2;
    if (direction === 'down') rotations = 3;

    let newBoard = [...board];
    for (let i = 0; i < rotations; i++) {
      newBoard = rotate(newBoard);
    }

    const [movedBoard, moveScore] = moveLeft(newBoard);
    for (let i = 0; i < (4 - rotations) % 4; i++) {
      newBoard = rotate(movedBoard);
    }

    if (JSON.stringify(board) !== JSON.stringify(newBoard)) {
      addNewTile(newBoard);
      setBoard(newBoard);
      setScore(prevScore => prevScore + moveScore);
      if (isGameOver(newBoard)) {
        setGameOver(true);
      }
    }
  };

  const isGameOver = (board: Board): boolean => {
    // Check for any empty cells
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (board[i][j] === 0) return false;
      }
    }

    // Check for any possible merges
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 4; j++) {
        if (
          (i < 3 && board[i][j] === board[i + 1][j]) ||
          (j < 3 && board[i][j] === board[i][j + 1])
        ) {
          return false;
        }
      }
    }

    return true;
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (gameOver) return;
    switch (event.key) {
      case 'ArrowLeft':
        move('left');
        break;
      case 'ArrowRight':
        move('right');
        break;
      case 'ArrowUp':
        move('up');
        break;
      case 'ArrowDown':
        move('down');
        break;
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown as any);
    return () => {
      window.removeEventListener('keydown', handleKeyDown as any);
    };
  }, [board, gameOver]);

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-yellow-200',
      4: 'bg-yellow-300',
      8: 'bg-orange-300',
      16: 'bg-orange-400',
      32: 'bg-red-400',
      64: 'bg-red-500',
      128: 'bg-yellow-400',
      256: 'bg-yellow-500',
      512: 'bg-yellow-600',
      1024: 'bg-yellow-700',
      2048: 'bg-yellow-800',
    };
    return colors[value] || 'bg-gray-300';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">2048 Game</h1>
      <div className="mb-4 text-2xl font-semibold">Score: {score}</div>
      <div className="grid grid-cols-4 gap-2 bg-gray-300 p-2 rounded">
        {board.map((row, i) =>
          row.map((cell, j) => (
            <div
              key={`${i}-${j}`}
              className={`w-16 h-16 flex items-center justify-center text-2xl font-bold rounded ${getTileColor(cell)}`}
            >
              {cell !== 0 && cell}
            </div>
          ))
        )}
      </div>
      <div className="mt-4 flex space-x-2">
        <button onClick={() => move('left')} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ArrowLeft size={24} /></button>
        <button onClick={() => move('right')} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ArrowRight size={24} /></button>
        <button onClick={() => move('up')} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ArrowUp size={24} /></button>
        <button onClick={() => move('down')} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ArrowDown size={24} /></button>
      </div>
      <button onClick={initializeGame} className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center">
        <Redo size={20} className="mr-2" /> New Game
      </button>
      {gameOver && (
        <div className="mt-4 text-2xl font-bold text-red-500">Game Over!</div>
      )}
    </div>
  );
};

export default Game2048;