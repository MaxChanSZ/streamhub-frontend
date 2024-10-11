import React, { useState, useEffect } from 'react';
import { Button } from "@/components/shadcn/ui/button";

const MemoryGame: React.FC = () => {
  const [cards, setCards] = useState<string[]>([]);
  const [flipped, setFlipped] = useState<boolean[]>([]);
  const [solved, setSolved] = useState<boolean[]>([]);
  const [disabled, setDisabled] = useState(false);

  useEffect(() => {
    initializeGame();
  }, []);

  const initializeGame = () => {
    const emojis = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];
    const shuffledCards = [...emojis, ...emojis].sort(() => Math.random() - 0.5);
    setCards(shuffledCards);
    setFlipped(Array(16).fill(false));
    setSolved(Array(16).fill(false));
  };

  const handleClick = (index: number) => {
    if (disabled) return;

    setFlipped(prev => {
      const newFlipped = [...prev];
      newFlipped[index] = !newFlipped[index];
      return newFlipped;
    });

    setFlipped(newFlipped => {
      const flippedCards = newFlipped.reduce<number[]>((acc, cur, idx) => cur ? [...acc, idx] : acc, []);

      if (flippedCards.length === 2) {
        setDisabled(true);
        if (cards[flippedCards[0]] === cards[flippedCards[1]]) {
          setSolved(solved => {
            const newSolved = [...solved];
            newSolved[flippedCards[0]] = true;
            newSolved[flippedCards[1]] = true;
            return newSolved;
          });
          setDisabled(false);
        } else {
          setTimeout(() => {
            setFlipped(flipped => {
              const newFlipped = [...flipped];
              newFlipped[flippedCards[0]] = false;
              newFlipped[flippedCards[1]] = false;
              return newFlipped;
            });
            setDisabled(false);
          }, 1000);
        }
      }
      return newFlipped;
    });
  };

  return (
    <div className="flex flex-col items-center">
      <div className="grid grid-cols-4 gap-2">
        {cards.map((card, index) => (
          <Button
            key={index}
            onClick={() => handleClick(index)}
            disabled={flipped[index] || solved[index]}
            className="w-16 h-16 text-2xl"
          >
            {flipped[index] || solved[index] ? card : '?'}
          </Button>
        ))}
      </div>
      <Button onClick={initializeGame} className="mt-4">New Game</Button>
    </div>
  );
};

export default MemoryGame;