import { Label } from "@/pages/CreateWatchPartyPage";
import { Input } from "./shadcn/ui/input";
import { RadioGroup, RadioGroupItem } from "./shadcn/ui/radio-group"
import React, { useEffect, useState } from "react";
import { Textarea } from "./shadcn/ui/textarea";

export type Poll = {
    question: string;
    options: PollOption[];
    optionSize: number;
};

export type PollOption = {
  value: string;
  description: string;
  image: File|null;
  imageOptionUrl: string;
  id: number;
};

interface PollProps {
  question: string;
  setQuestion: (question: string) => void;
  optionSize: number;
  setOptionSize: (optionSize: number) => void;
  pollOptions: PollOption[];
  setPollOptions: (pollOptions: PollOption[]) => void;
  imageList: ImageObject[];
  setImageList: (imageList: ImageObject[]) => void;
};

export type PollOptionProps = {
  id: number;
  pollOptionValue: PollOption;
  onOptionValueChange(option: PollOption, id: number): void;
  imageList: ImageObject[];
  setImageList: (imageList: ImageObject[]) => void;
};

export type ImageObject = {
  image?: File | null;
  imageUrl?: string;
};

// for api calls
// to create poll in backend
export type PollRequestData = {
  partyCode: string;
  question: string;
  pollOptionRequests: PollOptionRequestData[];
};

// to create poll option in backend
export type PollOptionRequestData = {
  pollID?: number;
  value: string;
  description: string;
  image: File|null;
  fileName?: string;
};

const MIN_SIZE = 2;
const MAX_SIZE = 8;

export const PollForm: React.FC<PollProps> = ({ question, setQuestion, optionSize, setOptionSize, pollOptions, setPollOptions, imageList, setImageList }) => {
    function handleOptionSizeChange(newSize: number) {
      let updatedPollOptions: PollOption[] = pollOptions;
      if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
        // if option size increased -> push n elements in options with n being diff between old and new option size
        if (newSize > pollOptions.length) {
          for (var i=pollOptions.length; i < newSize; i++) {
            updatedPollOptions.push({
              value: "",
              description: "",
              image: null,
              imageOptionUrl: "",
              id: 0
            });
          }
          // add image object
          const imageListUpdated = imageList;
          imageListUpdated.push({
            image: null,
            imageUrl: ""
          });
          setImageList(imageListUpdated);
        }
        // if option size decreased -> pop n elements in options with n being diff between old and new option size
        if (newSize < pollOptions.length) {
          for (var i=pollOptions.length-1; i >= newSize; i--) {
            updatedPollOptions.pop();
            // remove image
            const imageListUpdated = imageList;
            imageListUpdated.pop();
            setImageList(imageListUpdated);
          }
        }
        setPollOptions(updatedPollOptions);
      }
      setOptionSize(newSize);
    }
  
    function handleOptionChange(newValue: PollOption, id: number,) {
      let updatedPollOptions: PollOption[] = pollOptions;
      updatedPollOptions[id] = newValue;
      setPollOptions(updatedPollOptions);
    }

    // POLL RENDERER
    return (
        <div id="poll-watchparty">
          {/* POLL QUESTION */}
          <div>
            <Label htmlFor="poll-watchparty-question">Poll Question</Label>
            <Input
              id="poll-watchparty-question"
              placeholder="e.g, Which do you prefer?"
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
            />
          </div>
          {/* OPTION SIZE */}
          <div>
            <Label htmlFor="poll-watchparty-option-size">
              Option Size *choose from {MIN_SIZE} to {MAX_SIZE} options
            </Label>
            <Input
              id="poll-watchparty-option-size"
              type="number"
              value={optionSize}
              min={MIN_SIZE}
              max={MAX_SIZE}
              onChange={(e) => handleOptionSizeChange(e.target.valueAsNumber)}
              className="w-1/4 font-alatsi"
            />
          </div>

        {/* OPTIONS */}
         <div>
            <Label htmlFor="poll-watchparty-options">Options</Label>
            <div>
              <RadioGroup defaultValue="option-0">
                <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
                 {/* RENDERED LIST OF POLL OPTIONS BASED ON SIZE */}
                 {pollOptions.map((option, id) => 
                 <div className="flex flex-col h-full">
                  <PollOption
                      key={id}
                      pollOptionValue={option}
                      id={id}
                      onOptionValueChange={handleOptionChange}
                      imageList={imageList}
                      setImageList={setImageList}
                  />
                 </div>
                )}
                </div>
              </RadioGroup>
            </div>
        </div>
      </div>
    );
  };

  export const PollOption = ({
    id,
    pollOptionValue,
    onOptionValueChange,
    imageList,
    setImageList
  }: PollOptionProps) => {
    const [imageUploadError, setImageUploadError] = useState<boolean>(false);
    const [value, setValue] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [image, setImage] = useState<File|null>(null);
    const [imageOptionUrl, setImageOptionUrl] = useState<string>('');
    const [pollOptionId, setPollOptionId] = useState<number>(0);

    useEffect(() => {
       // to set values if passed in -> for manage purposes
        if (pollOptionValue.id != pollOptionId) {
          setPollOptionId(pollOptionValue.id);
          setValue(pollOptionValue.value);
          setDescription(pollOptionValue.description ? pollOptionValue.description : "");
          setImageOptionUrl(pollOptionValue.imageOptionUrl);
        }
        // trigger option change when any of these input are changed
        onOptionValueChange({
          value,
          description,
          image,
          imageOptionUrl,
          id: pollOptionId
        }, id);
    }, [value, description, image, imageOptionUrl, pollOptionId, pollOptionValue]);
    
    function uploadNewImage(file: File) {
      const imageUrl = URL.createObjectURL(file);
          setImage(file);
          setImageOptionUrl(imageUrl);
          // update new image
          const imageListUpdated = imageList;
          imageListUpdated[id].image = file;
          imageListUpdated[id].imageUrl = imageUrl;
          setImageList(imageListUpdated);
      }
  
    // event handler for image upload
    function onImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
      if (e.target.files) {
        if (e.target.files[0].size >= 1048576) {
          setImageUploadError(true);
        } else {
          uploadNewImage(e.target.files[0]);
          setImageUploadError(false);
        }
      }
    }

    return (
      <div className="p-4 flex-grow flex flex-col justify-between relative z-10">
        {/* RADIO BUTTON WITH OPTION VALUE */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            style={{backgroundColor: "white"}}
            value={pollOptionValue.value}
            id={"option-" + id}
            disabled
            checked={false}/>
            <Input
              id={"input-" + id}
              value={value}
              type="text"
              className="w-full font-alatsi"
              placeholder={"Option " + (id+1)}
              onChange={(e) => setValue(e.target.value)}
              required
            />
        </div>
        {/* DESCRIPTION */}
        <div>
          <Label htmlFor="poll-option-description">Description</Label>
          <Textarea 
            id={"description-" + id}
            value={description}
            className="w-full font-alatsi"
            placeholder={"Please indicate a description."}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
        {/* IMAGE UPLOAD */}
        <div>
          <Label htmlFor="poll-option-image">Image</Label>
          <input 
            type="file" 
            name="option-image"
            onChange={(e) => onImageUpload(e)} />
            {imageOptionUrl &&
              <img
                src={imageOptionUrl} 
                width={100}
                height={100}/>
            }
            {imageUploadError && (
              <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                <p>Image size is too large. Please upload a file less than 1MB.</p>
              </div>
            )}
        </div>
      </div>
    );
  };

  export default PollForm;