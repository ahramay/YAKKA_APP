import { useState } from "react";
import { View } from "react-native";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
import { Profile } from "../../../components/specifics/User/Profile";
import { colors } from "../../../constants";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";
import {
  HomeDrawerScreenProps,
  HomeTabScreenProps
} from "../../../navigation/navigation.props";
export default function MyProfileScreen({
  navigation,
  route
}: HomeTabScreenProps<"MyProfile">) {
  const { data } = useMyProfile();
  const user = data;

  return (
    <View style={{ backgroundColor: colors.background }}>
      <GreenHeader
        /*@ts-expect-error*/
        navigation={navigation}
        title="Profile"
        route={route}
        backButtonText="Back"
        myProfileScreen
        onTopRightPress={() => {
          navigation.navigate("Settings");
        }}
        tabScreen={true}
      />

      {user && <Profile openAddYakka={() => {}} profile={user} isUser={true} />}
    </View>
  );
}
