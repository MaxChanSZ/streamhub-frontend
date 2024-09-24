import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import plus from "/plus-icon.svg";
import watchParty from "/watch-party.svg";
import * as apiClient from "@/utils/api-client";
import ChatInput from "./ChatInput";
import { LoadingSpinner } from "./LoadingSpinner";
import ChatHistory from "./ChatHistory";
import EmojiOverlay from "./EmojiOverlay";
import EmojiReaction from "./EmojiReaction";
import {
  initWebSocketConnection,
  getPastMessages,
} from "@/utils/messaging-client";

export interface Message {
  messageID: number;
  content: string;
  sender: string;
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

  useEffect(() => {
    const fetchMessagesAndSubscribe = async () => {
      setIsLoading(false); // Start loading // TODO: change to true only outside of FDM
      // Fetch past messages
      try {
        const pastMessages = await getPastMessages(roomID);
        setMessages(pastMessages);
      } catch (error) {
        console.error("Error fetching past messages:", error);
      } finally {
        setTimeout(() => {
          setIsLoading(false); // End loading
        }, TRANSITION_DURATION_MS);
      }

      const disconnectConnection = initWebSocketConnection({
        roomID: roomID,
        onMessageReceived: (newMessage) => {
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        },
      });
      return () => {
        disconnectConnection();
      };
    };
    fetchMessagesAndSubscribe();
  }, [roomID]); // re-subscribe when roomID changes

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
          roomID={roomID}
        />
        <EmojiReaction roomID={roomID} />
      </div>

      <EmojiOverlay roomID={roomID} />
    </div>
  );
};

export default LiveChat;
