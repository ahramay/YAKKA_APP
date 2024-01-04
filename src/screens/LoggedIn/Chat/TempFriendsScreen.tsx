import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { useQuery } from "react-query";
import { QueryKeys } from "../../../constants/queryKeys";
import { FriendList, InitiateChat } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";

export default function TempFriendsScreen() {
  const navigation = useNavigation();
  const {
    isLoading,
    error,
    data: friends
  } = useQuery<FriendList>(
    [QueryKeys.FRIENDS],
    // Ideally go fetch would add the base URL to the path
    // Maybe a good idea to make a goFetchTemp or something that
    // doesn't have all the extra error handling, since React Query now provides an
    // easier to use error state
    () => goFetchLite("friends", { method: "GET" }),
    {
      // Can do success / error popups here
      // onSuccess: (data) => {
      //   console.log(data);
      // },
      // onError: (error) => {
      //   console.log(error);
      // }
    }
  );
  const [selectedFriend, setSelectedFriend] = useState<number>();

  const {
    data: chat,
    status,
    refetch
  } = useQuery<InitiateChat>(
    // This is a dynamic query key, consits of 'chat' and then the selected friend ID so we cache
    // The result unique for the friend
    [QueryKeys.CHAT, selectedFriend],
    () => goFetchLite(`chats/${selectedFriend}`, { method: "POST" }),
    {
      // Don't auto fetch the query if there is no selected friend
      enabled: !!selectedFriend && !!friends?.friends,
      onSuccess: data => {
        // TODO:
        // @ts-ignore
        navigation.navigate("Chat", {
          chatId: data.chatId,
          // Can either pass through the object, or use React query to fetch the friend profile
          // which will already be cached most likely
          // @ts-ignore
          friend: friends?.friends.find(f => f.id === selectedFriend)
        });
      }
    }
  );

  // Can choose to render a loading state or error state here or in the main component with
  // a ternary operator
  if (error) return <Text>error</Text>;
  if (isLoading) return <Text>loading</Text>;

  return (
    <View>
      <Text>
        temp friends screen to test chat, delete once the proper one is ready
      </Text>
      <View className="space-y-6 bg-slate-400 flex items-center p-6">
        {friends?.friends.map(friend => (
          <TouchableOpacity
            onPress={() => {
              setSelectedFriend(friend.id);
              refetch();
            }}
            key={friend.id}
            className="border-b-white border-b"
          >
            <Text className="text-white text-lg ">
              {friend.firstName} {friend.lastName}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}
