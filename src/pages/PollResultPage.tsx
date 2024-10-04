import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from "@/contexts/AppContext";
import { fetchWatchParties, getWatchpartyPoll } from '@/utils/api-client';
import { PollOptionResponse, PollResponse } from './WatchPartyPage';

interface WatchParty {
  id: number;
  partyName: string;
  scheduledDate: string;
  scheduledTime: string;
  code: string;
  createdDate: number[];
}

export type WatchPartyResponse = {
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

const PollOptionCard: React.FC<{ pollOption: PollOptionResponse; totalVotes: number; place: number }> = ({ pollOption, totalVotes, place }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const votePercentage = totalVotes > 0 ? (pollOption.voteCount / totalVotes) * 100 : 0;
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
  }, [pollOption.description]);

  const imageUrl = pollOption.imageUrl ? "http://localhost:8080/pollOptionImages/" + pollOption.imageUrl : null;

  return (
    <div className={`bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-700 ${
      isTopThree ? 'transform hover:scale-105 transition-transform duration-300' : ''
    }`}>
      {imageUrl &&
        <div className="relative pt-[100%]"> 
          <img 
            src={imageUrl} 
            alt={pollOption.value}
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
          />
        </div>
      }
      <div className="p-4 flex-grow flex flex-col justify-between relative z-10">
        <div>
          <h3 className={`font-semibold mb-2 text-white ${isTopThree ? 'text-xl' : 'text-lg'} flex items-center`}>
            {isTopThree && <MedalIcon place={place} />}
            <span>{pollOption.value}</span>
          </h3>
          {pollOption.description &&
          <p
            ref={descriptionRef}
            className={`text-gray-400 mb-2 ${expanded ? '' : 'line-clamp-2'} ${isTopThree ? 'text-base' : 'text-sm'}`}
          >
            {pollOption.description}
          </p>
          }
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
            <span className={`font-medium text-gray-300 ${isTopThree ? 'text-base' : 'text-sm'}`}>{pollOption.voteCount} votes</span>
            <span className={`font-medium text-gray-300 ${isTopThree ? 'text-base' : 'text-sm'}`}>{votePercentage.toFixed(1)}%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

const PollResult: React.FC<{ poll: PollResponse }> = ({ poll }) => {
  const totalVotes = poll.pollOptionList.reduce((sum, option) => sum + option.voteCount, 0);
  const sortedOptions = [...poll.pollOptionList].sort((a, b) => b.voteCount - a.voteCount);
  
  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {sortedOptions.slice(0, 3).map((movie, index) => (
          <PollOptionCard key={index} pollOption={movie} totalVotes={totalVotes} place={index + 1} />
        ))}
      </div>
      {sortedOptions.length > 3 && (
        <div>
          <h3 className="text-2xl font-semibold mb-4 text-white">Honorable Mentions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {sortedOptions.slice(3).map((movie, index) => (
              <PollOptionCard key={index + 3} pollOption={movie} totalVotes={totalVotes} place={index + 4} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const WatchPartyDropdown: React.FC<{ onSelect: (partyCode: string) => void, setError: (error: string) => void }> = ({ onSelect, setError }) => {
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const { user } = useAppContext();

  useEffect(() => {
    if (user) {
      fetchAllWatchParties();
    }
  }, [user]);

  const fetchAllWatchParties = async () => {
    try {
      if (user && user.id) {
        const response = await fetchWatchParties();
        setWatchParties(response);
      }
    } catch (error) {
      setError("Error fetching watch parties");
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
          <option key={party.id} value={party.code}>
            {party.partyName} - {party.scheduledDate} {party.scheduledTime}
          </option>
        ))}
      </select>
  );
};

const PollResultPage: React.FC = () => {
  const [selectedPartyCode, setSelectedPartyCode] = useState<string>('');
  const [watchpartyPoll, setWatchPartyPoll] = useState<PollResponse| null>(null);
  const { user } = useAppContext();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedPartyCode && user && user.id) {
      onPollLoad();
    }
  }, [selectedPartyCode, user]);

  // to retrieve poll and its option
  const onPollLoad = async() => {
    try {
      if(user) {
        const response = await getWatchpartyPoll(selectedPartyCode, user?.id);
        setWatchPartyPoll(response);
        console.log(response);
      }
    } catch (error) {
        setError("Error retrieving poll");
    }
  }

  const handlePartySelect = (partyCode: string) => {
    setSelectedPartyCode(partyCode);
  };

  return (
    <div className="container mx-auto px-2 py-4 text-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Poll Results</h1>
      <WatchPartyDropdown onSelect={handlePartySelect} setError={setError} />
      {watchpartyPoll && (
        <>
          <h2 className="text-xl md:text-2xl font-semibold mb-6">{watchpartyPoll.pollQuestion}</h2>
          <PollResult poll={watchpartyPoll} />
        </>
      )}
      {error && (
          <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            <p>{error}</p>
          </div>
      )}
    </div>
  );
};


export default PollResultPage;
