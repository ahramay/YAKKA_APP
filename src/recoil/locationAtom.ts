import { atom } from "recoil";

export const locationAtom = atom<{
  latitude: number;
  longitude: number;
} | null>({
  key: "location",
  default: null
});
