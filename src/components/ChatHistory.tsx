import { Message } from "./LiveChat";

interface ChatHistoryProps {
  chatMessages: Message[];
}

const ChatHistory: React.FC<ChatHistoryProps> = ({ chatMessages }) => {
  return (
    <div className="flex flex-col items-start px-2 my-4 mt-4">
      {chatMessages.map((msg: Message) => (
        <p
          key={msg.messageID}
          className="my-2 text-[#A8A8A8] text-wrap text-start"
        >
          <strong>{msg.sender}:</strong> {msg.content}
        </p>
      ))}
    </div>
  );
};

export default ChatHistory;