import { atom } from "recoil";
import { checkSignupProgressSchema } from "../models";
import { SignUpScreenProps } from "../utils/signupConfig";

export const defaultSignupProgressValue = {
  phoneVerified: false,
  verificationImageUploaded: false,
  profileImagesUploaded: false,
  profileCompleted: false,
  interestsCompleted: false,
  hashtagsCompleted: false
};

export const signupScreensAtom = atom<SignUpScreenProps[]>({
  key: "signupScreens",
  default: []
});

export const signupProgressAtom = atom<checkSignupProgressSchema["progress"]>({
  key: "phoneValidated",
  default: defaultSignupProgressValue
});
