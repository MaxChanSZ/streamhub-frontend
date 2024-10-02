import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from "@/contexts/AppContext";
import axios from 'axios';

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

interface WatchParty {
  id: number;
  partyName: string;
  scheduledDate: string;
  scheduledTime: string;
  code: string;
  createdDate: number[];
}
  
  const MedalIcon: React.FC<{ place: number }> = ({ place }) => {
    const colors = ['#C9B037', '#B4B4B4', '#AD8A56'];
    return (
      <svg className="w-6 h-6 inline-block mr-2" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill={colors[place - 1]} />
        <text x="50%" y="50%" dominantBaseline="central" textAnchor="middle" fill="white" fontSize="14" fontWeight="bold">
          {place}
        </text>
      </svg>
    );
  };
  
  const MovieCard: React.FC<{ movie: MovieOption; totalVotes: number; place: number }> = ({ movie, totalVotes, place }) => {
    const [expanded, setExpanded] = useState(false);
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const votePercentage = (movie.votes / totalVotes) * 100;
    const isTopThree = place <= 3;
  
    useEffect(() => {
      const checkOverflow = () => {
        if (descriptionRef.current) {
          setIsOverflowing(
            descriptionRef.current.scrollHeight > descriptionRef.current.clientHeight
          );
        }
      };
  
      checkOverflow();
      window.addEventListener('resize', checkOverflow);
      return () => window.removeEventListener('resize', checkOverflow);
    }, [movie.description]);
  
    return (
      <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-700 ${
        isTopThree ? 'transform hover:scale-105 transition-transform duration-300' : ''
      }`}>
        <div className="relative pt-[100%]"> 
          <img 
            src={movie.image} 
            alt={movie.name} 
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
          />
        </div>
        <div className="p-4 flex-grow flex flex-col justify-between relative z-10">
          <div>
            <h3 className={`font-semibold mb-2 text-white ${isTopThree ? 'text-xl' : 'text-lg'} flex items-center`}>
              {isTopThree && <MedalIcon place={place} />}
              <span>{movie.name}</span>
            </h3>
            <p 
              ref={descriptionRef}
              className={`text-gray-400 mb-2 ${expanded ? '' : 'line-clamp-2'} ${isTopThree ? 'text-base' : 'text-sm'}`}
            >
              {movie.description}
            </p>
            {isOverflowing && (
              <button 
                onClick={() => setExpanded(!expanded)} 
                className="text-blue-400 text-sm flex items-center mt-1 hover:text-blue-300 relative z-20"
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

  const WatchPartyDropdown: React.FC<{ onSelect: (partyId: string) => void }> = ({ onSelect }) => {
    const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
    const { user } = useAppContext();
  
    useEffect(() => {
      if (user) {
        fetchWatchParties();
      }
    }, [user]);
  
    const fetchWatchParties = async () => {
      try {
        if (user && user.id) {
          const response = await axios.get<WatchParty[]>(`http://localhost:8080/api/watch-party/get/${user.id}`);
          setWatchParties(response.data);
        }
      } catch (error) {
        console.error('Error fetching watch parties:', error);
      }
    };
  
    return (
      <select
        onChange={(e) => onSelect(e.target.value)}
        className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md"
      >
        <option value="">Select a watch party to view Poll Results</option>
        {watchParties.map((party) => (
          <option key={party.id} value={party.id.toString()}>
            {party.partyName} - {party.scheduledDate} {party.scheduledTime}
          </option>
        ))}
      </select>
    );
  };
  
  const PollResultPage: React.FC = () => {
    const [selectedParty, setSelectedParty] = useState<string>('');
    const [pollData, setPollData] = useState<Poll | null>(null);
  
    useEffect(() => {
      if (selectedParty) {
        fetchPollData(selectedParty);
      }
    }, [selectedParty]);
  
    const fetchPollData = async (partyId: string) => {
      try {
        const response = await axios.get<Poll>(`http://localhost:8080/api/poll/${partyId}`);
        setPollData(response.data);
      } catch (error) {
        console.error('Error fetching poll data:', error);
      }
    };
  
    const handlePartySelect = (partyId: string) => {
      setSelectedParty(partyId);
    };
  
    return (
      <div className="container mx-auto px-2 py-4 text-white min-h-screen">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Movie Poll Results</h1>
        <WatchPartyDropdown onSelect={handlePartySelect} />
        {pollData && (
          <>
            <h2 className="text-xl md:text-2xl font-semibold mb-6">{pollData.question}</h2>
            <PollResult poll={pollData} />
          </>
        )}
      </div>
    );
  };

  export default PollResultPage;