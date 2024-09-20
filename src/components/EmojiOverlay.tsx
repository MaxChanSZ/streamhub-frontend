import { EmojiConnection } from "@/utils/messaging-client";

const EmojiOverlay = ({ roomID }: { roomID: string }) => {
  const disconnect = EmojiConnection({
    roomID,
    onReceived: (newEmoji) => {
      console.log(`${newEmoji.TYPE} received`);
      // TODO: add emoji streams
    },
  });

  return <div className="absolute inset-0 z-10"></div>;
};

export default EmojiOverlay;
