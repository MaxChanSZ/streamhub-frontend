import LiveChat from "@/components/LiveChat";
import PollView from "@/components/PollView";
import VideoJSSynced from "@/components/VideoJSSynced";
import { addVote, changeVote, getWatchpartyPoll } from "@/utils/api-client";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router";
import { useAppContext } from "@/contexts/AppContext";

export type PollResponse = {
  pollId: number;
  pollQuestion: string;
  pollOptionList: PollOptionResponse[];
  voted: boolean;
  selectedPollOption: PollOptionResponse;
}
export type PollOptionResponse = {
  pollOptionId: number;
  value: string;
  description: string;
  imageUrl: string;
  voteCount: number;
}

const WatchPartyPage = () => {
  const params = useParams();

  let location = useLocation();
  const data = location.state;

  const sessionId = params.sessionId ? params.sessionId.toString() : "1";

  const videoJsOptions = {
    sources: [
      {
        src: data.videoSource,
        type: "application/x-mpegURL",
      },
    ],
  };

  const [roomID, setRoomID] = useState(sessionId);
  const [watchpartyPoll, setWatchPartyPoll] = useState<PollResponse|null>(null);
  const [optionChecked, setOptionChecked] = useState<PollOptionResponse|null>(null);
  const [blockDisposePlayer, setBlockDisposePlayer] = useState<boolean>(false);
  const [voteSaved, setVoteSaved] = useState(false);
  const [pollLoaded, setPollLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  
  const { user } = useAppContext();

  useEffect(() => {
    // do not dispose player on option change
    setBlockDisposePlayer(true);
  }, [optionChecked]);

  // to retrieve poll and its option
  const onPollLoad = async() => {
    try {
      if(user) {
        const response = await getWatchpartyPoll(sessionId, user?.id);
        setWatchPartyPoll(response);
        setPollLoaded(true);
        if (response.selectedPollOption) {
          setOptionChecked(response.selectedPollOption);
          setVoteSaved(true);
        } else {
          setVoteSaved(false);
        }
      }
    } catch (error) {
        setError("Error retrieving poll");
    }
  }

  // when user votes for first time on a poll
  const onVoteCreate = async () => {
    if (watchpartyPoll && optionChecked && user) {
      try {
        addVote(watchpartyPoll?.pollId, optionChecked?.pollOptionId, user?.id);
        setSuccess("Voting done successfully!");
        setVoteSaved(true);
      } catch (error) {
        setError("Error creating vote on this poll");
      }
    }
  };

  // when user changes their vote on a poll
  const onVoteChange = async () => {
    if (watchpartyPoll && optionChecked && user) {
      try {
        changeVote(watchpartyPoll?.pollId, optionChecked?.pollOptionId, user?.id);
        setSuccess("Voting updated successfully!");
      } catch (error) {
        setError("Error updating vote on this poll");
      }
      
    }
  };

  if (!pollLoaded) {
    onPollLoad();
  }

  return (
    <div>
      <div className="grid grid-cols-1 gap-y-2 md:grid-cols-4 md:gap-x-4 ">
        <div className="col-span-3 min-h-80">
          <VideoJSSynced
            blockDisposePlayer={blockDisposePlayer}
            options={videoJsOptions}
            roomID={roomID}
            setRoomID={setRoomID}
          />
        </div>
        <div className="col-span-1">
          <LiveChat roomID={roomID} />
        </div>
      </div>
      {pollLoaded && watchpartyPoll && user &&
        <div>
          <PollView
            poll={watchpartyPoll}
            optionChecked={optionChecked}
            voteSaved={voteSaved}
            setOptionChecked={setOptionChecked}
            onCreateVote={onVoteCreate}
            onChangeVote={onVoteChange}
          />
          {error && (
            <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
              <p>{error}</p>
            </div>
          )}
          {success && (
            <div className="mt-4 p-4 bg-green-100 border border-green-400 text-green-700 rounded">
              <p>{success}</p>
            </div>
          )}
        </div>
      }
    </div>
  );
};

export default WatchPartyPage;


