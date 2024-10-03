import React, { useState } from 'react';
import { Button } from "@/components/shadcn/ui/button";
import { useAppContext } from "@/contexts/AppContext";
import { User } from "@/utils/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/shadcn/ui/dialog";
import { Input } from "@/components/shadcn/ui/input";
import { toast } from "@/components/shadcn/ui/use-toast";

const WordleLoginButton: React.FC = () => {
  const { setIsLoggedIn, setUser } = useAppContext();
  const [isOpen, setIsOpen] = useState(false);
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [guesses, setGuesses] = useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = useState('');

  const fakeUsers: User[] = [
    { id: 9999, username: "maylwin.dev", email: "watergirl@example.com" },
    { id: 9998, username: "handythong.dev", email: "phantasm.wing@example.com" },
    { id: 9997, username: "max.dev", email: "arckey@example.com" },
    { id: 9996, username: "timothy.dev", email: "geishaboi@example.com" },
  ];

  const words = [
    { word: 'react', hint: 'A popular JavaScript library for building user interfaces' },
    { word: 'state', hint: 'Data that can change over time in a component' },
    { word: 'props', hint: 'How data is passed between components' },
    { word: 'hooks', hint: 'Functions that let you use state and other React features' },
    { word: 'redux', hint: 'A state management library for JavaScript apps' },
    { word: 'query', hint: 'A way to fetch and manage data in React applications' },
    { word: 'toast', hint: 'A non-disruptive message displayed to a user' },
    { word: 'modal', hint: 'A window that appears on top of the main content' },
  ];

  function pickRandomUser(): User {
    return fakeUsers[Math.floor(Math.random() * fakeUsers.length)];
  }

  const startGame = () => {
    const randomWord = words[Math.floor(Math.random() * words.length)];
    setWord(randomWord.word);
    setHint(randomWord.hint);
    setGuesses([]);
    setCurrentGuess('');
    setIsOpen(true);
  };

  const handleGuess = () => {
    if (currentGuess.length !== 5) {
      toast({ title: "Error", description: "Guess must be 5 letters long", variant: "destructive" });
      return;
    }

    const newGuesses = [...guesses, currentGuess];
    setGuesses(newGuesses);
    setCurrentGuess('');

    if (currentGuess === word) {
      const randomUser = pickRandomUser();
      setUser({
        id: randomUser.id,
        username: randomUser.username,
      });
      setIsLoggedIn(true);
      toast({ title: "Success", description: "You've won! Logged in successfully!" });
      setIsOpen(false);
    } else if (newGuesses.length >= 5) {
      toast({ title: "Game Over", description: `The word was: ${word}`, variant: "destructive" });
      setIsOpen(false);
    }
  };

  return (
    <>
      <button
        onClick={startGame}
        className="font-alatsi text-base text-blue-500 hover:text-blue-700 underline focus:outline-none"
      >
        Forgot Password?
      </button>
      <Dialog open={isOpen} onClose={() => setIsOpen(false)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-black">Wordle Password Recovery</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-black">
            <p>Guess the 5-letter word to log in. You have 5 guesses.</p>
            <p><strong>Hint:</strong> {hint}</p>
            <p>Guesses left: {5 - guesses.length}</p>
            {guesses.map((guess, index) => (
              <div key={index} className="flex space-x-1">
                {guess.split('').map((letter, i) => (
                  <div
                    key={i}
                    className={`w-10 h-10 flex items-center justify-center border border-black ${
                      letter === word[i]
                        ? 'bg-green-500'
                        : word.includes(letter)
                        ? 'bg-yellow-500'
                        : 'bg-gray-300'
                    } text-black`}
                  >
                    {letter}
                  </div>
                ))}
              </div>
            ))}
            <div className="flex space-x-1">
              {currentGuess.split('').concat(Array(5 - currentGuess.length).fill('')).map((letter, i) => (
                <div
                  key={i}
                  className="w-10 h-10 flex items-center justify-center border border-black bg-white text-black"
                >
                  {letter}
                </div>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={currentGuess}
                onChange={(e) => setCurrentGuess(e.target.value.toLowerCase())}
                maxLength={5}
                placeholder="Enter your guess"
                className="text-black"
              />
              <Button onClick={handleGuess} disabled={currentGuess.length !== 5}>
                Guess
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default WordleLoginButton;