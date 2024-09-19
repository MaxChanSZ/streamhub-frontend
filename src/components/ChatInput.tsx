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
      className="my-4 flex flex-row items-center"
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage();
      }}
    >
      <Input
        type="text"
        value={messageToSend}
        onChange={(event) => setMessageToSend(event.target.value)}
        className="bg-black font-sans font-medium border-none"
        placeholder="Type your message here"
      ></Input>
      <Button className="mx-5 bg-[#11061F] hover:bg-[#A8A8A8]" type="submit">
        Send
      </Button>
    </form>
  );
};

export default ChatInput;
