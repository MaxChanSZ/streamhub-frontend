import React, { useEffect, useState } from "react";
import { Button } from "@/components/shadcn/ui/button";

import { 
  createPoll,
  createWatchParty,
  getPollOptions,
  uploadImage
} from "@/utils/api-client";
import { useAppContext } from "@/contexts/AppContext";
import PollForm, { PollOptionRequestData, PollRequestData, Poll } from "@/components/PollForm";
import { useNavigate } from "react-router-dom";
import WatchPartyForm from "@/components/WatchPartyForm";

export type WatchPartyFormData = {
  partyName: string;
  accountID: number | undefined;
  password: string;
  scheduledDate: string;
  scheduledTime: string;
};

export type UpdatePollOptionRequestData = {
  id: number;
  imageUrl: string;
};

export type WatchPartyResponseData = {
  id: number;
  code: string;
  token: string;
  host: boolean;
  videoSource: string;
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
}

export const Label: React.FC<React.LabelHTMLAttributes<HTMLLabelElement>> = ({ children, className, ...props }) => (
  <label className={`block text-sm font-medium text-stone-50 mb-1 ${className}`} {...props}>
    {children}
  </label>
);

/**
 * CreateWatchPartyPage component is responsible for rendering the page where users can create a watch party.
 * It contains a form with input fields for the party name, date, and time, along with a submit button.
 *
 * @return {JSX.Element} The rendered CreateWatchPartyPage component.
 */
const CreateWatchPartyPage = () => {
  const [watchParty, setWatchParty] = useState<WatchPartyForm>({
    partyName: "",
    scheduledDate: "",
    scheduledTime: "",
    password: "",
  });
  const [partyCode, setPartyCode] = useState<string>('');
  // add properties for video source and host
  const [videoSource, setVideoSource] = useState<string>('');
  const [ isHost, setIsHost ] = useState<boolean>(false); 
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [poll, setPoll] = useState<null|Poll>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPollCreated, setIsPollCreated] = useState<boolean>(false);
  const { user } = useAppContext();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState<number | null>(null);

  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // TODO
      // we need to store the video url in the state from the create watch party response before we can
      // navigate to the next page.
      // if not, the video source will be null and there will be an error
      // set the isHost and video source values in the state so it can be used in the next page

      navigate(`/watch-party/${partyCode}`,
        {
          state : {
            videoSource: videoSource,
            isHost: isHost
          }
        }
      );
    }
  }, [countdown, navigate, partyCode]);

  const onPollCreate = async(poll: Poll, partyCode: string) => {
    let optionRequestsData: PollOptionRequestData[] = [];
      for (let i=0; i<poll.optionSize; i++) {
        const {
          value,
          description,
          image
        } = poll.options[i];
        const request: PollOptionRequestData = {
          value,
          description,
          image,
          fileName: image?.name
        }
        optionRequestsData.push(request);
      }

      const pollRequestData: PollRequestData = {
        partyCode,
        question: poll.question,
        pollOptionRequests: optionRequestsData
      }

      try {
        const response = await createPoll(pollRequestData);
        console.log('Poll created:', response);
        const pollOptionList: PollOptionResponseData[] = await getPollOptions(response?.id);
        for (var i=0; i<pollOptionList.length; i++) {
          // upload images and save image url
          const optionImage: File| null = pollRequestData?.pollOptionRequests[i].image ? pollRequestData?.pollOptionRequests[i].image : null;
          if (optionImage) {
            uploadImage(optionImage, pollOptionList[i].imageUrl, "pollOptionImages");
            console.log("Image uploaded for " + optionImage.name);
          }
        }
      } catch (error) {
        console.error('Error creating poll:', error);
        setError('Failed to create poll. Please try again.');
      } finally {
        setIsPollCreated(true);
      }
  }

  const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
  
    const accountID = user?.id;
  
    if (!accountID) {
      setError('User not logged in. Please log in to create a watch party.');
      setIsLoading(false);
      return;
    }

    const formData: WatchPartyFormData = {
      partyName: watchParty.partyName,
      accountID,
      password: watchParty.password,
      scheduledDate: watchParty.scheduledDate,
      scheduledTime: watchParty.scheduledTime
    };
  
    try {
      const response = await createWatchParty(formData);
      setPartyCode(response.code);
      setVideoSource(response.videoSource);
      setIsHost(response.host);
      console.log("Is host is set to: " + isHost);

      // store the token for the host
      localStorage.setItem("watchparty-token", JSON.stringify(response.token));

      console.log('Watch Party created:', response);
      if (poll) {
        await onPollCreate(poll, response.code);
      }
      setCountdown(5); 
    } catch (error) {
      console.error('Error creating watch party:', error);
      setError('Failed to create watch party. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-2xl text-white font-semibold mb-6 text-center font-alatsi">
        Create Watch Party
      </h2>
      <form onSubmit={onFormSubmit} className="space-y-4">
       {/* WATCHPARTY FORM */}
       <WatchPartyForm 
          watchParty={watchParty}
          setWatchParty={setWatchParty}
       />
        
        {/* POLL FOR WATCH PARTY */}
        {poll ? (
          <div>
            <PollForm 
              poll={poll}
              setPoll={setPoll}
            />
            <Button
                type="button"
                variant="default"
                className="w-full text-base py-2 font-alatsi border"
                onClick={() => setPoll(null)}
              >
              Cancel Poll
            </Button>
          </div>
        ) : (
          <Button
          type="button"
          variant="default"
          className="w-full text-white py-2 font-alatsi border"
          onClick={() => setPoll({
            question: "",
            options: [
              {value: "", description: "", image: null, imageOptionUrl: ""},
              {value: "", description: "", image: null, imageOptionUrl: ""}
            ],
            optionSize: 2
          })}
        >
          Create Poll
        </Button>
        )}
        
        {/* SUBMIT FORM BUTTON */}
        <Button
          type="submit"
          variant="secondary"
          className="w-full text-base py-2 font-alatsi"
          disabled={isLoading}
        >
          {isLoading ? 'Creating...' : 'Create Watch Party'}
        </Button>
      </form>
      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          <p>{error}</p>
        </div>
      )}
      {partyCode && (
        <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
          <p>Your party code is: <strong>{partyCode}</strong></p>
          <p className="mt-2 text-sm">Share this code with your friends to invite them to your watch party!</p>
          <p className="mt-2">Redirecting in {countdown} seconds...</p>
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


export default CreateWatchPartyPage;
