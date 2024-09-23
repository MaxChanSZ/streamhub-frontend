import { EmojiConnection } from "@/utils/messaging-client";
import { Emoji } from "./EmojiReaction";
import { useState } from "react";

const EmojiOverlay = ({ roomID }: { roomID: string }) => {
  const [emojiQueue, setEmojiQueue] = useState<Emoji[]>([]);

  const disconnect = EmojiConnection({
    roomID,
    onReceived: (newEmoji) => {
      console.log(`${newEmoji.TYPE} received`);
      setEmojiQueue((queue) => [...queue, newEmoji]);
      // TODO: add emoji streams
    },
  });

  return (
    <div className="">
      {emojiQueue.map((emoji) => {
        return <div key={emoji.ID}>{emoji.TYPE}</div>;
      })}
    </div>
  );
};

export default EmojiOverlay;
