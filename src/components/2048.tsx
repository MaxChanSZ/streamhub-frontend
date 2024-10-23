import React, { useState, useEffect } from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, RotateCcw } from 'lucide-react';

type Position = { row: number; col: number };

interface Tile {
  value: number;
  position: Position;
  previousPosition: Position | null;
  isNew: boolean;
  mergedFrom: Tile[] | null;
}

interface ScoreEntry {
  name: string;
  score: number;
}

const AnimatedScore: React.FC<{ score: number }> = ({ score }) => {
  const [displayScore, setDisplayScore] = useState(score);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (score !== displayScore) {
      setIsAnimating(true);
      const timer = setTimeout(() => {
        setDisplayScore(score);
        setIsAnimating(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [score, displayScore]);

  return (
    <div className={`text-2xl font-semibold text-indigo-800 transition-all duration-300 ${isAnimating ? 'scale-110 text-green-600' : ''}`}>
      Score: {displayScore}
    </div>
  );
};

const Game2048: React.FC = () => {
  const [board, setBoard] = useState<Tile[]>([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [showNameInput, setShowNameInput] = useState(true);
  const [scoreboard, setScoreboard] = useState<ScoreEntry[]>([]);

  useEffect(() => {
    const savedScoreboard = localStorage.getItem('2048_scoreboard');
    if (savedScoreboard) {
      setScoreboard(JSON.parse(savedScoreboard));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('2048_scoreboard', JSON.stringify(scoreboard));
  }, [scoreboard]);

  const initializeGame = () => {
    const newBoard: Tile[] = [];
    addNewTile(newBoard);
    addNewTile(newBoard);

    setTimeout(() => {
      setBoard(newBoard);
      setScore(0);
      setGameOver(false);
    }, 50);
  };

  const addNewTile = (tiles: Tile[]) => {
    const emptyPositions: Position[] = [];
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        if (!tiles.some(tile => tile.position.row === row && tile.position.col === col)) {
          emptyPositions.push({ row, col });
        }
      }
    }
    if (emptyPositions.length > 0) {
      const { row, col } = emptyPositions[Math.floor(Math.random() * emptyPositions.length)];
      const newTile: Tile = {
        value: Math.random() < 0.9 ? 2 : 4,
        position: { row, col },
        previousPosition: null,
        isNew: true,
        mergedFrom: null,
      };
      tiles.push(newTile);

      setTimeout(() => {
        const index = tiles.findIndex(t => t.position.row === row && t.position.col === col);
        if (index !== -1) {
          tiles[index] = { ...tiles[index], isNew: false };
          setBoard([...tiles]);
        }
      }, 100);
    }
  };
  
  const moveTiles = (direction: 'left' | 'right' | 'up' | 'down') => {
    const vector = getVector(direction);
    const traversals = buildTraversals(vector);
    let moved = false;
  
    const newBoard: Tile[] = [];
    const mergedPositions: Set<string> = new Set();
  
    traversals.x.forEach(x => {
      traversals.y.forEach(y => {
        const originalPosition: Position = { row: x, col: y };
        const tile = findTile(board, originalPosition);
  
        if (tile) {
          const { farthest, next } = findFarthestPosition(newBoard, tile, vector);
          const nextTile = findTile(newBoard, next);
  
          if (nextTile && nextTile.value === tile.value && !mergedPositions.has(`${next.row},${next.col}`)) {
            // Merge tiles
            const mergedTile: Tile = {
              value: tile.value * 2,
              position: next,
              previousPosition: tile.position,
              isNew: false,
              mergedFrom: [tile, nextTile],
            };
            newBoard.push(mergedTile);
            newBoard.splice(newBoard.findIndex(t => t === nextTile), 1);
            mergedPositions.add(`${next.row},${next.col}`);
            setScore(prevScore => prevScore + mergedTile.value);
            moved = true;
          } else {
            const movedTile: Tile = {
              ...tile,
              position: farthest,
              previousPosition: tile.position,
              isNew: false,
              mergedFrom: null,
            };
            newBoard.push(movedTile);
            moved = moved || (movedTile.position.row !== tile.position.row || movedTile.position.col !== tile.position.col);
          }
        }
      });
    });
  
    if (moved) {
      addNewTile(newBoard);
      setBoard(newBoard);
      if (isGameOver(newBoard)) {
        setGameOver(true);
        updateScoreboard();
      }
    }
  };

  const getVector = (direction: 'left' | 'right' | 'up' | 'down'): Position => {
    const map: { [key: string]: Position } = {
      up: { row: -1, col: 0 },
      right: { row: 0, col: 1 },
      down: { row: 1, col: 0 },
      left: { row: 0, col: -1 },
    };
    return map[direction];
  };

  const buildTraversals = (vector: Position) => {
    const traversals: { x: number[], y: number[] } = { x: [], y: [] };
    for (let i = 0; i < 4; i++) {
      traversals.x.push(i);
      traversals.y.push(i);
    }
    if (vector.col === 1) traversals.y = traversals.y.reverse();
    if (vector.row === 1) traversals.x = traversals.x.reverse();
    return traversals;
  };

  const findTile = (tiles: Tile[], position: Position): Tile | undefined => {
    return tiles.find(tile => tile.position.row === position.row && tile.position.col === position.col);
  };

  const findFarthestPosition = (tiles: Tile[], tile: Tile, vector: Position) => {
    let previous: Position;
    let position = { ...tile.position };
    do {
      previous = { ...position };
      position = {
        row: position.row + vector.row,
        col: position.col + vector.col,
      };
    } while (isWithinBounds(position) && !findTile(tiles, position));
  
    return {
      farthest: previous,
      next: position,
    };
  };  

  const isWithinBounds = (position: Position): boolean => {
    return position.row >= 0 && position.row < 4 && position.col >= 0 && position.col < 4;
  };

  const isGameOver = (tiles: Tile[]): boolean => {
    if (tiles.length < 16) return false;
    for (let i = 0; i < tiles.length; i++) {
      const tile = tiles[i];
      for (const vector of [{ row: 0, col: 1 }, { row: 1, col: 0 }]) {
        const adjacent: Position = {
          row: tile.position.row + vector.row,
          col: tile.position.col + vector.col,
        };
        const adjacentTile = findTile(tiles, adjacent);
        if (adjacentTile && adjacentTile.value === tile.value) {
          return false;
        }
      }
    }
    return true;
  };

  const handleKeyDown = (event: KeyboardEvent) => {
    if (gameOver || showNameInput) return;
    
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) {
      event.preventDefault();
      
      switch (event.key) {
        case 'ArrowLeft':
          moveTiles('left');
          break;
        case 'ArrowRight':
          moveTiles('right');
          break;
        case 'ArrowUp':
          moveTiles('up');
          break;
        case 'ArrowDown':
          moveTiles('down');
          break;
      }
    }
  };
  
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [board, gameOver, showNameInput]);

  const getTileColor = (value: number): string => {
    const colors: { [key: number]: string } = {
      2: 'bg-blue-200 text-blue-800',
      4: 'bg-green-200 text-green-800',
      8: 'bg-yellow-200 text-yellow-800',
      16: 'bg-orange-200 text-orange-800',
      32: 'bg-red-200 text-red-800',
      64: 'bg-purple-200 text-purple-800',
      128: 'bg-indigo-200 text-indigo-800',
      256: 'bg-pink-200 text-pink-800',
      512: 'bg-teal-200 text-teal-800',
      1024: 'bg-cyan-200 text-cyan-800',
      2048: 'bg-yellow-400 text-yellow-900',
    };
    return colors[value] || 'bg-gray-300 text-gray-800';
  };

  const handleNameSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (playerName.trim()) {
      setShowNameInput(false);
      initializeGame();
    }
  };

  const updateScoreboard = () => {
    const newEntry: ScoreEntry = { name: playerName, score };
    const newScoreboard = [...scoreboard, newEntry].sort((a, b) => b.score - a.score).slice(0, 10);
    setScoreboard(newScoreboard);
  };

  const resetGame = () => {
    setShowNameInput(true);
    setPlayerName('');
    setScore(0);
    setGameOver(false);
    setBoard([]);
  };

  if (showNameInput) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
        <h1 className="text-4xl font-bold mb-6 text-indigo-600">2048 Game</h1>
        <form onSubmit={handleNameSubmit} className="flex flex-col items-center">
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            placeholder="Enter your name"
            className="p-2 border border-gray-300 rounded mb-4 text-center"
          />
          <button type="submit" className="p-2 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition-colors">
            Start Game
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <h1 className="text-4xl font-bold mb-6 text-indigo-600">2048 Game</h1>
      <div className="text-xl mb-4">Player: {playerName}</div>
      <AnimatedScore score={score} />
      <div className="relative w-80 h-80 bg-indigo-100 p-2 rounded-lg shadow-lg mt-4">
        {board.map((tile, index) => (
          <div
            key={index}
            className={`absolute w-18 h-18 flex items-center justify-center text-2xl font-bold rounded-lg shadow transition-all duration-200 ${getTileColor(tile.value)}`}
            style={{
              top: `${tile.position.row * 25}%`,
              left: `${tile.position.col * 25}%`,
              width: '23%',
              height: '23%',
              opacity: tile.isNew ? 0 : 1,
              transform: tile.isNew 
                ? 'scale(0)' 
                : tile.mergedFrom 
                  ? 'scale(1.1)' 
                  : 'scale(1)',
              transition: 'all 0.15s ease-in-out, top 0.15s ease-in-out, left 0.15s ease-in-out, opacity 0.15s ease-in-out',
              zIndex: tile.value,
            }}
          >
            {tile.value}
          </div>
        ))}
      </div>
      <div className="mt-6 grid grid-cols-3 gap-4">
        <div></div>
        <button onClick={() => moveTiles('up')} className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <ArrowUp size={24} />
        </button>
        <div></div>
        <button onClick={() => moveTiles('left')} className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <ArrowLeft size={24} />
        </button>
        <button onClick={() => moveTiles('down')} className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <ArrowDown size={24} />
        </button>
        <button onClick={() => moveTiles('right')} className="p-3 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-400">
          <ArrowRight size={24} />
        </button>
      </div>
      <button 
        onClick={resetGame} 
        className="mt-6 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-green-400 flex items-center"
      >
        <RotateCcw size={20} className="mr-2" /> New Game
      </button>
      {gameOver && (
        <div className="mt-6 text-2xl font-bold text-red-600">Game Over!</div>
      )}
      <div className="mt-8 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-indigo-600">Scoreboard</h2>
        <table className="w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-indigo-500 text-white">
            <tr>
              <th className="py-2 px-4 text-left">Rank</th>
              <th className="py-2 px-4 text-left">Name</th>
              <th className="py-2 px-4 text-right">Score</th>
            </tr>
          </thead>
          <tbody>
            {scoreboard.map((entry, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-gray-100' : 'bg-white'}>
                <td className="py-2 px-4">{index + 1}</td>
                <td className="py-2 px-4">{entry.name}</td>
                <td className="py-2 px-4 text-right">{entry.score}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
  };
  
export default Game2048;