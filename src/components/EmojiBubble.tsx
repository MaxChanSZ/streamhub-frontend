import { Emoji } from "./EmojiReaction";
import "@/utils/EmojiBubble.css";
import {
  getRandomLeftPos,
  getRandomFontSize,
  uuid,
  getRandomDuration,
} from "@/utils/emoji-methods";
import { useMemo } from "react";

export const EmojiBubble: React.FC<{ emoji: Emoji }> = ({ emoji }) => {
  const newEmojis = useMemo(() => {
    return Array.from({ length: 5 }, () => ({
      ...emoji,
      ID: uuid(),
      POSITION: getRandomLeftPos(),
      SIZE: getRandomFontSize(),
      DURATION: getRandomDuration(),
    }));
  }, [emoji]);

  return (
    <>
      {newEmojis.map((emojiInstance) => {
        const style: React.CSSProperties = {
          position: "absolute",
          bottom: 0,
          fontSize: `${emojiInstance.SIZE}rem`,
          left: `${emojiInstance.POSITION}%`,
          animationDuration: `${emojiInstance.DURATION}s`,
        };

        return (
          <div key={emojiInstance.ID} style={style} className="bubble">
            {emojiInstance.TYPE}
          </div>
        );
      })}
    </>
  );
};
