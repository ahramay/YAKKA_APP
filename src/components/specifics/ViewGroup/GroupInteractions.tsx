import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { GroupType } from "../../../types/types";
import { JoinGroup } from "./JoinGroup";
import { ShareGroup } from "./ShareGroup";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { InviteFriends } from "./InviteFriends";

export const GroupInteractions = (props: { group: GroupType, isInviting:boolean, setIsInviting: ((value:boolean) => void) }) => {
  const { group , isInviting, setIsInviting} = props;
  // const chatQuery = useQuery<InitiateChat>(
  //   QueryKeys.initiateChat(group.creator.id),
  //   () => goFetchLite(`chats/${group.creator.id}`, { method: "POST" }),
  //   {
  //     // Don't auto fetch the query if there is no selected friend
  //     enabled: false,
  //     // On success only runs if the query has refetched, we als need to nabigate if we pull from cache

  //     onSettled: (data, error) => {
  //       if (data) {
  //         // @ts-ignore
  //         navigation.navigate("Chat", {
  //           chatId: data.chatId,
  //           friend: group.creator.id
  //         });
  //       }
  //     },

  //     onSuccess: data => {
  //       // @ts-ignore
  //       navigation.navigate("Chat", {
  //         chatId: data.chatId,
  //         friend: group.creator.id
  //       });
  //     },
  //     onError: (err: any) => {
  //       Toast.show({
  //         type: "error",
  //         text1: err?.response?.data?.message || "Something went wrong"
  //       });
  //     }
  //   }
  // );

  return (
    <View
      style={{
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
        paddingHorizontal: 16,
        paddingTop: 20,
        flexDirection: "row",
      }}
    >
      {!isInviting && (group.isMember ? <ShareGroup group={group} /> : <JoinGroup group={group} />)}
          {group.isOrganiser && <InviteFriends
          group={group}
          isInviting={isInviting}
          setIsInviting={setIsInviting}
          />}
          
    </View>
  );
};
