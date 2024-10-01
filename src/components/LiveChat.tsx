import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import axios from "axios";
import plus from "/plus-icon.svg";
import watchParty from "/watch-party.svg";
import * as apiClient from "@/utils/api-client";
import ChatInput from "./ChatInput";
import { LoadingSpinner } from "./LoadingSpinner";
import ChatHistory from "./ChatHistory";

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
  const { user } = useAppContext();

  useEffect(() => {
    const fetchMessagesAndSubscribe = async () => {
      if (roomID === "") return; // Prevent fetching if no room is selected

      setIsLoading(false); // TODO: Change back to true once May is done with her shit

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

      // Set up WebSocket connection
      const userToken = localStorage.getItem("watchparty-token");
      console.log(userToken);
      let token = userToken?.substring(1, userToken.length - 1);
      const brokerURL = `http://localhost:8080/chat?token=${token}&roomID=${roomID}`;
      const client = Stomp.over(() => new SockJS(brokerURL));
      client.reconnectDelay = 5000; // Try to reconnect every 5 seconds

      client.connect({}, () => {
        const topic = `/topic/chat/${roomID}`;
        console.log(`Listening to: ${topic}`);

        client.subscribe(topic, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log(
            `NewMessage: ${newMessage.content} | ID: ${newMessage.messageID} | Timestamp: ${newMessage.timeStamp}`
          );

          // Use functional update to prevent race condition
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      });

      return () => {
        if (client.connected) {
          client.disconnect(() => {
            console.log("Disconnected");
          });
        }
      };
    };

    fetchMessagesAndSubscribe();
  }, [roomID]); // re-subscribe when roomID changes

  const sendMessage = () => {
    if (messageToSend.trim() !== "") {
      const client = Stomp.over(() => new SockJS("http://localhost:8080/chat"));
      client.connect({}, () => {
        const messagePayload = {
          type: "CHAT",
          content: messageToSend,
          sender: user?.username || "anon",
          sessionId: roomID,
        };
        client.send("/app/chat", {}, JSON.stringify(messagePayload));
        setMessageToSend(""); // Clear input after sending
      });
    }
  };

  const getPastMessages = async (roomID: string): Promise<Message[]> => {
    try {
      const pastMessages: Message[] =
        await apiClient.getChatMessagesByRoomID(roomID);
      return pastMessages;
    } catch (error) {
      console.error("Failed to fetch past messages:", error);
      return []; // Return an empty array on failure
    }
  };

  const clearMessages = async () => {
    setMessages([]);
    await axios.get("http://localhost:8080/api/clearMessages");
  };

  return (
    <div className="flex flex-col text-white bg-[#161616] px-6 h-1/2">
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

      <>
        <div
          className={`${isLoading ? "opacity-50" : "opacity-100"} transition-opacity duration-${TRANSITION_DURATION_MS}`}
        >
          <ChatHistory chatMessages={messages} />
          <ChatInput
            messageToSend={messageToSend}
            setMessageToSend={setMessageToSend}
            sendMessage={sendMessage}
          />
        </div>
      </>
    </div>
  );
};

export default LiveChat;
