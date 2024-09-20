import { useAppContext } from "@/contexts/AppContext";
import { sendEmoji } from "@/utils/messaging-client";

export interface EmojiReaction {}

export type Emoji = {
  TYPE: EmoteType;
  SESSION_ID: string;
  SENDER: string | undefined;
};

// export type EmoteType = "😂" | "😘" | "😭" | "😡" | "🥶";
export type EmoteType = "HEART" | "SMILEY_FACE" | "SAD_FACE";

const EmojiReaction = ({ roomID }: { roomID: string }) => {
  const { user } = useAppContext();

  const sendEmojiReaction = (emojiType: EmoteType, roomID: string) => {
    console.log("sending " + emojiType);
    const emoji = {
      TYPE: emojiType,
      SESSION_ID: roomID,
      SENDER: user?.username,
    };
    sendEmoji(emoji);
  };

  return (
    <div className="text-2xl">
      {/* https://unicode.org/emoji/charts/full-emoji-list.html */}
      <button onClick={() => sendEmojiReaction("HEART", roomID)}>
        {/* sends a heart icon */}
        🩷
      </button>
      <button onClick={() => sendEmojiReaction("SMILEY_FACE", roomID)}>
        {/* sends a smiley face icon */}
        🙂
      </button>
      <button onClick={() => sendEmojiReaction("SAD_FACE", roomID)}>
        {/* sends a sad face icon */}
        {String.fromCodePoint(0x1f641)}
      </button>
    </div>
  );
};

export default EmojiReaction;
