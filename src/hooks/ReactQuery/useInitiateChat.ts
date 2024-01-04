import { useNavigation } from "@react-navigation/native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useQuery } from "react-query";
import { QueryKeys } from "../../constants/queryKeys";
import { BasicProfile, InitiateChat } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";

export default function useInitiateChat(user: BasicProfile) {
  const navigation = useNavigation();

  return useQuery<InitiateChat>(
    QueryKeys.initiateChat(user.id),
    () => goFetchLite(`chats/${user.id}`, { method: "POST" }),
    {
      // Don't auto fetch the query if there is no selected friend
      enabled: false,
      // On success only runs if the query has refetched, we als need to nabigate if we pull from cache

      onSettled: (data, error) => {
        if (data) {
          // @ts-ignore
          navigation.navigate("Chat", {
            chatId: data.chatId,
            friend: user
          });
        }
      },

      onSuccess: data => {
        // @ts-ignore
        navigation.navigate("Chat", {
          chatId: data.chatId,
          friend: user
        });
      },
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: err?.response?.data?.message || "Something went wrong"
        });
      }
    }
  );
}
