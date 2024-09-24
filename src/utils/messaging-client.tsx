import { Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import * as apiClient from "@/utils/api-client";
import { Message } from "@/components/LiveChat";
import { Emoji } from "@/components/EmojiReaction";

export interface MessagingClientOptions {
  roomID: string;
  onMessageReceived: (message: Message) => void; // Callback for when a new message is received
}

export interface EmojiClientOptions {
  roomID: string;
  onReceived: (emoji: Emoji) => void;
}

let client: any = null;
let emojiClient: any = null;

/**
 * Initializes WebSocket connection and subscribes to the chat topic
 */
export const initWebSocketConnection = (options: MessagingClientOptions) => {
  const { roomID, onMessageReceived } = options;

  // Set up WebSocket connection
  const brokerURL = "http://localhost:8080/chat";
  if (!client || !client.connected) {
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
  }

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
  console.log(message);
  const client = Stomp.over(() => new SockJS("http://localhost:8080/chat"));
  client.connect({}, () => {
    client.send("/app/chat", {}, JSON.stringify(message));
  });
};

export const sendEmoji = async (reaction: Emoji) => {
  if (emojiClient && emojiClient.connected) {
    emojiClient.send("/app/emoji", {}, JSON.stringify(reaction));
  }
};

export const EmojiConnection = (options: EmojiClientOptions) => {
  const { roomID, onReceived } = options;

  // Set up WebSocket connection
  // Avoid re-initializing the WebSocket connection if already connected
  if (!emojiClient || !emojiClient.connected) {
    emojiClient = Stomp.over(() => new SockJS("http://localhost:8080/emoji"));
    emojiClient.reconnectDelay = 5000; // Reconnect every 5 seconds if disconnected

    emojiClient.connect({}, () => {
      const topic = `/topic/emoji/${roomID}`;
      console.log(`Subscribed to: ${topic}`);

      // Subscribe to the emoji topic
      emojiClient.subscribe(topic, (message: any) => {
        const newEmoji = JSON.parse(message.body);
        console.log(`New Emoji received: ${newEmoji.type}`);

        // Construct the emoji object
        const constructedEmoji: Emoji = {
          TYPE: newEmoji.type,
          SESSION_ID: newEmoji.session_ID,
          SENDER: newEmoji.sender,
          ID: newEmoji.id,
        };

        // Trigger the callback with the new emoji
        onReceived(constructedEmoji);
      });
    });
  }

  return () => {
    if (emojiClient && emojiClient.connected) {
      emojiClient.disconnect(() => {
        console.log("Disconnected from WebSocket - emojiClient");
      });
      emojiClient = null;
    }
  };
};
