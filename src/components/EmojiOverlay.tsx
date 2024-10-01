import { useEffect, useState } from "react";
import { EmojiConnection } from "@/utils/messaging-client";
import { EmojiBubble } from "./EmojiBubble"; // Component to display the emoji
import { Emoji } from "./EmojiReaction"; // Emoji type

const EmojiOverlay = ({ roomID }: { roomID: string }) => {
  const [emojiQueue, setEmojiQueue] = useState<Emoji[]>([]);
  useEffect(() => {
    // Initialize the WebSocket connection to receive emojis
    const disconnect = EmojiConnection({
      roomID,
      onReceived: (newEmoji) => {
        // Add the new emoji to the queue
        setEmojiQueue((queue) => [...queue, newEmoji]);

        // Automatically remove it after 4.5 seconds
        setTimeout(() => {
          setEmojiQueue((queue) => queue.filter((e) => e.ID !== newEmoji.ID));
        }, 4500);
      },
    });

    // Cleanup WebSocket when component unmounts
    return () => {
      disconnect();
    };
  }, [roomID]);

  // Function to dynamically render each EmojiBubble
  // const renderEmojiBubble = (emoji: Emoji) => {
  //   const container = document.getElementById("emoji-overlay-container");
  //   const emojiElement = document.createElement("div");

  //   // Set the ID so we can remove it later
  //   emojiElement.id = emoji.ID;

  //   // Set the content (this will be the emoji)
  //   emojiElement.innerHTML = `<div class="emoji">${emoji.TYPE}</div>`;

  //   // Add the emoji to the container
  //   container?.appendChild(emojiElement);

  //   // Set a timeout to remove the emoji after 4.5 seconds
  //   setTimeout(() => {
  //     document.getElementById(emoji.ID)?.remove();
  //   }, 4500);
  // };

  return (
    <div
      id="emoji-overlay-container"
      className="absolute bottom-0 left-0 z-3 h-full w-full"
    >
      {emojiQueue.map((emoji) => (
        <EmojiBubble key={emoji.ID} emoji={emoji} />
      ))}
    </div>
  );
};

export default EmojiOverlay;
