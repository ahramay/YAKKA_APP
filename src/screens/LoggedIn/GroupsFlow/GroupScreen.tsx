import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Group } from "../../../components/specifics/ViewGroup/Group";
import { colors } from "../../../constants";
import { useViewGroup } from "../../../hooks/ReactQuery/useViewGroup";
import {
  HomeDrawerScreenProps,
  RootLoggedInScreenProps
} from "../../../navigation/navigation.props";
import { GroupType } from "../../../types/types";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
const BOX_LENGTH = 100;
export default function GroupsScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"ViewGroup">) {
  const groupId = route.params?.id;
  // const isUser = userId === undefined;

  const { data, refetch } = useViewGroup(groupId!);
  const group = data?.groupYakka;

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [route?.params?.id])
  );

  // const tempGroupForStyling: GroupType = {
  //   id: 16,
  //   name: "Name here",
  //   description:
  //     "Big extra long la di da description perhaps with some lorem ipsum candis candem edit or something",
  //   date: new Date(),
  //   endTime: new Date(),
  //   reviews: { average: 3, total: 4 },
  //   image: { url: "https://picsum.photos/200/300", id: 0 },
  //   isOrganiser: false,
  //   isMember: true,
  //   isInvited: false
  // };

  return (
    <View style={{ backgroundColor: colors.background }}>
      <GreenHeader
        //@ts-expect-error
        navigation={navigation}
        route={route}
        title={" "}
        backButtonText="Groups"
        topRightText="Action"
      />
      {group ? (
        <Group isOrganiser={false} refetchGroup={refetch} group={group} />
      ) : (
        <View
          style={[
            styles.pic,
            {
              justifyContent: "center",
              alignItems: "center",
            }
          ]}
        >
          <ActivityIndicator size={60} color={colors.greenYakka} />
        </View>
      )}
    </View>
  );
}
const styles = StyleSheet.create({
  pic: {
    alignItems: "center",
    justifyContent: "center"
  }
});