import { EmojiConnection } from "@/utils/messaging-client";
import { Emoji } from "./EmojiReaction";
import { useEffect, useState } from "react";

const EmojiOverlay = ({ roomID }: { roomID: string }) => {
  const [emojiQueue, setEmojiQueue] = useState<Emoji[]>([]);
  const DELAY = 500; // delay for timeout

  const disconnect = EmojiConnection({
    roomID,
    onReceived: (newEmoji) => {
      console.log(`${newEmoji.TYPE} received`);
      setEmojiQueue((queue) => [...queue, newEmoji]);
      // TODO: add emoji streams
    },
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      if (emojiQueue.length) {
        const [first, ...rest] = emojiQueue;
        setEmojiQueue(rest);
      }
    }, DELAY);
    disconnect();
    return () => clearTimeout(timer);
  }, [emojiQueue]);

  return (
    <div className="">
      {emojiQueue.map((emoji) => {
        return <div key={emoji.ID}>{emoji.TYPE + "" + emoji.ID}</div>;
      })}
      <p>{emojiQueue.length}</p>
    </div>
  );
};

export default EmojiOverlay;