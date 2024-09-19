import { Button } from "./shadcn/ui/button";
import { sendEmoji } from "@/utils/messaging-client";

export interface EmojiReaction {}

const EmojiReaction = () => {
  const sendHeart = () => {
    console.log("send heart");
    const emoji = {
      TYPE: "HEART",
      SESSION_ID: "123",
      SENDER: "Tim",
    };
    sendEmoji(emoji);
  };

  return (
    <>
      <Button variant="ghost" onClick={sendHeart}>
        send heart
      </Button>
    </>
  );
};

export default EmojiReaction;
