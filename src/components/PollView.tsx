import { RadioGroup, RadioGroupItem } from "./shadcn/ui/radio-group"
import { Button } from "./shadcn/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { PollOptionResponse, PollResponse } from "@/pages/WatchPartyPage";
import { useNavigate } from "react-router-dom";

interface PollViewProps {
    poll: PollResponse;
    optionChecked: PollOptionResponse|null;
    voteSaved: boolean;
    setOptionChecked: (optionChecked: PollOptionResponse) => void;
    onCreateVote: () => void;
    onChangeVote: () => void;
    watchPartyCode: string;
};

type PollOptionProps = {
    pollOptionView: PollOptionResponse;
    voteable: boolean;
    optionChecked: PollOptionResponse|null;
    setOptionChecked: (optionChecked: PollOptionResponse) => void;
};
  
export const PollView : React.FC<PollViewProps> = ({ poll, optionChecked, onCreateVote, onChangeVote, setOptionChecked, voteSaved, watchPartyCode }) => {
    const [voteable, setVoteable] = useState(!poll?.voted);
    const navigate = useNavigate();

    function voteCreate() {
        setVoteable(false);
        onCreateVote();
    }

    function voteUpdate() {
        setVoteable(false);
        onChangeVote();
    }

    function viewPollResult () {
        // navigate to poll result page
        navigate("/view-poll-results",
            {
              state : {
                watchPartyCode: watchPartyCode
              }
            }
        );
    }
    
    return (
        <div>
            <form className="space-y-4 text-white">
                <div>
                    {/* RETRIEVE POLL QUESTION AND ITS OPTIONS */}
                    <h1 className="text-3xl md:text-4xl font-bold mb-2">Poll</h1>
                    <h2 className="text-xl md:text-2xl font-semibold">{poll.pollQuestion}</h2>
                    <p className="text-white mb-6">*Select the option you want to vote for and click "Submit Vote"</p>
                    <RadioGroup 
                        onValueChange={() => voteable && optionChecked && setOptionChecked(optionChecked)}
                    >
                        <div className="flex items-center space-x-2">
                        {poll.pollOptionList.map((option, id) => 
                            <PollOptionView
                                key={id}
                                pollOptionView={option}
                                optionChecked={optionChecked}
                                setOptionChecked={setOptionChecked}
                                voteable={voteable}
                            />
                        )}
                        </div>
                    </RadioGroup>
                </div>
                {/* CREATE VOTE BUTTON */}
                {!voteSaved && 
                    <Button
                        type="button"
                        variant="secondary"
                        className="w-full py-2 font-alatsi"
                        disabled={optionChecked == null || poll?.voted}
                        onClick={voteCreate}
                    >
                        Submit Vote
                    </Button>
                }
                
                {/* CHANGE VOTE BUTTON */}
                {voteSaved &&
                    <div className="space-y-4">
                        <Button
                        type="button"
                        variant="secondary"
                        className="w-full text-base py-2 font-alatsi border"
                        onClick={!voteable ? () => setVoteable(true) : voteUpdate}
                        >
                            {!voteable ? "Change Vote" : "Update Vote"}
                        </Button>
                    </div>
                }

                {/* VIEW POLL RESULT BUTTON */}
                <div className="space-y-4">
                        <Button
                        type="button"
                        variant="default"
                        className="w-full text-white py-2 font-alatsi border"
                        onClick={viewPollResult}
                        >
                           View Poll Result
                        </Button>
                </div>
            </form>
      </div>
    );
};

export const PollOptionView = ({
    pollOptionView,
    optionChecked,
    setOptionChecked,
    voteable
}: PollOptionProps) => {
    const image = pollOptionView.imageUrl ?  "http://localhost:8080/pollOptionImages/" + pollOptionView.imageUrl : null;
    const [isOverflowing, setIsOverflowing] = useState(false);
    const descriptionRef = useRef<HTMLParagraphElement>(null);
    const [expanded, setExpanded] = useState(false);

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
      }, [pollOptionView.description]);

      function onClickReadMoreOrShowLess(e: any) {
        e.preventDefault();
        setExpanded(!expanded);
      }
    
    return (
        <div 
            style={{width: 240}}
            className={`${optionChecked?.value == pollOptionView.value ? 'bg-green-500' : 'bg-gray-800'} rounded-lg shadow-lg overflow-hidden flex flex-col h-full border border-gray-700`}
            onClick={() => voteable && setOptionChecked(pollOptionView)}
        >
            <RadioGroupItem
                style={{backgroundColor: "white"}}
                value={pollOptionView.value}
                id={"Option-" + pollOptionView.pollOptionId}
                hidden
            />
            <div className="p-4 flex-grow flex flex-col justify-between relative z-10 gap-6">
                {/* OPTION IMAGE */}
                {image && 
                    <div className="relative pt-[100%]">
                        <img 
                            src={image}
                            alt={pollOptionView.value} 
                            className="absolute top-0 left-0 w-full h-full object-cover object-top"
                            
                        />
                    </div>
                }
                <div className="x-4 flex flex-col justify-between relative z-10">
                    {/* OPTION VALUE */}
                    <h3 className={"font-semibold mb-2 text-white text-lg flex items-center"}>
                        <span>{pollOptionView.value}</span>
                    </h3>
                    {/* OPTION DESCRIPTION */}
                    {pollOptionView.description &&
                        <p 
                            ref={descriptionRef}
                            className={`text-white mb-2 text-sm ${expanded ? '' : 'line-clamp-2'}`}
                        >
                            {pollOptionView.description}
                        </p>
                    }
                    {/* DESCRIPTION OVERFLOW (READ MORE/SHOW LESS) */}
                    {pollOptionView.description && isOverflowing && (
                        <button 
                            onClick={onClickReadMoreOrShowLess} 
                            className="text-blue-600 text-sm flex items-center mt-1 hover:text-blue-300 relative z-20"
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
            </div>
        </div>
    );
};

export default PollView;