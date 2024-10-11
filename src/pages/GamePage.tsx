import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { Input } from "@/components/shadcn/ui/input";
import { Button } from "@/components/shadcn/ui/button";
import TicTacToe from '../components/TicTacToe';
import GuessTheNumber from '../components/GuessTheNumber';
import MemoryGame from '../components/MemoryGame';

const GamePage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const correctPassword = 'Kevin'; 

  useEffect(() => {
    const storedAuth = localStorage.getItem('gamePageAuth');
    if (storedAuth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === correctPassword) {
      setIsAuthenticated(true);
      localStorage.setItem('gamePageAuth', 'true');
    } else {
      alert('Incorrect password. Redirecting to home page.');
      window.location.href = '/';
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4 text-center">Enter Password to Access Games</h1>
        <form onSubmit={handlePasswordSubmit} className="w-full max-w-md">
          <div className="flex space-x-2">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              className="flex-grow"
            />
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-center">Mini Games</h1>
      <Tabs defaultValue="tictactoe" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="tictactoe">Tic Tac Toe</TabsTrigger>
          <TabsTrigger value="guessthenumber">Guess the Number</TabsTrigger>
          <TabsTrigger value="memorygame">Memory Game</TabsTrigger>
        </TabsList>
        <TabsContent value="tictactoe">
          <TicTacToe />
        </TabsContent>
        <TabsContent value="guessthenumber">
          <GuessTheNumber />
        </TabsContent>
        <TabsContent value="memorygame">
          <MemoryGame />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GamePage;