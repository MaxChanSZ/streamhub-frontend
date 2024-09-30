import { Label } from "@/pages/CreateWatchPartyPage";
import { Input } from "./shadcn/ui/input";
import { RadioGroup, RadioGroupItem } from "./shadcn/ui/radio-group"
import React, { useState } from "react";
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
};

interface PollProps {
  poll: Poll;
  setPoll: (poll: Poll) => void;
  optionSize?: number;
};

export type PollOptionProps = {
  id: number;
  value: string;
  description: string;
  image: Blob|null;
  onOptionValueChange(option: PollOption, id: number): void;
};


// for api calls
// to create poll in backend
export type PollRequestData = {
  watchPartyID: number | undefined;
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

export const Poll: React.FC<PollProps> = ({ poll, setPoll }) => {
    const [question, setQuestion] = useState<string>('');
    const [optionSize, setOptionSize] = useState<number>(2);
    const [options, setOptions] = useState<PollOption[]>([
      {value: "", description: "", image: null, imageOptionUrl: ""},
      {value: "", description: "", image: null, imageOptionUrl: ""},
    ]);

    // EVENT HANDLERS FOR POLL
    function handleQuestionChange(newValue: string) {
      setQuestion(newValue);
      setPoll({
        ...poll,
        question: newValue
      })
    }

    function handleOptionSizeChange(newSize: number) {
      setOptionSize(newSize);
      if (newSize >= MIN_SIZE && newSize <= MAX_SIZE) {
        // if option size increased -> push n elements in options with n being diff between old and new option size
        if (newSize > options.length) {
          for (var i=options.length; i < newSize; i++) {
            options.push({
              value: "",
              description: "",
              image: null,
              imageOptionUrl: ""
            });
          }
        }
        // if option size decreased -> pop n elements in options with n being diff between old and new option size
        if (newSize < options.length) {
          for (var i=options.length-1; i >= newSize; i--) {
            options.pop();
          }
        }
        setPoll({
          ...poll,
          options: options,
          optionSize: newSize
        })
      }
    }

    function handleOptionChange(newValue: PollOption, id: number) {
      options[id] = newValue;
      setOptions(options);
      setPoll({
        ...poll,
        options,
      })
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
              onChange={(e) => handleQuestionChange(e.target.value)}
              className="w-full font-alatsi"
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
            <div style={{padding: "8px"}}>
              <RadioGroup defaultValue="option-0">
                 {/* RENDERED LIST OF POLL OPTIONS BASED ON SIZE */}
                 {options.map((option, id) => 
                    <PollOptionList
                      key={id}
                      value={option.value}
                      description={option.description}
                      image={option.image}
                      id={id}
                      onOptionValueChange={handleOptionChange}
                  />
                )}
              </RadioGroup>
            </div>
        </div>
      </div>
    );
  };

  export const PollOptionList = ({
    value,
    id,
    onOptionValueChange
  }: PollOptionProps) => {
    const [option, setOption] = useState<PollOption>({
      value: "",
      description: "",
      image: null,
      imageOptionUrl: ""
    });

    // event handler triggered when value or description is changed
    function onOptionChange(newOption: PollOption, id: number) {
      setOption(newOption);
      onOptionValueChange(newOption, id);
    }

    // event handler for image upload
    function onImageUpload(e: React.ChangeEvent<HTMLInputElement>, id: number) {
      console.log(e.target.files);
      if (e.target.files) {
        const imageUrl = URL.createObjectURL(e.target.files[0]);
        onOptionChange({...option, image: e.target.files[0], imageOptionUrl: imageUrl}, id)
      }
    }

    return (
      <div>
        {/* RADIO BUTTON WITH OPTION VALUE */}
        <div className="flex items-center space-x-2">
          <RadioGroupItem
            style={{backgroundColor: "white"}}
            value={value}
            id={"option-" + id}
            disabled
            checked={false}/>
            <Input
              id={"input-" + id}
              value={option?.value}
              type="text"
              className="w-full font-alatsi"
              placeholder={"Option " + (id+1)}
              onChange={(e) => onOptionChange({...option, value: e.target.value}, id)}
              required
            />
        </div>
        {/* DESCRIPTION */}
        <div>
          <Label htmlFor="poll-option-description">Description</Label>
          <Textarea 
            id={"description-" + id}
            value={option?.description}
            className="w-full font-alatsi"
            placeholder={"Please indicate a description."}
            onChange={(e) => onOptionChange({...option, description: e.target.value}, id)}
          />
        </div>
        {/* IMAGE UPLOAD */}
        <div>
          <Label htmlFor="poll-option-image">Image</Label>
          <input 
            type="file" 
            name="option-image"
            onChange={(e) => onImageUpload(e, id)} />
            {option?.image &&
              <img
                src={option?.imageOptionUrl} 
                width={100}
                height={100}/>
            }
        </div>
      </div>
    );
  };

  export default Poll;