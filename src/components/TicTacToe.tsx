import React, { useState } from 'react';
import { Button } from "@/components/shadcn/ui/button";

const TicTacToe: React.FC = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const handleClick = (i: number) => {
    const boardCopy = [...board];
    if (calculateWinner(boardCopy) || boardCopy[i]) return;
    boardCopy[i] = xIsNext ? 'X' : 'O';
    setBoard(boardCopy);
    setXIsNext(!xIsNext);
  };

  const renderSquare = (i: number) => (
    <Button
      className="w-16 h-16 text-2xl font-bold"
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </Button>
  );

  const winner = calculateWinner(board);
  const status = winner
    ? `Winner: ${winner}`
    : `Next player: ${xIsNext ? 'X' : 'O'}`;

  return (
    <div className="flex flex-col items-center">
      <div className="mb-4 text-xl font-bold">{status}</div>
      <div className="grid grid-cols-3 gap-2">
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => renderSquare(i))}
      </div>
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