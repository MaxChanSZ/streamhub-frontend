import React from 'react';
import inceptionImage from '../images/inception.jpg';
import matrixImage from '../images/matrix.jpg';
import interstellarImage from '../images/interstellar.jpg';
import bladerunnerImage from '../images/bladeRunner.jpg';

type MovieOption = {
  name: string;
  votes: number;
  description: string;
  image: string;
};

type Poll = {
  question: string;
  options: MovieOption[];
};

// Mock data for movie poll
const pollData: Poll = {
    question: "What's your favorite sci-fi movie?",
    options: [
      {
        name: 'Inception',
        votes: 45,
        description: 'A thief who enters the dreams of others to steal secrets from their subconscious.',
        image: inceptionImage
      },
      {
        name: 'The Matrix',
        votes: 40,
        description: 'A computer programmer discovers the shocking truth about his simulated reality.',
        image: matrixImage
      },
      {
        name: 'Interstellar',
        votes: 35,
        description: 'Explorers travel through a wormhole in space in an attempt to save humanity.',
        image: interstellarImage
      },
      {
        name: 'Blade Runner 2049',
        votes: 30,
        description: 'A new blade runner unearths a long-buried secret that has the potential to plunge society into chaos.',
        image: bladerunnerImage
      },
    ],
  };

  const MovieCard: React.FC<{ movie: MovieOption; totalVotes: number }> = ({ movie, totalVotes }) => {
    const votePercentage = (movie.votes / totalVotes) * 100;
  
    return (
      <div className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col h-full">
        <div className="relative pt-[150%]"> 
          <img 
            src={movie.image} 
            alt={movie.name} 
            className="absolute top-0 left-0 w-full h-full object-cover"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold mb-2">{movie.name}</h3>
            <p className="text-sm text-gray-600 mb-4">{movie.description}</p>
          </div>
          <div>
            <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
              <div
                className="bg-blue-500 h-full"
                style={{ width: `${votePercentage}%` }}
              ></div>
            </div>
            <div className="mt-2 flex justify-between items-center">
              <span className="text-sm font-medium">{movie.votes} votes</span>
              <span className="text-sm font-medium">{votePercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const PollResult: React.FC<{ poll: Poll }> = ({ poll }) => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    
    return (
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">{poll.question}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {poll.options.map((movie, index) => (
            <MovieCard key={index} movie={movie} totalVotes={totalVotes} />
          ))}
        </div>
      </div>
    );
  };
  
  const PollResultPage: React.FC = () => {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold mb-8">Movie Poll Results</h1>
        <PollResult poll={pollData} />
      </div>
    );
  };
  
  export default PollResultPage;
  