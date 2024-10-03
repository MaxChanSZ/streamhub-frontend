import { EMOJI_FONT_SIZES, EMOJI_DURATIONS } from "./constants";

export const getRandomFontSize = () => {
  const [min, max] = EMOJI_FONT_SIZES;
  return Number((Math.random() * (max - min + 1) + min).toFixed(1));
}

export const getRandomLeftPos = () => Math.floor(Math.random() * 80 + 1);

export const getRandomDuration = (min: number = EMOJI_DURATIONS[0], max: number = EMOJI_DURATIONS[1]) => 
  Math.floor(Math.random() * (max - min + 1)) + min;

export const uuid = () => {
  var S4 = function() {
     return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
  };
  return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}