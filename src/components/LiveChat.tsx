import { Button } from "./shadcn/ui/button";
import SockJS from "sockjs-client";
import { IFrame, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import axios from "axios";
import { Input } from "./shadcn/ui/input";
import plus from "/plus-icon.svg";
import watchParty from "/watch-party.svg";
import ChatHistory from "./ChatHistory";
import LogoutButton from "./LogoutButton";
import * as apiClient from "@/utils/api-client";
import ChatInput from "./ChatInput";
import { LoadingSpinner } from "./LoadingSpinner";
// import { LoadingSpinner } from "./LoadingSpinner"; // Uncomment if needed

export interface Message {
  messageID: number;
  content: string;
  sender: string;
  timeStamp: Date;
}

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [roomID, setRoomID] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<boolean>(false); // To handle loading state
  const TRANSITION_DURATION_MS = 500;
  const { user } = useAppContext();

  useEffect(() => {
    const fetchMessagesAndSubscribe = async () => {
      if (roomID === 0) return; // Prevent fetching if no room is selected

      setIsLoading(true); // Start loading

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
      const brokerURL = "http://localhost:8080/chat";
      const client = Stomp.over(() => new SockJS(brokerURL));
      client.reconnectDelay = 5000; // Try to reconnect every 5 seconds

      client.connect({}, (frame: IFrame) => {
        const topic = `/topic/chat/${roomID}`;
        console.log(`Listening to: ${topic}`);

        client.subscribe(topic, (message) => {
          const newMessage = JSON.parse(message.body);
          console.log(
            `NewMessage: ${newMessage.content} | ID: ${newMessage.messageID}`
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

  const changeRoomID = (newRoomID: number) => {
    if (newRoomID !== roomID) {
      setMessages([]); // Clear previous messages
      setRoomID(newRoomID);
    }
  };

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

  const getPastMessages = async (roomID: number): Promise<Message[]> => {
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
    <div className="justify-center flex flex-col text-white text-center bg-[#161616] px-6">
      {/* Component title and icons */}
      <div className="flex flex-row items-center relative py-6 border-b-2 border-[#A8A8A8]">
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

      {/* Loading spinner */}
      {isLoading && (
        <div className="absolute inset-0 z-10 flex flex-col justify-center items-center bg-black bg-opacity-70">
          <h2 className="text-s font-bold font-alatsi">Loading</h2>
          <LoadingSpinner className="size-12 my-2" />
        </div>
      )}

      <>
        {/* roomID input for development only */}
        <form
          className="flex text-center justify-center items-center"
          onSubmit={(event) => {
            event.preventDefault();
            changeRoomID(roomID);
          }}
        >
          <label className="text-xs font-bold">Enter Room ID:</label>
          <input
            type="number"
            value={roomID}
            onChange={(event) => setRoomID(Number(event.target.value))}
            className="text-black text-center mx-4 py-2 px-1 font-semibold grow-0 border-none"
          ></input>

          <Button type="submit" variant="secondary">
            Enter
          </Button>
        </form>
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

      {/* For debugging and dev, remove when done */}
      <div className="flex flex-row items-center justify-center py-4">
        <Button onClick={clearMessages} variant="destructive" className="mx-4">
          Clear Messages
        </Button>
        <h2 className="mx-4 text-2xl font-bold">
          Room ID: {roomID === 0 ? "None" : roomID}
        </h2>
        <LogoutButton />
      </div>
    </div>
  );
};

export default LiveChat;
