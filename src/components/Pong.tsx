import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/shadcn/ui/button";

interface Ball {
  x: number;
  y: number;
  dx: number;
  dy: number;
}

interface Block {
  x: number;
  y: number;
  width: number;
  height: number;
}

const Pong: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState({ player1: 0, player2: 0 });

  const [paddle1, setPaddle1] = useState({ y: 150, dy: 0 });
  const [paddle2, setPaddle2] = useState({ y: 150, dy: 0 });
  const [balls, setBalls] = useState<Ball[]>([{ x: 300, y: 200, dx: 5, dy: 5 }]);
  const [blocks, setBlocks] = useState<Block[]>([]);

  const [keys, setKeys] = useState({
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false,
  });

  useEffect(() => {
    // Initialize blocks
    const newBlocks: Block[] = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        newBlocks.push({
          x: 250 + i * 20,
          y: 50 + j * 40,
          width: 15,
          height: 30,
        });
      }
    }
    setBlocks(newBlocks);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext('2d');
    if (!context) return;

    const gameLoop = setInterval(() => {
      if (gameOver) return;

      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Move paddles based on key states
      setPaddle1(prev => ({
        ...prev,
        dy: keys.w ? -5 : keys.s ? 5 : 0,
        y: Math.max(0, Math.min(prev.y + (keys.w ? -5 : keys.s ? 5 : 0), canvas.height - 100))
      }));
      setPaddle2(prev => ({
        ...prev,
        dy: keys.ArrowUp ? -5 : keys.ArrowDown ? 5 : 0,
        y: Math.max(0, Math.min(prev.y + (keys.ArrowUp ? -5 : keys.ArrowDown ? 5 : 0), canvas.height - 100))
      }));

      // Draw paddles
      context.fillStyle = 'white';
      context.fillRect(10, paddle1.y, 10, 100);
      context.fillRect(580, paddle2.y, 10, 100);

      // Draw player indicators
      context.font = '14px Arial';
      context.fillText('W/S', 15, 20);
      context.fillText('↑/↓', 565, 20);

      // Draw and update balls
      setBalls(prevBalls => 
        prevBalls.map(ball => {
          const newBall = { ...ball };

          // Ball collision with top and bottom
          if (newBall.y <= 0 || newBall.y >= canvas.height) {
            newBall.dy = -newBall.dy;
          }

          // Ball collision with paddles
          if (
            (newBall.x <= 20 && newBall.y > paddle1.y && newBall.y < paddle1.y + 100) ||
            (newBall.x >= 570 && newBall.y > paddle2.y && newBall.y < paddle2.y + 100)
          ) {
            newBall.dx = -newBall.dx;
          }

          // Ball collision with blocks
          blocks.forEach((block, index) => {
            if (
              newBall.x + 5 > block.x &&
              newBall.x - 5 < block.x + block.width &&
              newBall.y + 5 > block.y &&
              newBall.y - 5 < block.y + block.height
            ) {
              newBall.dx = -newBall.dx;
              setBlocks(prev => prev.filter((_, i) => i !== index));
              if (Math.random() < 0.5) {
                return [newBall, { ...newBall, dy: -newBall.dy }];
              }
            }
          });

          // Update ball position
          newBall.x += newBall.dx;
          newBall.y += newBall.dy;

          // Draw ball
          context.beginPath();
          context.arc(newBall.x, newBall.y, 5, 0, Math.PI * 2);
          context.fill();

          return newBall;
        }).flat()
      );

      // Draw blocks
      blocks.forEach(block => {
        context.fillStyle = 'red';
        context.fillRect(block.x, block.y, block.width, block.height);
      });

      // Check for scoring
      balls.forEach(ball => {
        if (ball.x <= 0) {
          setScore(prev => ({ ...prev, player2: prev.player2 + 1 }));
          resetBall(ball);
        } else if (ball.x >= canvas.width) {
          setScore(prev => ({ ...prev, player1: prev.player1 + 1 }));
          resetBall(ball);
        }
      });

      // Draw score
      context.fillStyle = 'white';
      context.font = '24px Arial';
      context.fillText(`${score.player1} - ${score.player2}`, canvas.width / 2 - 30, 30);

    }, 1000 / 60);  // 60 FPS

    return () => clearInterval(gameLoop);
  }, [gameOver, paddle1, paddle2, balls, blocks, score, keys]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) {
        e.preventDefault();
        setKeys(prev => ({ ...prev, [e.key]: true }));
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'w', 's'].includes(e.key)) {
        setKeys(prev => ({ ...prev, [e.key]: false }));
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const resetBall = (ball: Ball) => {
    ball.x = 300;
    ball.y = 200;
    ball.dx = Math.random() > 0.5 ? 5 : -5;
    ball.dy = Math.random() > 0.5 ? 5 : -5;
  };

  const resetGame = () => {
    setGameOver(false);
    setScore({ player1: 0, player2: 0 });
    setPaddle1({ y: 150, dy: 0 });
    setPaddle2({ y: 150, dy: 0 });
    setBalls([{ x: 300, y: 200, dx: 5, dy: 5 }]);
    const newBlocks: Block[] = [];
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 8; j++) {
        newBlocks.push({
          x: 250 + i * 20,
          y: 50 + j * 40,
          width: 15,
          height: 30,
        });
      }
    }
    setBlocks(newBlocks);
    setKeys({ w: false, s: false, ArrowUp: false, ArrowDown: false });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white">
      <canvas ref={canvasRef} width={600} height={400} className="border border-white" />
      <div className="mt-4">
        <p>Player 1 (Left): W (up) / S (down)</p>
        <p>Player 2 (Right): ↑ (up) / ↓ (down)</p>
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

export default Pong;