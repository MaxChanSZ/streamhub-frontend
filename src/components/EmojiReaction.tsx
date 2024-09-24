import { useAppContext } from "@/contexts/AppContext";
import { sendEmoji } from "@/utils/messaging-client";
import { useState } from "react";
import { toast } from "./shadcn/ui/use-toast";

export interface EmojiReaction {}

export type Emoji = {
  TYPE: string;
  SESSION_ID: string;
  SENDER: string | undefined;
  ID: string;
};

// export type EmoteType = "😂" | "😘" | "😭" | "😡" | "🥶";
export type EmoteType = "🩷" | "🙂" | "😢";

const EmojiReaction = ({ roomID }: { roomID: string }) => {
  const { user } = useAppContext();
  const [waiting, setWaiting] = useState<boolean>(false);
  const EMOJI_COOLDOWN_TIME = 1000;

  const emojiCoolDown = () => {
    setWaiting(true);
    setTimeout(() => {
      setWaiting(false);
    }, EMOJI_COOLDOWN_TIME);
  };

  const sendEmojiReaction = (emojiType: EmoteType, roomID: string) => {
    if (waiting) {
      console.log("waiting");
      toast({
        title: "Please wait",
        description: "You can only send one emoji every second",
        duration: 1000,
      });
      return;
    }

    emojiCoolDown(); // start timeout for next emoji

    console.log("sending " + emojiType);
    const emoji = {
      TYPE: emojiType,
      SESSION_ID: roomID,
      SENDER: user?.username,
      ID: (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1),
    };
    sendEmoji(emoji);
  };

  return (
    <div className="text-4xl">
      {/* https://unicode.org/emoji/charts/full-emoji-list.html */}
      <button onClick={() => sendEmojiReaction("🩷", roomID)}>
        {/* sends a heart icon */}
        🩷
      </button>
      <button onClick={() => sendEmojiReaction("🙂", roomID)}>
        {/* sends a smiley face icon */}
        🙂
      </button>
      <button onClick={() => sendEmojiReaction("😢", roomID)}>
        {/* sends a sad face icon */}
        😢
      </button>
    </div>
  );
};

export default EmojiReaction;
