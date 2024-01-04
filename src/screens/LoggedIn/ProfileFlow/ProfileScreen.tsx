import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useState } from "react";
import { View } from "react-native";
import AddYakkaModal from "../../../components/specifics/AddYakka/AddYakkaModal";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
import { Profile } from "../../../components/specifics/User/Profile";
import UserActionsModal from "../../../components/specifics/User/UserActions/UserActionsModal";
import { colors } from "../../../constants";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";
import { useProfile } from "../../../hooks/ReactQuery/useProfile";
import {
  HomeDrawerScreenProps,
  HomeTabScreenProps
} from "../../../navigation/navigation.props";

export default function ProfileScreen({
  navigation,
  route
}: HomeTabScreenProps<"Profile">) {
  const userId = route.params?.id;
  const isUser = userId === undefined;
  const openSettings = route.params?.settingsOpen; //use if you want to open screen with settings/action tab open
  const [visible, setVisible] = useState<boolean>(
    openSettings === undefined ? false : openSettings
  );

  const [addYakkaModalOpen, setAddYakkaModalOpen] = useState<boolean>(
    route.params?.openAddYakkaModal || false
  );
  const { data, refetch } = userId ? useProfile(userId) : useMyProfile();
  const user = data;

  useFocusEffect(
    useCallback(() => {
      refetch();
      if (route.params?.openAddYakkaModal) {
        setAddYakkaModalOpen(true);
      }
    }, [route?.params?.id, route.params?.openAddYakkaModal])
  );

  return (
    <View style={{ backgroundColor: colors.background }}>
      <GreenHeader
        /*@ts-expect-error*/
        navigation={navigation}
        route={route}
        backButtonText="Back"
        onTopRightPress={() => {
          setVisible(false);
          setVisible(true);
        }}
        topRightText={isUser ? "Settings" : "Action"}
        tabScreen={isUser}
      />

      {data && (
        <UserActionsModal isOpen={visible} setIsOpen={setVisible} user={data} />
      )}
      {!isUser && data && (
        <AddYakkaModal
          userData={data}
          isOpen={addYakkaModalOpen}
          setIsOpen={setAddYakkaModalOpen}
        />
      )}
      {user && (
        <Profile
          openAddYakka={() => {
            setAddYakkaModalOpen(true);
          }}
          profile={user}
          isUser={isUser}
        />
      )}
    </View>
  );
}
