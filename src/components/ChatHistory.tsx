import { useEffect, useRef } from "react";
import { Message } from "./LiveChat";
import { ScrollArea } from "./shadcn/ui/scroll-area";

interface ChatHistoryProps {
  chatMessages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatMessages }) => {
  const msgRef = useRef(null);

  useEffect(() => {
    if (chatMessages.length > 0) {
      msgRef.current.scrollIntoView({ behavior: "smooth" }); //Use scrollIntoView to automatically scroll to my ref
    }
  }, [chatMessages.length]);

  return (
    <ScrollArea className="px-2 my-4 h-1/3">
      {/* <div className="flex flex-col items-start px-2 my-4 mt-4"> */}
      {chatMessages.map((msg: Message, index) => (
        <p
          key={msg.messageID}
          className="my-2 text-[#A8A8A8] text-wrap text-start"
          ref={index + 1 === chatMessages.length ? msgRef : null} //Verify if the card is the last one.
        >
          <strong>{msg.sender}:</strong> {msg.content}
        </p>
      ))}
      {/* </div> */}
    </ScrollArea>
  );
};

export default ChatHistory;
