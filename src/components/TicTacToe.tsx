import React, { useState } from 'react';
import { Button } from "@/components/shadcn/ui/button";

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState<Array<string | null>>(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [gameOver, setGameOver] = useState(false);

  const handleClick = (i: number) => {
    if (gameOver || board[i]) return;
    
    const boardCopy = [...board];
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    
    const winner = calculateWinner(boardCopy);
    if (winner) {
      setGameOver(true);
    } else if (boardCopy.every(square => square !== null)) {
      setGameOver(true);
    } else {
      setXIsNext(!xIsNext);
    }
  };

  const renderSquare = (i: number) => (
    <div
      className="w-16 h-16 flex items-center justify-center text-2xl font-bold text-white border border-white cursor-pointer"
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </div>
  );

  const winner = calculateWinner(board);
  let status;
  if (winner) {
    status = `Winner: ${winner}`;
  } else if (gameOver) {
    status = "It's a draw!";
  } else {
    status = `Next player: ${xIsNext ? 'X' : 'O'}`;
  }

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
    setGameOver(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <div className="mb-4 text-2xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-2 mb-4">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
      </div>
      <Button 
        className="mt-4 text-white bg-blue-600 hover:bg-blue-700"
        onClick={resetGame}
      >
        Reset Game
      </Button>
    </div>
  );
};

function calculateWinner(squares: Array<string | null>) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default TicTacToe;