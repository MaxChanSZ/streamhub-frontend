import { sendMessageToChat } from "@/utils/messaging-client";
import { Button } from "./shadcn/ui/button";
import { Input } from "./shadcn/ui/input";
import { useAppContext } from "@/contexts/AppContext";

interface ChatInputProps {
  messageToSend: string;
  setMessageToSend: (message: string) => void;
  roomID: string;
}

const ChatInput = ({
  messageToSend,
  setMessageToSend,
  roomID,
}: ChatInputProps) => {
  const { user } = useAppContext();
  const sendMessage = (message: string) => {
    if (message.trim() !== "") {
      const messagePayload = {
        type: "CHAT",
        content: message,
        sender: user?.username || "anon",
        sessionId: roomID,
      };
      sendMessageToChat(messagePayload);
      setMessageToSend(""); // Clear input after sending
    }
  };

  return (
    <form
      className="my-4 flex flex-row items-center"
      onSubmit={(event) => {
        event.preventDefault();
        sendMessage(messageToSend);
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
