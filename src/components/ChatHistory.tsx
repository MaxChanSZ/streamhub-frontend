import { useRef } from "react";
import { Message } from "./LiveChat";
import { ScrollArea } from "./shadcn/ui/scroll-area";

interface ChatHistoryProps {
  chatMessages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatMessages }) => {
  const msgRef = useRef(null);

  return (
    <ScrollArea className="px-2 my-4">
      {chatMessages.map((msg: Message, index) => (
        <p
          key={msg.messageID}
          className="my-2 text-[#A8A8A8] text-wrap text-start"
          // ref={index + 1 === chatMessages.length ? msgRef : null} //Verify if the card is the last one.
        >
          <strong>{msg.sender}:</strong> {msg.content}
        </p>
      ))}
    </ScrollArea>
  );
};

export default ChatHistory;
