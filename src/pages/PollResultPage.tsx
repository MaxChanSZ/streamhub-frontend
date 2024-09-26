import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
  
  const MedalIcon: React.FC<{ place: number }> = ({ place }) => {
    const colors = ['gold', 'silver', '#CD7F32'];
    return (
      <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill={colors[place - 1]} />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {place}
        </text>
      </svg>
    );
  };
  
  const MovieCard: React.FC<{ movie: MovieOption; totalVotes: number; place: number }> = ({ movie, totalVotes, place }) => {
    const [expanded, setExpanded] = useState(false);
    const votePercentage = (movie.votes / totalVotes) * 100;
    const isTopThree = place <= 3;
  
    return (
      <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-700 ${isTopThree ? 'transform hover:scale-105 transition-transform duration-300' : ''}`}>
        <div className="relative pt-[56.25%]"> 
          <img 
            src={movie.image} 
            alt={movie.name} 
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
          />
          {isTopThree && (
            <div className="absolute top-2 left-2">
              <MedalIcon place={place} />
            </div>
          )}
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between">
          <div>
            <h3 className={`font-semibold mb-2 text-white ${isTopThree ? 'text-xl' : 'text-lg'}`}>{movie.name}</h3>
            <p className={`text-gray-400 mb-2 ${expanded ? '' : 'line-clamp-2'} ${isTopThree ? 'text-base' : 'text-sm'}`}>{movie.description}</p>
            {movie.description.length > 100 && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                className="text-blue-400 text-sm flex items-center mt-1 hover:text-blue-300"
              >
                {expanded ? (
                  <>
                    <ChevronUp size={16} className="mr-1" />
                    Show less
                  </>
                ) : (
                  <>
                    <ChevronDown size={16} className="mr-1" />
                    Read more
                  </>
                )}
              </button>
            )}
          </div>
          <div>
            <div className="mt-2 flex justify-between items-center">
              <span className={`font-medium text-gray-300 ${isTopThree ? 'text-base' : 'text-sm'}`}>{movie.votes} votes</span>
              <span className={`font-medium text-gray-300 ${isTopThree ? 'text-base' : 'text-sm'}`}>{votePercentage.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  const PollResult: React.FC<{ poll: Poll }> = ({ poll }) => {
    const totalVotes = poll.options.reduce((sum, option) => sum + option.votes, 0);
    const sortedOptions = [...poll.options].sort((a, b) => b.votes - a.votes);
    
    return (
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {sortedOptions.slice(0, 3).map((movie, index) => (
            <MovieCard key={index} movie={movie} totalVotes={totalVotes} place={index + 1} />
          ))}
        </div>
        {sortedOptions.length > 3 && (
          <div>
            <h3 className="text-2xl font-semibold mb-4 text-white">Honorable Mentions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {sortedOptions.slice(3).map((movie, index) => (
                <MovieCard key={index + 3} movie={movie} totalVotes={totalVotes} place={index + 4} />
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };
  
  const PollResultPage: React.FC = () => {
    return (
      <div className="container mx-auto px-4 py-8 bg-gray-900 text-white min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Movie Poll Results</h1>
        <h2 className="text-xl md:text-2xl font-semibold mb-6">{pollData.question}</h2>
        <PollResult poll={pollData} />
      </div>
    );
  };
  
  export default PollResultPage;