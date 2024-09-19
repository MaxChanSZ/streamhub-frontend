import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import * as apiClient from "@/utils/api-client";
import { Message } from "@/components/LiveChat";
import { Emoji } from "@/components/EmojiReaction";

export interface MessagingClientOptions {
  roomID: string;
  onMessageReceived: (message: Message) => void; // Callback for when a new message is received
}

let client: any = null;

/**
 * Initializes WebSocket connection and subscribes to the chat topic
 */
export const initWebSocketConnection = (options: MessagingClientOptions) => {
  const { roomID, onMessageReceived } = options;

  // Set up WebSocket connection
  const brokerURL = "http://localhost:8080/chat";
  client = Stomp.over(() => new SockJS(brokerURL));
  client.reconnectDelay = 5000; // Try to reconnect every 5 seconds

  client.connect({}, () => {
    const topic = `/topic/chat/${roomID}`;
    console.log(`Listening to: ${topic}`);

    client.subscribe(topic, (message: any) => {
      const newMessage = JSON.parse(message.body);
      console.log(
        `NewMessage: ${newMessage.content} | ID: ${newMessage.messageID} | Timestamp: ${newMessage.timeStamp}`
      );

      // Call the callback with the new message
      onMessageReceived(newMessage);
    });
  });

  return () => {
    if (client && client.connected) {
      client.disconnect(() => {
        console.log("Disconnected from WebSocket");
      });
    }
  };
};

/**
 * Fetches past messages for the room
 */
export const getPastMessages = async (roomID: string): Promise<Message[]> => {
  try {
    const pastMessages: Message[] =
      await apiClient.getChatMessagesByRoomID(roomID);
    return pastMessages;
  } catch (error) {
    console.error("Failed to fetch past messages:", error);
    return []; // Return an empty array on failure
  }
};

export const sendMessageToChat = async (message: any) => {
  const client = Stomp.over(() => new SockJS("http://localhost:8080/chat"));
  client.connect({}, () => {
    client.send("/app/chat", {}, JSON.stringify(message));
  });
};

export const sendEmoji = async (reaction: Emoji) => {
  const client = Stomp.over(() => new SockJS("http://localhost:8080/emoji"));
  console.log(reaction);
  client.connect({}, () => {
    client.send("/app/emoji", {}, JSON.stringify(reaction));
  });
};
