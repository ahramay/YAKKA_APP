import { atom } from "recoil";

export const newNotificationsAtom = atom<boolean>({
  key: "newNotifications",
  default: false
});
