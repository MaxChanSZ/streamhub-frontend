import { Button } from "./shadcn/ui/button";
import SockJS from "sockjs-client";
import { IFrame, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import axios from "axios";
import { Input } from "./shadcn/ui/input";
import plus from "/plus-icon.svg";
import watchParty from "/watch-party.svg";

interface Message {
  messageID: number;
  content: string;
  sender: string;
  timeStamp: Date;
}

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const [roomID, setRoomID] = useState<number>(0);
  const { user } = useAppContext();

  useEffect(() => {
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

        // client listens to /topic/chat and executes arrow function when new message is received
        // in this case, the return value of /topic/chat is the list of all messages in the topic
        // hence, we will save the list of messages in this state

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
  }, [roomID]); // re-subscribe when roomID changes

  const sendMessage = () => {
    if (messageToSend.trim() !== "") {
      const client = Stomp.over(() => new SockJS("http://localhost:8080/chat"));
      client.connect({}, () => {
        const messagePayload = {
          type: "CHAT",
          content: messageToSend,
          sender: user?.username || "anon",
          sessionId: roomID, // TODO: change later
          // timestamp assigned in server
        };
        client.send("/app/chat", {}, JSON.stringify(messagePayload));
        console.log(messagePayload);
        setMessageToSend(""); // Clear input after sending
        console.log(user?.username ? user?.username : "anonymous");
      });
    }
  };

  const clearMessages = async () => {
    setMessages([]);
    await axios.get("http://localhost:8080/api/clearMessages");
  };

  return (
    <div className="justify-center flex flex-col text-white text-center bg-[#161616] px-6">
      {/* <h1 className="text-5xl font-bold my-4">Test Page</h1> */}
      <div className="place-content-end flex flex-row gap-2">
        <img src={plus} className="size-1/12 max-w-12 my-2"></img>
        <img src={watchParty} className="size-1/12 max-w-12 my-2"></img>
        {/* <p>icon</p> */}
      </div>
      <form
        className="flex flex-row text-center justify-center items-center"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <label className="text-lg font-bold">Enter Room ID:</label>
        <input
          type="number"
          value={roomID}
          onChange={(event) => setRoomID(Number(event.target.value))}
          className="flex-none text-black text-center grow-0 mx-4 py-2 px-1 font-semibold"
        ></input>

        <Button type="submit" variant="secondary">
          Enter
        </Button>
      </form>

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

      <div className="flex flex-col items-start px-2">
        {messages.map((msg) => (
          <p
            key={msg.messageID}
            className="my-2 text-[#A8A8A8] text-wrap text-start"
          >
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <div className="flex flex-row items-center justify-center py-4">
        <Button onClick={clearMessages} variant="destructive" className="mx-4">
          Clear Messages
        </Button>
        <h2 className="mx-4 text-2xl font-bold">
          Room ID: {roomID === 0 ? "None" : roomID}
        </h2>
      </div>
    </div>
  );
};

export default LiveChat;
