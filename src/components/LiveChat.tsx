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
}

const LiveChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const { user } = useAppContext();

  useEffect(() => {
    const brokerURL = "http://localhost:8080/chat";

    const client = Stomp.over(() => new SockJS(brokerURL));
    client.reconnectDelay = 50000; // Try to reconnect every 5 seconds

    client.connect({}, (frame: IFrame) => {
      //   console.log("Connected: " + frame);

      client.subscribe("/topic/chat", (message) => {
        const newMessage = JSON.parse(message.body);
        console.log(
          `NewMessage: ${newMessage.content} | ID: ${newMessage.messageID}`
        );

        // client listens to /topic/hello and executes arrow function when new message is received
        // in this case, the return value of /topic/hello is the list of all messages in the topic
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
  }, []);

  const sendMessage = () => {
    if (messageToSend.trim() !== "") {
      const client = Stomp.over(() => new SockJS("http://localhost:8080/chat"));
      client.connect({}, () => {
        const messagePayload = {
          type: "CHAT",
          content: messageToSend,
          sender: user?.username || "anon",
          sessionId: 1234, // TODO: change later
        };
        client.send("/app/chat", {}, JSON.stringify(messagePayload));
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

      <div className="text-white">
        {messages.map((msg) => (
          <p key={msg.messageID}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      <Button onClick={clearMessages} variant="destructive" className="my-4">
        Clear Messages
      </Button>
      <p className="text-white">{messages.length}</p>
    </div>
  );
};

export default LiveChat;
