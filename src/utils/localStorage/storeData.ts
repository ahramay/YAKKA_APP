import * as SecureStore from "expo-secure-store";
import { SignInResponse } from "../../models";

export const storeData = async <T extends string>(key: string, value: T) => {
  try {
    // console.log("storing ", key);
    await SecureStore.setItemAsync(key, value);
  } catch (e) {
    // saving error
    console.error(`Error using expo secure store`, e);
  }
};

export const storeTokens = async (tokens: SignInResponse) => {
  if (!tokens || !tokens.accessToken || !tokens.refreshToken) {
    throw new Error("Invalid tokens");
  }

  await storeData("accessToken", tokens.accessToken);
  await storeData("refreshToken", tokens.refreshToken);
};
