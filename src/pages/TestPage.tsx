import { useState, useEffect } from "react";
import SockJS from "sockjs-client";
import { IFrame, Stomp } from "@stomp/stompjs";
import { Button } from "@/components/shadcn/ui/button";
import { useAppContext } from "@/contexts/AppContext";

interface Message {
  content: string;
  sender: string;
}

const TestPage = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [messageToSend, setMessageToSend] = useState<string>("");
  const { user } = useAppContext();

  useEffect(() => {
    const brokerURL = "http://localhost:8080/chat";

    const client = Stomp.over(() => new SockJS(brokerURL));
    client.reconnectDelay = 5000; // Try to reconnect every 5 seconds

    client.connect({}, (frame: IFrame) => {
      console.log("Connected: " + frame);

      client.subscribe("/topic/hello", (message) => {
        const newMessages = JSON.parse(message.body);
        setMessages(newMessages); // Update the list of messages
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
          content: messageToSend,
          sender: user?.username === undefined ? "anon" : user?.username, // or some identifier for the sender
          sessionId: "session-id", // or some session identifier
        };
        client.send("/app/hello", {}, JSON.stringify(messagePayload));
        setMessageToSend(""); // Clear input after sending
        console.log(user?.username);
      });
    }
  };

  return (
    <div className="justify-center flex flex-col text-white text-center">
      <h1 className="text-5xl font-bold my-4">Test Page</h1>

      <form
        className="flex flex-col my-4"
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
      >
        <label>Send Message</label>
        <input
          type="text"
          value={messageToSend}
          onChange={(e) => setMessageToSend(e.target.value)}
          className="flex-none py-2 text-black text-center grow-0"
        />
        <Button className="my-5" type="submit">
          Send
        </Button>
      </form>

      <div className="text-white">
        {messages.map((msg, index) => (
          <p key={index}>
            <strong>{msg.sender}:</strong> {msg.content}
          </p>
        ))}
      </div>
      {/* <p className="text-white font-semibold">
        {user?.username === undefined ? "anon" : user?.username}
      </p> */}
    </div>
  );
};

export default TestPage;
