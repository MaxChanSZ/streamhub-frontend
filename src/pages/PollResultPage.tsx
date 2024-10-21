import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useAppContext } from "@/contexts/AppContext";
import { fetchWatchPartiesWithPoll, getWatchpartyPoll } from '@/utils/api-client';
import { PollOptionResponse, PollResponse } from './WatchPartyPage';
import { useLocation } from 'react-router-dom';
import { WatchParty } from './CreateWatchPartyPage';

export type WatchPartyResponse = {
  id: number;
  partyName: string;
  scheduledDate: string;
  scheduledTime: string;
  code: string;
  createdDate: number[];
};

const PollOptionCard: React.FC<{ pollOption: PollOptionResponse; totalVotes: number; place: number }> = ({ pollOption, totalVotes }) => {
  const [expanded, setExpanded] = useState(false);
  const [isOverflowing, setIsOverflowing] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const votePercentage = totalVotes > 0 ? (pollOption.voteCount / totalVotes) * 100 : 0;

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
    <div className={"bg-gray-800 rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-700 transform hover:scale-105 transition-transform duration-300"}>
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
          <h3 className={"font-semibold mb-2 text-white text-xl flex items-center"}>
            <span>{pollOption.value}</span>
          </h3>
          {pollOption.description &&
          <p
            ref={descriptionRef}
            className={`text-gray-400 mb-2 text-base ${expanded ? '' : 'line-clamp-2'}`}
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
            <span className={"font-medium text-gray-300 text-sm"}>{pollOption.voteCount} votes</span>
            <span className={"font-medium text-gray-300 text-sm"}>{votePercentage.toFixed(1)}%</span>
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
        {sortedOptions.map((option, index) => (
          <PollOptionCard key={index} pollOption={option} totalVotes={totalVotes} place={index + 1} />
        ))}
      </div>
    </div>
  );
};

const WatchPartyDropdown: React.FC<{ onSelect: (partyCode: string) => void, setError: (error: string) => void , selectedWatchPartyCode: string }> = ({ onSelect, setError, selectedWatchPartyCode }) => {
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const { user } = useAppContext();

  useEffect(() => {
    if (user) {
      fetchAllWatchPartiesWithPoll();
    }
  }, [user]);

  const fetchAllWatchPartiesWithPoll = async () => {
    try {
      if (user && user.id) {
        const response = await fetchWatchPartiesWithPoll();
        setWatchParties(response);
      }
    } catch (error) {
      setError("Error fetching watch parties");
      console.error('Error fetching watch parties:', error);
    }
  };

  return (
    <div>
      {watchParties.length > 0 &&
        <select
          onChange={(e) => onSelect(e.target.value)}
          className="w-full p-2 mb-4 bg-gray-700 text-white border border-gray-600 rounded-md"
        >
          <option value={selectedWatchPartyCode}>Select a watch party to view Poll Results</option>
          {watchParties.map((party) => (
            <option key={party.id} value={party.code} selected={party.code == selectedWatchPartyCode}>
              {party.partyName} - {party.scheduledDate} {party.scheduledTime}
            </option>
          ))}
        </select>
      }
      {watchParties.length == 0 && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p>No watchparty poll created!</p>
          </div>
      )}
    </div>
  );
};

const PollResultPage: React.FC = () => {
  let location = useLocation();
  const code = location.state?.watchPartyCode ? location.state.watchPartyCode : "";
  window.scrollTo(0, 0);
  
  const [selectedWatchPartyCode, setSelectedWatchPartyCode] = useState<string>(code);
  const [watchpartyPoll, setWatchPartyPoll] = useState<PollResponse| null>(null);
  const { user } = useAppContext();
  const [error, setError] = useState<string>('');

  useEffect(() => {
    if (selectedWatchPartyCode && user && user.id) {
      onPollLoad();
    }
  }, [selectedWatchPartyCode, user]);

  // to retrieve poll and its option
  const onPollLoad = async() => {
    try {
      if(user) {
        const response = await getWatchpartyPoll(selectedWatchPartyCode, user?.id);
        setWatchPartyPoll(response);
        console.log(response);
      }
    } catch (error) {
        setError("Error retrieving poll");
    }
  }

  const handlePartySelect = (partyCode: string) => {
    setSelectedWatchPartyCode(partyCode);
  };

  return (
    <div className="container mx-auto px-2 py-4 text-white min-h-screen">
      <h1 className="text-3xl md:text-4xl font-bold mb-2">Poll Results</h1>
      <WatchPartyDropdown onSelect={handlePartySelect} setError={setError} selectedWatchPartyCode={selectedWatchPartyCode}/>
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
