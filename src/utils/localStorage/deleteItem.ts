import * as SecureStore from "expo-secure-store";

export const deleteItem = async (key: string) => {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.error(error);
  }
};
