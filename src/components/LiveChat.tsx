import { Button } from "./shadcn/ui/button";
import SockJS from "sockjs-client";
import { IFrame, Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import { useAppContext } from "@/contexts/AppContext";
import axios from "axios";

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
    client.reconnectDelay = 50000; // Try to reconnect every 5 seconds

    client.connect({}, (frame: IFrame) => {
      const topic = `/topic/chat/${roomID}`;
      // const topic = `/topic/chat`;
      console.log(`Listening to: ${topic}`);
      client.subscribe(topic, (message) => {
        const newMessage = JSON.parse(message.body);
        console.log(
          `NewMessage: ${newMessage.content} | ID: ${newMessage.messageID}`
        );
        console.log(
          `timeStamp: ${new Date(newMessage.timeStamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false })}`
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
  }, [roomID]);

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
    <div className="justify-center flex flex-col text-white text-center">
      <h1 className="text-5xl font-bold my-4">Test Page</h1>
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
        <Button type="submit">Enter</Button>
      </form>

      <form
        className="flex flex-col my-4"
        onSubmit={(event) => {
          event.preventDefault();
          sendMessage();
        }}
      >
        <label>Send Message</label>
        <input
          type="text"
          value={messageToSend}
          onChange={(event) => setMessageToSend(event.target.value)}
          className="flex-none py-2 text-black text-center grow-0"
        />
        <Button className="my-5" type="submit">
          Send
        </Button>
      </form>

      <div className="flex gap-2.5 mb-4">
        {messages.map((msg) => (
          // <p key={msg.messageID}>
          //   <strong>{msg.sender}:</strong> {msg.content} | {msg.timeStamp}
          // </p>

          <div className="" key={msg.messageID}>
            <h5 className=" text-sm font-semibold leading-snug pb-1">
              {msg.sender}
            </h5>
            <div className="w-max grid">
              <div className="px-3.5 py-2 bg-gray-100 rounded justify-start items-center gap-3 inline-flex">
                <h5 className="text-gray-800 text-sm font-normal leading-snug">
                  {msg.content}
                </h5>
              </div>
              <div className="justify-end items-center inline-flex mb-2.5">
                <h6 className="text-xs font-normal leading-4 py-1">
                  {new Date(msg.timeStamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                    second: "2-digit",
                    hour12: false,
                  })}
                </h6>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Button onClick={clearMessages} variant="destructive" className="my-4">
        Clear Messages
      </Button>
      <h2 className="my-4 text-3xl">
        Room ID: {roomID === 0 ? "None" : roomID}
      </h2>
    </div>
  );
};

export default LiveChat;
