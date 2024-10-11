import React, { useState, useEffect } from 'react';
import { Button } from "@/components/shadcn/ui/button";
import { Input } from "@/components/shadcn/ui/input";

const GuessTheNumber: React.FC = () => {
  const [target, setTarget] = useState(0);
  const [guess, setGuess] = useState('');
  const [message, setMessage] = useState('');
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    resetGame();
  }, []);

  const resetGame = () => {
    setTarget(Math.floor(Math.random() * 100) + 1);
    setGuess('');
    setMessage('Guess a number between 1 and 100');
    setAttempts(0);
  };

  const handleGuess = () => {
    const guessNum = parseInt(guess);
    setAttempts(attempts + 1);

    if (isNaN(guessNum)) {
      setMessage('Please enter a valid number');
    } else if (guessNum === target) {
      setMessage(`Congratulations! You guessed it in ${attempts + 1} attempts.`);
    } else if (guessNum < target) {
      setMessage('Too low! Try again.');
    } else {
      setMessage('Too high! Try again.');
    }
  };

  return (
    <div className="flex flex-col items-center">
      <p className="mb-4 text-xl">{message}</p>
      <div className="flex gap-2 mb-4">
        <Input
          type="number"
          value={guess}
          onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setGuess(e.target.value)}
          placeholder="Enter your guess"
          className="w-40"
        />
        <Button onClick={handleGuess}>Guess</Button>
      </div>
      <Button onClick={resetGame}>New Game</Button>
    </div>
  );
};

export default GuessTheNumber;