import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import axios from "axios";
import plus from "/plus-icon.svg";
import watchParty from "/watch-party.svg";
import ChatInput from "./ChatInput";
import { LoadingSpinner } from "./LoadingSpinner";
import ChatHistory from "./ChatHistory";
import {
  initWebSocketConnection,
  getPastMessages,
  sendMessageToChat,
} from "@/utils/messaging-client";
import EmojiReaction from "./EmojiReaction";
import EmojiOverlay from "./EmojiOverlay";

export interface Message {
  messageID: number;
  content: string;
  sender: string;
  sessionID: string;
  timeStamp: Date;
  type: string;
}

interface LiveChatProps {
  roomID: string;
  setRoomID: (roomID: string) => void;
}

const LiveChat: React.FC<LiveChatProps> = ({ roomID, setRoomID }) => {
  const [messages, setMessages] = useState<Message[]>([]); // messages state
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // To handle loading state
  const TRANSITION_DURATION_MS = 500; // fixed transition period in milliseconds
  const { user } = useAppContext();

  useEffect(() => {
    if (roomID === "") return; // Prevent fetching if no room is selected

    const fetchMessagesAndSubscribe = async () => {
      setIsLoading(false); // Start loading //TODO change back to true when done

      // Fetch past messages
      try {
        const pastMessages = await getPastMessages(roomID);
        setMessages(pastMessages); // Set past messages in state
      } catch (error) {
        console.error("Error fetching past messages:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false); // End loading after transition
        }, TRANSITION_DURATION_MS);
      }

      // Initialize WebSocket connection
      const disconnectWebSocket = initWebSocketConnection({
        roomID,
        onMessageReceived: (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        },
      });

      // Cleanup function to disconnect WebSocket
      return () => {
        disconnectWebSocket();
      };
    };

    fetchMessagesAndSubscribe();
  }, [roomID]); // re-subscribe when roomID changes

  const sendMessage = () => {
    if (messageToSend.trim() !== "") {
      const messagePayload = {
        type: "CHAT",
        content: messageToSend,
        sender: user?.username || "anon",
        sessionId: roomID,
      };
      sendMessageToChat(messagePayload).then(() => {
        console.log(`Message sent: ${messageToSend} | Room: ${roomID}`);
      });
      setMessageToSend(""); // Clear input after sending
    }
  };

  // const clearMessages = async () => {
  //   setMessages([]);
  //   await axios.get("http://localhost:8080/api/clearMessages");
  // };

  return (
    <div className="flex flex-col text-white bg-[#161616] px-6 relative">
      {/* Component title and icons */}
      <div className="flex flex-row relative py-6 border-b-2 border-[#A8A8A8]">
        <h2 className="text-lg font-semibold font-alatsi">Live Chat</h2>
        <div className="place-content-end flex flex-row gap-2 absolute right-0">
          <button className="my-2">
            <img src={plus} className="min-h-8"></img>
          </button>
          <button className="my-2">
            <img src={watchParty} className="min-h-8"></img>
          </button>
        </div>
      </div>

      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-black bg-opacity-70">
          <h2 className="text-s font-bold font-alatsi">Loading</h2>
          <LoadingSpinner className="size-12 my-2" />
        </div>
      )}

      <div
        className={`${isLoading ? "opacity-50" : "opacity-100"} transition-opacity duration-${TRANSITION_DURATION_MS}`}
      >
        <div className="relative">
          <ChatHistory chatMessages={messages} />
          
        </div>
        <ChatInput
          messageToSend={messageToSend}
          setMessageToSend={setMessageToSend}
          sendMessage={sendMessage}
        />
        <EmojiReaction roomID={roomID} />
      </div>

      <EmojiOverlay roomID={roomID} />
    </div>
  );
};

export default LiveChat;
