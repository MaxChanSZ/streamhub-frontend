import React, { useState, useEffect } from 'react';
import { useAppContext } from "@/contexts/AppContext";
import { fetchWatchPartiesWithPoll, getPollOptions, getWatchpartyPoll, removeImage, updatePoll, uploadImage } from '@/utils/api-client';
import PollForm, { ImageObject, Poll, PollOption } from '@/components/PollForm';
import { Button } from '@/components/shadcn/ui/button';
import { WatchParty } from './CreateWatchPartyPage';
import { PollResponse } from './WatchPartyPage';
import { PollOptionResponseData } from './CreatePollPage';

export type UpdatePollForm = {
  pollID: number;
  accountID: number;
  question: string;
  pollOptionRequests: UpdatePollOptionForm[];
};

export type UpdatePollOptionForm = {
  value: string;
  description: string|null;
  fileName: string|null;
  pollOptionID?: number;
};

const serverPath = "http://localhost:8080/";
const imageUploadDirectoryName = "pollOptionImages";
const imageUploadDirectoryUrl = serverPath + imageUploadDirectoryName + "/";

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
            <p>No watchparty poll created!</p>
          </div>
      )}
    </div>
  );
};

const ManagePollPage: React.FC = () => {
  const [selectedWatchPartyCode, setSelectedWatchPartyCode] = useState<string>('');
  const [selectedPollId, setSelectedPollId] = useState<number>(0);
  const [poll, setPoll] = useState<Poll|null>(null);

  const [newQuestion, setNewQuestion] = useState<string>('');
  const [newOptionSize, setNewOptionSize] = useState<number>(2);
  const [newPollOptions, setNewPollOptions] = useState<PollOption[]>([
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
  const [isPollUpdated, setIsPollUpdated] = useState<boolean>(false);
  const [imageList, setImageList] = useState<ImageObject[]>([]);

  const arePollOptionsUnique =(): boolean => {
    let uniqueOptionsList: string[] = [];
    for(let i=0; i<newOptionSize; i++) {
      // if option is not available push it to the list
      if (uniqueOptionsList.indexOf(newPollOptions[i].value) === -1) {
          uniqueOptionsList.push(newPollOptions[i].value);
      } else {
          //return false once a duplicate is found
          return false;
      }
    }
    return true;
  }

 // to retrieve poll and its option
 const onPollLoad = async(code: string) => {
    try {
      if(user) {
        const response: PollResponse = await getWatchpartyPoll(code, user?.id);
        const imageListNew: ImageObject[] = [];
        if(response) {
            setSelectedPollId(response.pollId);
            let loadedOptions: PollOption[] = [];
            for(let i=0; i<response.pollOptionList.length; i++) {
                const imageUrl = response.pollOptionList[i].imageUrl ? imageUploadDirectoryUrl + response.pollOptionList[i].imageUrl  : "";
                loadedOptions.push(
                    {
                        value: response.pollOptionList[i].value,
                        description: response.pollOptionList[i].description,
                        image: null,
                        imageOptionUrl: imageUrl,
                        id: response.pollOptionList[i].pollOptionId
                    }
                );
                imageListNew.push({
                  image: null,
                  imageUrl: imageUrl
                });
            }
            setPoll({
                question: response.pollQuestion,
                optionSize: response.pollOptionList.length,
                options: loadedOptions
            });
            setNewOptionSize(response.pollOptionList.length);
            setNewQuestion(response.pollQuestion),
            setNewPollOptions(loadedOptions);
            setImageList(imageListNew);
        } 
      }
    } catch (error) {
        setError("Error retrieving poll");
    }
};

const getFileName = (optionId: number, imageName: string, newImage?: File|null): string => {
  if (newImage && optionId > 0) {
    return `${selectedPollId}-${optionId}-${newImage.name}`;
  } else if (newImage && optionId == 0) {
    return newImage.name;
  } else {
    return imageName.startsWith(imageUploadDirectoryUrl) ? imageName.replace(imageUploadDirectoryUrl, "") : imageName;
  }
}

const onPollUpdate = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsPollUpdated(false);
    const accountID = user?.id;
  
    if (!accountID) {
      setError('User not logged in. Please log in to create a watch party.');
      return;
    }

    if (!arePollOptionsUnique()) {
        setError("Duplicate values set for options. Please check and change to unique ones.");
        return;
    }

      if (poll) {
        let optionRequestsData: UpdatePollOptionForm[] = [];
        for (let i=0; i<newOptionSize; i++) {
          const pollOptionRequest: UpdatePollOptionForm = {
            value: newPollOptions[i].value,
            description: newPollOptions[i].description,
            fileName: getFileName(poll.options[i].id, poll.options[i].imageOptionUrl ,imageList[i].image),
            pollOptionID: poll.options[i].id
          }
          optionRequestsData.push(pollOptionRequest);
        }

        const pollRequestData: UpdatePollForm = {
          pollID: selectedPollId,
          accountID: user?.id,
          question: newQuestion,
          pollOptionRequests: optionRequestsData
        }

        try {
          const pollOptions: PollOptionResponseData[] = await getPollOptions(selectedPollId);
          await updatePoll(pollRequestData);
          const response = await getWatchpartyPoll(selectedWatchPartyCode, user?.id);
          console.log("poll response", response);

          // if new image list size more than current image list in poll options
          // add the image
          if (imageList.length > pollOptions.length) {
            // upload images and save image url
            for(let i=pollOptions.length; i<imageList.length; i++) {
              const optionImage: File| null | undefined = imageList[i].image ? imageList[i].image  : null;
              if (optionImage) {
                const newImageUrl: string | undefined = response.pollOptionList[i].imageUrl;
                if (newImageUrl) {
                  uploadImage(optionImage, newImageUrl, "pollOptionImages");
                }
              }
            }
          }

          // if new image list size is less than current image list in poll options
          // remove the image
          // not working
          if (imageList.length < pollOptions.length) {
            for(let i=imageList.length; i<pollOptions.length; i++) {
              removeImage(pollOptions[i].imageUrl, imageUploadDirectoryName);
            }
          }

          // for the remaining images
          // if prev image for option was null and new image is not null -> upload
          // if prev image for option was not null and new image is null -> remove
          // if prev image for option and new image both not null,
            // update the new image
            // remove the prev image
          const remainingSize = pollOptions.length <= imageList.length ? pollOptions.length : imageList.length;
          for (let i=0; i<remainingSize; i++) {
            if(pollOptions[i].imageUrl == null && imageList[i].imageUrl != null && pollOptions[i].imageUrl != imageList[i].imageUrl) {
              const optionImage: File| null | undefined = imageList[i].image ? imageList[i].image  : null;
              if (optionImage) {
                const newImageUrl: string | undefined = response.pollOptionList[i].imageUrl;
                if (newImageUrl) {
                  uploadImage(optionImage, newImageUrl, "pollOptionImages");
                }
              }
            }  else if (pollOptions[i].imageUrl != null && imageList[i].imageUrl != null) {
             
              const optionImage: File| null | undefined = imageList[i].image ? imageList[i].image  : null;
              if (optionImage) {
                const newImageUrl: string | undefined = `${selectedPollId}-${pollOptions[i].id}-${optionImage.name}`;
                if (newImageUrl) {
                  uploadImage(optionImage, newImageUrl, "pollOptionImages");
                  removeImage(pollOptions[i].imageUrl, imageUploadDirectoryName);
                }
              }
            }
          }

          setIsPollUpdated(true);
          setPoll({
            question: newQuestion,
            optionSize: newOptionSize,
            options: newPollOptions
          });
        } catch (error) {
          console.error('Error updating poll:', error);
          setError('Failed to update poll. Please try again.');
        } 
      }
  }

  const handlePartySelect = (partyCode: string) => {
    setSelectedWatchPartyCode(partyCode);
    onPollLoad(partyCode);
  };

  return (
    <div className="container mx-auto px-4 py-8">
       <h1 className="text-2xl font-bold mb-6 text-white">Manage Poll</h1>
      <WatchPartyDropdown onSelect={handlePartySelect} setError={setError} selectedWatchPartyCode={selectedWatchPartyCode}/>
      {selectedWatchPartyCode &&
        <form className='space-y-4' onSubmit={onPollUpdate}>
                <PollForm
                    question={newQuestion}
                    setQuestion={setNewQuestion}
                    optionSize={newOptionSize}
                    setOptionSize={setNewOptionSize}
                    pollOptions={newPollOptions}
                    setPollOptions={setNewPollOptions}
                    imageList={imageList}
                    setImageList={setImageList}
                />
                <Button
                    type="submit"
                    variant="secondary"
                    className="w-full text-base py-2 font-alatsi"
                >
                    Update Poll
                </Button>
        </form>
        }
       {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
       {isPollUpdated && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Poll successfully updated!</p>
        </div>
      )}

    </div>
  );
};

export default ManagePollPage;
