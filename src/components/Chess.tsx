import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Piece = 'P' | 'R' | 'N' | 'B' | 'Q' | 'K' | 'p' | 'r' | 'n' | 'b' | 'q' | 'k' | null;
type Board = Piece[][];

const initialBoard: Board = [
  ['R', 'N', 'B', 'Q', 'K', 'B', 'N', 'R'],
  ['P', 'P', 'P', 'P', 'P', 'P', 'P', 'P'],
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  Array(8).fill(null),
  ['p', 'p', 'p', 'p', 'p', 'p', 'p', 'p'],
  ['r', 'n', 'b', 'q', 'k', 'b', 'n', 'r'],
];

const ChessGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'white' | 'black'>('white');
  const [currentMove, setCurrentMove] = useState(0);

  const getPieceColor = (piece: Piece): 'white' | 'black' | null => {
    if (!piece) return null;
    return piece.toUpperCase() === piece ? 'white' : 'black';
  };

  const isValidMove = (from: [number, number], to: [number, number]): boolean => {
    const [fromRow, fromCol] = from;
    const [toRow, toCol] = to;
    const piece = board[fromRow][fromCol];
    const targetPiece = board[toRow][toCol];

    if (!piece || getPieceColor(piece) !== currentPlayer) return false;
    if (targetPiece && getPieceColor(targetPiece) === currentPlayer) return false;

    return true;
  };

  const handleSquareClick = (row: number, col: number) => {
    if (selectedPiece) {
      if (isValidMove(selectedPiece, [row, col])) {
        const newBoard = board.map(row => [...row]);
        const [fromRow, fromCol] = selectedPiece;
        newBoard[row][col] = newBoard[fromRow][fromCol];
        newBoard[fromRow][fromCol] = null;

        setBoard(newBoard);
        setSelectedPiece(null);
        setCurrentPlayer(currentPlayer === 'white' ? 'black' : 'white');
        setCurrentMove(currentMove + 1);
      } else {
        setSelectedPiece([row, col]);
      }
    } else {
      const piece = board[row][col];
      if (piece && getPieceColor(piece) === currentPlayer) {
        setSelectedPiece([row, col]);
      }
    }
  };

  const getPieceSymbol = (piece: Piece): string => {
    const symbols: { [key: string]: string } = {
      'P': '♙', 'R': '♖', 'N': '♘', 'B': '♗', 'Q': '♕', 'K': '♔',
      'p': '♟', 'r': '♜', 'n': '♞', 'b': '♝', 'q': '♛', 'k': '♚',
    };
    return piece ? symbols[piece] : '';
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Chess Game</h1>
      <div className="mb-6 text-2xl font-semibold">
        Current Player: <span className={`${currentPlayer === 'white' ? 'text-yellow-500' : 'text-gray-800'}`}>{currentPlayer}</span>
      </div>
      <div className="grid grid-cols-8 gap-1 border-4 border-gray-800 bg-gray-800 p-2">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 flex items-center justify-center text-5xl focus:outline-none
                ${((rowIndex + colIndex) % 2 === 0) ? 'bg-yellow-200' : 'bg-yellow-600'}
                ${selectedPiece && selectedPiece[0] === rowIndex && selectedPiece[1] === colIndex ? 'ring-4 ring-blue-500' : ''}
                hover:opacity-75 transition-all duration-200 ease-in-out transform hover:scale-105
              `}
              onClick={() => handleSquareClick(rowIndex, colIndex)}
            >
              {getPieceSymbol(piece)}
            </button>
          ))
        )}
      </div>
      <div className="mt-6 flex items-center space-x-4">
        <button onClick={() => {}} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ChevronLeft size={24} /></button>
        <span className="text-xl">Move: {currentMove}</span>
        <button onClick={() => {}} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ChevronRight size={24} /></button>
      </div>
    </div>
  );
};

export default ChessGame;