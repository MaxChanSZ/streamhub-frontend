import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

type Piece = 'r' | 'b' | 'R' | 'B' | null;
type Board = Piece[][];
type Move = { from: [number, number]; to: [number, number]; captured: [number, number][] };

const initialBoard: Board = [
  [null, 'r', null, 'r', null, 'r', null, 'r'],
  ['r', null, 'r', null, 'r', null, 'r', null],
  [null, 'r', null, 'r', null, 'r', null, 'r'],
  [null, null, null, null, null, null, null, null],
  [null, null, null, null, null, null, null, null],
  ['b', null, 'b', null, 'b', null, 'b', null],
  [null, 'b', null, 'b', null, 'b', null, 'b'],
  ['b', null, 'b', null, 'b', null, 'b', null],
];

const CheckersGame: React.FC = () => {
  const [board, setBoard] = useState<Board>(initialBoard);
  const [selectedPiece, setSelectedPiece] = useState<[number, number] | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<'red' | 'black'>('red');
  const [moveHistory, setMoveHistory] = useState<Move[]>([]);
  const [currentMove, setCurrentMove] = useState(0);
  const [jumpInProgress, setJumpInProgress] = useState(false);

  const isKing = (piece: Piece): boolean => piece === 'R' || piece === 'B';

  const getValidMoves = (row: number, col: number, jumpOnly: boolean = false): [number, number][] => {
    const piece = board[row][col];
    if (!piece) return [];

    const moves: [number, number][] = [];
    const directions = isKing(piece) ? [-1, 1] : piece.toLowerCase() === 'r' ? [1] : [-1];

    const checkJump = (dRow: number, dCol: number) => {
      const newRow = row + dRow * 2;
      const newCol = col + dCol * 2;
      const jumpedRow = row + dRow;
      const jumpedCol = col + dCol;

      if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
        const jumpedPiece = board[jumpedRow][jumpedCol];
        if (jumpedPiece && jumpedPiece.toLowerCase() !== piece.toLowerCase() && !board[newRow][newCol]) {
          moves.push([newRow, newCol]);
        }
      }
    };

    directions.forEach(dRow => {
      [-1, 1].forEach(dCol => {
        if (!jumpOnly) {
          const newRow = row + dRow;
          const newCol = col + dCol;
          if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8 && !board[newRow][newCol]) {
            moves.push([newRow, newCol]);
          }
        }
        checkJump(dRow, dCol);
      });
    });

    console.log(`Valid moves for piece at [${row}, ${col}]:`, moves);
    return jumpOnly ? moves.filter(([r, _]) => Math.abs(r - row) === 2) : moves;
  };

  const handleSquareClick = (row: number, col: number) => {
    console.log(`Clicked square: [${row}, ${col}]`);
    console.log('Current board state:', board);
    console.log('Selected piece:', selectedPiece);

    if (selectedPiece) {
      const [selectedRow, selectedCol] = selectedPiece;
      const validMoves = getValidMoves(selectedRow, selectedCol, jumpInProgress);
      const isValidMove = validMoves.some(([r, c]) => r === row && c === col);

      console.log('Is valid move:', isValidMove);

      if (isValidMove) {
        const newBoard = board.map(row => [...row]);
        const piece = newBoard[selectedRow][selectedCol];
        newBoard[row][col] = piece;
        newBoard[selectedRow][selectedCol] = null;

        const captured: [number, number][] = [];
        if (Math.abs(row - selectedRow) === 2) {
          const capturedRow = (row + selectedRow) / 2;
          const capturedCol = (col + selectedCol) / 2;
          newBoard[capturedRow][capturedCol] = null;
          captured.push([capturedRow, capturedCol]);
        }

        // King promotion
        if ((piece === 'r' && row === 7) || (piece === 'b' && row === 0)) {
          newBoard[row][col] = piece.toUpperCase() as Piece;
        }

        const newMove: Move = {
          from: [selectedRow, selectedCol],
          to: [row, col],
          captured
        };

        console.log('New board state:', newBoard);
        console.log('New move:', newMove);

        setBoard(newBoard);
        setMoveHistory([...moveHistory.slice(0, currentMove), newMove]);
        setCurrentMove(currentMove + 1);

        // Check for additional jumps
        const additionalJumps = getValidMoves(row, col, true);
        if (additionalJumps.length > 0 && captured.length > 0) {
          setSelectedPiece([row, col]);
          setJumpInProgress(true);
        } else {
          setSelectedPiece(null);
          setCurrentPlayer(currentPlayer === 'red' ? 'black' : 'red');
          setJumpInProgress(false);
        }
      } else {
        setSelectedPiece(null);
        setJumpInProgress(false);
      }
    } else {
      const piece = board[row][col];
      if (piece && ((piece.toLowerCase() === 'r' && currentPlayer === 'red') || (piece.toLowerCase() === 'b' && currentPlayer === 'black'))) {
        setSelectedPiece([row, col]);
      }
    }
  };

  const getPieceSymbol = (piece: Piece): string => {
    const symbols: { [key: string]: string } = {
      'r': '🔴', 'b': '⚫', 'R': '👑🔴', 'B': '👑⚫'
    };
    return piece ? symbols[piece] : '';
  };

  const goToMove = (moveIndex: number) => {
    if (moveIndex < 0 || moveIndex > moveHistory.length) return;

    let newBoard = initialBoard.map(row => [...row]);
    for (let i = 0; i < moveIndex; i++) {
      const move = moveHistory[i];
      const piece = newBoard[move.from[0]][move.from[1]];
      newBoard[move.to[0]][move.to[1]] = piece;
      newBoard[move.from[0]][move.from[1]] = null;
      move.captured.forEach(([capturedRow, capturedCol]) => {
        newBoard[capturedRow][capturedCol] = null;
      });
      // King promotion
      if ((piece === 'r' && move.to[0] === 7) || (piece === 'b' && move.to[0] === 0)) {
        newBoard[move.to[0]][move.to[1]] = piece.toUpperCase() as Piece;
      }
    }

    setBoard(newBoard);
    setCurrentMove(moveIndex);
    setCurrentPlayer(moveIndex % 2 === 0 ? 'red' : 'black');
    setSelectedPiece(null);
    setJumpInProgress(false);
  };

  useEffect(() => {
    console.log('Current player:', currentPlayer);
    console.log('Current board state:', board);
  }, [currentPlayer, board]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6">Checkers Game</h1>
      <div className="mb-6 text-2xl font-semibold">
        Current Player: <span className={`${currentPlayer === 'red' ? 'text-red-500' : 'text-gray-800'}`}>{currentPlayer}</span>
      </div>
      <div className="grid grid-cols-8 gap-1 border-4 border-gray-800 bg-gray-800 p-2">
        {board.map((row, rowIndex) =>
          row.map((piece, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              className={`w-16 h-16 flex items-center justify-center text-4xl focus:outline-none
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
        <button onClick={() => goToMove(currentMove - 1)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ChevronLeft size={24} /></button>
        <span className="text-xl">Move: {currentMove}</span>
        <button onClick={() => goToMove(currentMove + 1)} className="p-2 bg-gray-200 rounded hover:bg-gray-300 transition-colors"><ChevronRight size={24} /></button>
      </div>
    </div>
  );
};

export default CheckersGame;