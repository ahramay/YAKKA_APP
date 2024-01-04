import { atom } from "recoil";
import { Audio } from "expo-av";
export const audioAtom = atom<Audio.Sound | null>({
  key: "audio",
  default: null
});
