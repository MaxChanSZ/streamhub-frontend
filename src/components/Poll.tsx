import { Label } from "@/pages/CreateWatchPartyPage";
import { Input } from "./shadcn/ui/input";
import { RadioGroup, RadioGroupItem } from "./shadcn/ui/radio-group"
import { useState } from "react";


export type Poll = {
    question: string;
    options: string[];
    optionSize: number;
};

export type PollOption = {
  id: number;
  value: string;
  onOptionValueChange(newValue: string, id: number): void;
}

interface PollProps {
  poll: Poll;
  setPoll: (poll: Poll) => void;
  optionSize?: number;
}

const MIN_SIZE = 2;
const MAX_SIZE = 8;

export const Poll: React.FC<PollProps> = ({ poll, setPoll }) => {
    const [question, setQuestion] = useState<string>('');
    const [optionSize, setOptionSize] = useState<number>(2);
    const [options, setOptions] = useState<string[]>(["", ""]);

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
            options.push("");
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

    function handleOptionChange(newValue: string, id: number) {
      options[id] = newValue;
      setOptions(options);
      setPoll({
        ...poll,
        options: options,
      })
    }

    return (
        <div id="poll-watchparty">
          {/* POLL QUESTION */}
          <div>
            <Label htmlFor="poll-watchparty-question">Poll Question</Label>
            <Input
              id="poll-watchparty-question"
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
                 {options.map((value, id) => 
                    <PollOption
                      key={id}
                      value={value}
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

  export const PollOption = ({
    value,
    id,
    onOptionValueChange
  }: PollOption) => {
    const [optionValue, setOptionValue] = useState<string>('');

    function onChange(newValue: string, id: number) {
      setOptionValue(newValue);
      onOptionValueChange(newValue, id);
    }

    return (
      <div className="flex items-center space-x-2">
        <RadioGroupItem
          style={{backgroundColor: "white"}}
          value={value}
          id={"option-" + id}
          disabled
          checked={false}/>
          <Input
            id={"input-" + id}
            value={optionValue}
            type="text"
            className="w-full font-alatsi"
            onChange={(e) => onChange(e.target.value, id)}
          />
        </div>
    );
  };

  export default Poll;