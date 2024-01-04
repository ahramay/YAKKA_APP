import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";
import React, { useCallback, useRef, useState } from "react";
import { Pressable, ScrollView, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { VolumeManager } from "react-native-volume-manager";
import { useInfiniteQuery } from "react-query";
import { Text } from "../../../components";
import { weightObj } from "../../../components/defaults/Text/Text.presets";
import ColouredList from "../../../components/generics/ColouredList";
import Alarm from "../../../components/generics/Icons/Alarm";
import VerifiedBadge from "../../../components/generics/Icons/VerifiedBadge";
import ImageWithStatus from "../../../components/generics/ImageWithStatus";
import { SafetyInfoAccordion } from "../../../components/specifics/Safety/SafetyInfoAccordion";
import { colors, Layout } from "../../../constants";
import { DarkShadowStyle } from "../../../constants/CommonStyles";
import { QueryKeys } from "../../../constants/queryKeys";
import { HomeTabScreenProps } from "../../../navigation/navigation.props";
import {
  ChattingUsersResponse,
  NearbyUsersResponse
} from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";

export default function ChatsScreen({
  navigation,
  route
}: HomeTabScreenProps<"Chats">) {
  const chatsQuery = useInfiniteQuery<ChattingUsersResponse>(
    [QueryKeys.CHATS],
    ({ pageParam }) => {
      return goFetchLite("chats", {
        method: "GET",
        params: { page: pageParam }
      });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true,
      onSuccess: data => console.log("got data", data.pages[0].chats),
      onError: error => console.log("error getting chats", error)
    }
  );

  useFocusEffect(
    useCallback(() => {
      chatsQuery.refetch();
    }, [])
  );

  return (
    <View className="flex-1">
      {chatsQuery.data?.pages && (
        <ColouredList
          keyPrefix="nearby"
          allowOverflow
          onEndReached={() => {
            if (chatsQuery.hasNextPage) chatsQuery.fetchNextPage();
          }}
          startZIndex={99}
          items={chatsQuery.data.pages.flatMap(
            page =>
              page.chats?.map((chat, index) => {
                // console.log(user);
                return {
                  data: chat,
                  content: (
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("Chat", {
                          chatId: chat.id.toString(),
                          friend: chat.recipient
                        })
                      }
                      className={`flex-row justify-between overflow-visible items-center pt-4 -mt-4 w-full px-cnt`}
                    >
                      <View className="gap-y-2 flex-1 overflow-visible">
                        <View className="flex-row justify-between items-center">
                          <View>
                            <View className="flex-row items-center">
                              <Text
                                size="lg"
                                weight={chat.hasUnreadMessages ? "700" : "500"}
                                style={{
                                  color: "white",
                                  opacity: chat.hasUnreadMessages ? 1 : 0.7
                                }}
                              >
                                {chat.recipient.firstName}{" "}
                                {chat.recipient.lastName}
                              </Text>

                              {chat.recipient.isVerified && (
                                <VerifiedBadge
                                  style={{
                                    marginLeft: 5,
                                    opacity: chat.hasUnreadMessages ? 1 : 0.7
                                  }}
                                />
                              )}
                            </View>
                            <Text
                              size="sm"
                              weight={chat.hasUnreadMessages ? "500" : "400"}
                              style={{
                                color: "white",
                                opacity: chat.hasUnreadMessages ? 1 : 0.7
                              }}
                            >
                              {/* TODO: Return status label from API */}
                              {chat.recipient.status.slice(0, 1) +
                                chat.recipient.status
                                  .slice(1)
                                  .split("_")
                                  .join(" ")
                                  .toLowerCase()}
                            </Text>
                          </View>
                        </View>
                        {/* TODO: Return user BIO from API */}
                        {/* TODO: Small preset is bigger than xs_white */}
                        <Text
                          size="sm"
                          weight={chat.hasUnreadMessages ? "500" : "400"}
                          style={{
                            color: "white",
                            opacity: chat.hasUnreadMessages ? 1 : 0.7
                          }}
                        >
                          {chat.lastMessage.content.length > 100
                            ? chat.lastMessage.content.slice(0, 100) + "..."
                            : chat.lastMessage.content}
                        </Text>
                      </View>
                      <View className="ml-6 overflow-visible">
                        <ImageWithStatus
                          status={chat.recipient.status}
                          imageUrl={chat.recipient.image}
                          isVerified={chat.recipient.isVerified}
                        />
                      </View>
                    </TouchableOpacity>
                  )
                };
              }) || []
          )}
        />
      )}
    </View>
  );
}
