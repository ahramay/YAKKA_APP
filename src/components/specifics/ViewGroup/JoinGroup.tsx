import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useMutation, useQuery } from "react-query";
import { Button, Text } from "../../defaults";
import { colors } from "../../../constants";
import { useViewGroup } from "../../../hooks/ReactQuery/useViewGroup";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { GroupType } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { MutationKeys } from "../../../constants/queryKeys";
import { YakkaUser } from "../../generics/Icons/YakkaUser";

type InviteToGroupProps = {
  group: GroupType;
};
export const JoinGroup = ({ group }: InviteToGroupProps) => {
  const { refetch } = useViewGroup(group.id);
  const joinGroupMutation = useMutation(
    MutationKeys.JOIN_GROUP,
    () =>
      goFetchLite(`users/groups/join/${group.id}`, {
        method: "POST"
      }),
    {
      onSuccess: () => {
        //@ts-ignore
        Toast.show({
          text1: `You have joined ${group.name}`
        });
        refetch();
      }
    }
  );

  return (
    <Button
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.lightGrey,
        backgroundColor: colors.background,
        height: "auto",
        borderWidth: 1
      }}
      preset="small"
      onPress={() => joinGroupMutation.mutate()}
    >
      <Text
        size="md"
        weight="400"
        style={{
          opacity: joinGroupMutation.isLoading ? 0.6 : 1
        }}
      >
        {"Join Group"}
      </Text>
      <YakkaUser
        svgProps={{ width: 18, height: 18, style: { marginLeft: 4 } }}
      />
    </Button>
  );
};
