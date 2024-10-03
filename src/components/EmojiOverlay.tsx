import { useEffect, useState, useCallback } from "react";
import { EmojiConnection } from "@/utils/messaging-client";
import { EmojiBubble } from "./EmojiBubble";
import { Emoji } from "./EmojiReaction";
import { EMOJI_REMOVE_DURATION } from "@/utils/constants";

export default function EmojiOverlay({ roomID }: { roomID: string }) {
  const [emojis, setEmojis] = useState<Emoji[]>([]);
  const EMOJI_DELAY = EMOJI_REMOVE_DURATION;

  const removeEmoji = useCallback((emojiId: string) => {
    setEmojis((currentEmojis) =>
      currentEmojis.filter((emoji) => emoji.ID !== emojiId)
    );
  }, []);

  useEffect(() => {
    const disconnect = EmojiConnection({
      roomID,
      onReceived: (newEmoji) => {
        const emojiWithTimestamp = { ...newEmoji };
        setEmojis((currentEmojis) => [...currentEmojis, emojiWithTimestamp]);

        setTimeout(() => {
          removeEmoji(newEmoji.ID);
        }, EMOJI_DELAY);
      },
    });

    return () => {
      disconnect();
    };
  }, [roomID, removeEmoji]);

  return (
    <div
      id="emoji-overlay-container"
      className="absolute bottom-0 left-0 z-3 h-full w-full pointer-events-none"
    >
      {emojis.map((emoji) => (
        <EmojiBubble key={`${emoji.ID}`} emoji={emoji} />
      ))}
    </div>
  );
}
