import { EmojiConnection } from "@/utils/messaging-client";
import { Emoji } from "./EmojiReaction";
import { useEffect, useState } from "react";
import { EmojiBubble } from "./EmojiBubble";

const EmojiOverlay = ({ roomID }: { roomID: string }) => {
  const [emojiQueue, setEmojiQueue] = useState<Emoji[]>([]);
  const DELAY = 4500; // delay for timeout

  useEffect(() => {
    const disconnect = EmojiConnection({
      roomID,
      onReceived: (newEmoji) => {
        console.log(`${newEmoji.TYPE} received`);
        setEmojiQueue((queue) => [...queue, newEmoji]);
      },
    });

    // Cleanup the WebSocket connection when the component unmounts or roomID changes
    return () => {
      disconnect(); // Properly disconnect the WebSocket
    };
  }, [roomID]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (emojiQueue.length) {
        const [first, ...rest] = emojiQueue;
        setEmojiQueue(rest);
      }
    }, DELAY);

    return () => {
      clearTimeout(timer);
    };
  }, [emojiQueue]);

  return (
    <div className="absolute bottom-0 left-0 z-3 h-full w-full">
      {emojiQueue.map((emoji) => {
        return <EmojiBubble emoji={emoji}/>;
      })}
    </div>
  );
};

export default EmojiOverlay;
