import { atom } from "recoil";

export const headerHeightAtom = atom<number>({
  key: "headerHeight",
  default: 50
});
