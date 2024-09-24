import { Button } from "./shadcn/ui/button";
import { Input } from "./shadcn/ui/input";

interface ChatInputProps {
  messageToSend: string;
  setMessageToSend: (message: string) => void;
  sendMessage: () => void;
}

const ChatInput = ({
  messageToSend,
  setMessageToSend,
  sendMessage,
}: ChatInputProps) => {
  return (
    <form
      className="px-1 my-4 flex flex-row gap-x-3 justify-between order-last"
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage();
      }}
    >
      <div className="w-full">
        <Input
          type="text"
          value={messageToSend}
          onChange={(event) => setMessageToSend(event.target.value)}
          className="bg-black font-sans font-medium text-[#A8A8A8] border-none"
          placeholder="Type something ..."
        ></Input>
      </div>
      <div className="order-last">
        <Button className="bg-[#11061F] hover:bg-[#A8A8A8] " type="submit">
          Send
        </Button>
      </div>
    </form>
  );
};

export default ChatInput;
