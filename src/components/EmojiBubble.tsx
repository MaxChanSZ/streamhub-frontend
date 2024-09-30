import { Emoji } from "./EmojiReaction"
import '@/utils/EmojiBubble.css'
import { getRandomLeftPos, getRandomFontSize, uuid, getRandomDuration } from "@/utils/emoji-methods";

export const EmojiBubble: React.FC<{ emoji: Emoji }> = ({ emoji }) => {

  const newEmojis = Array.from({length:5}, () => ({
    ...emoji,
    ID: uuid(),
    POSITION: getRandomLeftPos(),
    SIZE: getRandomFontSize(),
    DURATION: getRandomDuration(),
  }))

  return (
    <div>
      {newEmojis.map((emoji) => {
        const style: React.CSSProperties = {
          position: "absolute",
          bottom: 0,
          fontSize:  `${emoji.SIZE}rem`,
          left: `${emoji.POSITION}%`,
          animationDuration:`${emoji.DURATION}s`
      
        };
        
        return (
        <div key={emoji.ID} style={style} className="bubble">
          {emoji.TYPE}
        </div>
        );
      })}
    </div>
  );
  
}