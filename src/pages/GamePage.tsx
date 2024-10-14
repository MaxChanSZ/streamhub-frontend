import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/shadcn/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/shadcn/ui/card";
import { Gamepad2, Dices, Grid3X3, Calculator } from 'lucide-react';
import TicTacToe from '../components/TicTacToe';
import Checkers from '../components/Checkers';
import Tetris from '../components/Tetris';
import Game2048 from '../components/2048';

const GamePage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-indigo-900 text-white">
      <div className="container mx-auto p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
            Mini Games Arcade
          </h1>
          <p className="text-xl text-gray-300">Select a game and start playing!</p>
        </header>

        <Tabs defaultValue="tictactoe" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="tictactoe" className="text-lg flex items-center justify-center">
              <Grid3X3 className="mr-2" /> Tic Tac Toe
            </TabsTrigger>
            <TabsTrigger value="checkers" className="text-lg flex items-center justify-center">
              <Gamepad2 className="mr-2" /> Checkers
            </TabsTrigger>
            <TabsTrigger value="tetris" className="text-lg flex items-center justify-center">
              <Dices className="mr-2" /> Tetris
            </TabsTrigger>
            <TabsTrigger value="2048" className="text-lg flex items-center justify-center">
              <Calculator className="mr-2" /> 2048
            </TabsTrigger>
          </TabsList>

          <div className="game-content bg-gray-800 p-6 rounded-lg shadow-lg">
            <TabsContent value="tictactoe">
              <Card>
                <CardHeader>
                  <CardTitle>Tic Tac Toe</CardTitle>
                  <CardDescription>Classic 3x3 grid game. Get three in a row to win!</CardDescription>
                </CardHeader>
                <CardContent>
                  <TicTacToe />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="checkers">
              <Card>
                <CardHeader>
                  <CardTitle>Checkers</CardTitle>
                  <CardDescription>Strategic board game for two players.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Checkers />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="tetris">
              <Card>
                <CardHeader>
                  <CardTitle>Tetris</CardTitle>
                  <CardDescription>Arrange falling blocks to clear lines!</CardDescription>
                </CardHeader>
                <CardContent>
                  <Tetris />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="2048">
              <Card>
                <CardHeader>
                  <CardTitle>2048</CardTitle>
                  <CardDescription>Merge tiles to reach 2048!</CardDescription>
                </CardHeader>
                <CardContent>
                  <Game2048 />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
};

export default GamePage;