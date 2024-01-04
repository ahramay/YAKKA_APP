import { EditProfile } from "./EditProfileButton";

import { FontAwesome5 } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";
import Toast from "react-native-toast-message";
import { useQuery } from "react-query";
import { colors } from "../../../../constants";
import { QueryKeys } from "../../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../../navigation/navigation.props";
import { GetProfileResponse, InitiateChat } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { Button, Text } from "../../../defaults";
import { AddFriendButton } from "./AddFriendButton";
import { AddYakkaButton } from "./AddYakkaButton";

export const ProfileButtons = (props: {
  user: GetProfileResponse;
  isUser: boolean;
  openAddYakka: () => void;
}) => {
  const { user, isUser, openAddYakka } = props;
  const navigation =
    useNavigation<RootLoggedInScreenProps<"Profile">["navigation"]>();
  const chatQuery = useQuery<InitiateChat>(
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

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 15,
        paddingVertical: 10,
        top: -40
      }}
    >
      {/* First row with either edit profile or add friend (add yakka if already a friend)*/}
      {!isUser ? (
        <View className="flex-1 flex-row justify-center h-8 w-full mb-4">
          <AddYakkaButton user={user} openAddYakka={openAddYakka} />
          <AddFriendButton user={user} />
        </View>
      ) : (
        <EditProfile />
      )}
      {/* Second row with yakkas and review button */}
      <View className="flex-row items-center">
        <Button
          style={{
            marginRight: 10,
            backgroundColor: colors.greenYakka,
            minWidth: 75
          }}
          disabled={false}
          ignoreDisabledOpacity
          preset="small"
          text="YAKKAS"
          onPress={() =>
            navigation.navigate("HomeDrawer", {
              screen: "HomeTabs",
              params: {
                screen: "FindYakkas",
                params: { openAddYakkaModal: false, tab: "recommended" }
              }
            })
          }
        />
        <Text style={{ color: colors.greyText }}>{user.totalYakkas}</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity
          disabled={user.reviews.total === 0}
          style={{ flexDirection: "row", alignItems: "center" }}
          onPress={() => {
            navigation.navigate("ReviewList", { userId: user.id });
          }}
        >
          <Rating
            startingValue={user.reviews.average}
            style={{ marginRight: 10 }}
            imageSize={14}
            readonly
          />
          <Text preset="blue">{user.reviews.total} reviews</Text>
        </TouchableOpacity>
      </View>
      {/* third row with groups and chat button */}
      <View className="flex-row items-center my-2">
        <View className="flex-row items-center">
          <Button
            style={{
              marginRight: 10,
              backgroundColor: colors.greenYakka,
              minWidth: 75
            }}
            disabled={false}
            ignoreDisabledOpacity
            preset="small"
            text="GROUPS"
            onPress={() =>
              navigation.navigate("HomeDrawer", {
                screen: "HomeTabs",
                params: {
                  screen: "FindGroups",
                  params: { tab: "personal" }
                }
              })
            }
          />
          <Text style={{ color: colors.greyText }}>{user.totalGroups}</Text>
        </View>
        <View style={{ flex: 1 }} />
        {!isUser && (
          <Button
            onPress={() => chatQuery.refetch()}
            preset="link"
            text="Chat"
            textPreset="blue"
            childrenLeft={
              <FontAwesome5
                name="comment-dots"
                size={26}
                color={colors.greenYakka}
                style={{ marginRight: 8, top: 1 }}
              />
            }
          />
        )}
      </View>
    </View>
  );
};
