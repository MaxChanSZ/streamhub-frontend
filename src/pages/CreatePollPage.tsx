import React, { useState, useEffect } from 'react';
import { useAppContext } from "@/contexts/AppContext";
import { createPoll, fetchWatchPartiesWithoutPoll, getWatchpartyPoll, uploadImage } from '@/utils/api-client';
import PollForm, { ImageObject, PollOption, PollOptionRequestData, PollRequestData } from '@/components/PollForm';
import { Button } from '@/components/shadcn/ui/button';
import { WatchParty } from './CreateWatchPartyPage';

export type WatchPartyResponse = {
  id: number;
  partyName: string;
  scheduledDate: string;
  scheduledTime: string;
  code: string;
  createdDate: number[];
};

export type PollResponseData = {
    id: number;
    question: string;
};
  
export type PollOptionResponseData = {
    id?: number;
    value: string;
    description: string;
    imageUrl: string;
};

export type UpdatePollOptionRequestData = {
    id: number;
    imageUrl: string;
};
  
const WatchPartyDropdown: React.FC<{ onSelect: (partyCode: string) => void, setError: (error: string) => void , selectedWatchPartyCode: string }> = ({ onSelect, setError, selectedWatchPartyCode }) => {
  const [watchParties, setWatchParties] = useState<WatchParty[]>([]);
  const { user } = useAppContext();

  useEffect(() => {
    if (user) {
      fetchAllWatchPartiesWithoutPoll();
    }
  }, [user]);

  const fetchAllWatchPartiesWithoutPoll = async () => {
    try {
      if (user && user.id) {
        const response = await fetchWatchPartiesWithoutPoll();
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
          <option value={selectedWatchPartyCode}>Select a watch party to create a poll</option>
          {watchParties.map((party) => (
            <option key={party.id} value={party.code} selected={party.code == selectedWatchPartyCode}>
              {party.partyName} - {party.scheduledDate} {party.scheduledTime}
            </option>
          ))}
        </select>
      }
      {watchParties.length == 0 && (
          <div className="mt-4 p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
            <p>All watchparties created have a poll already.</p>
          </div>
      )}
    </div>
  );
};

const CreatePollPage: React.FC = () => {
  
  const [selectedWatchPartyCode, setSelectedWatchPartyCode] = useState<string>('');
  const [question, setQuestion] = useState<string>('');
  const [optionSize, setOptionSize] = useState<number>(2);
  const [pollOptions, setPollOptions] = useState<PollOption[]>([
    {
      id: 0,
      value: "",
      description: "",
      image: null,
      imageOptionUrl: ""
    },
    {
      id: 0,
      value: "",
      description: "",
      image: null,
      imageOptionUrl: ""
    }
  ]);
  
  const { user } = useAppContext();
  const [error, setError] = useState<string>('');
  const [isPollCreated, setIsPollCreated] = useState<boolean>(false);
  const [imageList, setImageList] = useState<ImageObject[]>([
    {
      image: null,
      imageUrl: ""
    },
    {
      image: null,
      imageUrl: ""
    }
  ]);

  const arePollOptionsUnique =(): boolean => {
    let uniqueOptionsList: string[] = [];

    for(let i=0; i<optionSize; i++) {
        // if option is not available push it to the list
        if (uniqueOptionsList.indexOf(pollOptions[i].value) === -1) {
            uniqueOptionsList.push(pollOptions[i].value);
        } else {
            //return false once a duplicate is found
            return false;
        }
    }
    return true;
  }

const onPollCreate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const accountID = user?.id;
  
    if (!accountID) {
      setError('User not logged in. Please log in to create a watch party.');
      return;
    }

    if (!arePollOptionsUnique()) {
        setError("Duplicate values set for options. Please check and change to unique ones.");
        return;
    }

    let optionRequestsData: PollOptionRequestData[] = [];
      for (let i=0; i<optionSize; i++) {
        const {
          value,
          description,
          image
        } = pollOptions[i];
        const request: PollOptionRequestData = {
          value,
          description,
          image,
          fileName: image?.name
        }
        optionRequestsData.push(request);
      }

      const pollRequestData: PollRequestData = {
        partyCode: selectedWatchPartyCode,
        question: question,
        pollOptionRequests: optionRequestsData
      };

      try {
        await createPoll(pollRequestData);
        const response = await getWatchpartyPoll(selectedWatchPartyCode, user?.id);
        console.log("poll response", response);
        for (var i=0; i<imageList.length; i++) {
          // upload images and save image url
          const optionImage: File| null | undefined = imageList[i].image ? imageList[i].image  : null;
          if (optionImage) {
            const newImageUrl: string | undefined = response.pollOptionList[i].imageUrl;
            if (newImageUrl) {
              uploadImage(optionImage, newImageUrl, "pollOptionImages");
            }
          }
        }
      } catch (error) {
        console.error('Error creating poll:', error);
        setError('Failed to create poll. Please try again.');
      } finally {
        setIsPollCreated(true);
      }
  }

  const handlePartySelect = (partyCode: string) => {
    setSelectedWatchPartyCode(partyCode);
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-2xl font-bold mb-6 text-white">Create Poll</h1>
      <WatchPartyDropdown onSelect={handlePartySelect} setError={setError} selectedWatchPartyCode={selectedWatchPartyCode}/>
      {selectedWatchPartyCode &&
        <form className='space-y-4' onSubmit={onPollCreate}>
            <PollForm 
              question={question}
              setQuestion={setQuestion}
              optionSize={optionSize}
              setOptionSize={setOptionSize}
              pollOptions={pollOptions}
              setPollOptions={setPollOptions}
              imageList={imageList}
              setImageList={setImageList}
            />
            <Button
              type="submit"
              variant="secondary"
              className="w-full text-base py-2 font-alatsi"
            >
              Create Poll
            </Button>
        </form>
        }
       {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
       {isPollCreated && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Poll successfully created!</p>
        </div>
      )}
    </div>
  );
};

export default CreatePollPage;