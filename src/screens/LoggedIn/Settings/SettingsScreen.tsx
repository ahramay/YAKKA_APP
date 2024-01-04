import { useState } from "react";
import { ListRenderItemInfo, TouchableOpacity, View } from "react-native";
import { FlatList } from "react-native-gesture-handler";
import { Text } from "../../../components";
import { colors } from "../../../constants";
import { HomeDrawerScreenProps } from "../../../navigation/navigation.props";
import NotificationModal from "../../../components/specifics/NotificationsModal";
import DeleteAccountModal from "../../../components/specifics/User/UserActions/DeleteAccountModal";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";

type settingsRow = {
  id: number;
  name: string;
  onPress: () => void;
  color?: string;
} | null;

export default function SettingsScreen({
  navigation,
  route
}: HomeDrawerScreenProps<"Settings">) {
  const [notificationsVisible, setNotificationsVisible] =
    useState<boolean>(false);
  const [userSettingsVisible, setUserSettingsVisible] =
    useState<boolean>(false);

  const profile = useMyProfile();

  const SettingsRowData: settingsRow[] = [
    {
      id: 0,
      name: "View Profile",
      onPress: () => {
        navigation.navigate("MyProfile");
      }
    },
    profile?.data?.isVerified || profile?.data?.verificationPending
      ? null
      : {
          id: 1,
          name: "Verify Account",
          onPress: () => navigation.navigate("VerifyAccount")
        },
    {
      id: 2,
      name: "Notifications",
      onPress: () => setNotificationsVisible(true)
    },
    {
      id: 3,
      name: "Contact syncing",
      onPress: () => navigation.navigate("ContactsSyncing")
    },
    {
      id: 4,
      name: "Emergency Contact",
      onPress: () => navigation.navigate("EmergencyContact")
    },
    {
      id: 5,
      name: "Blocked Contacts",
      onPress: () => navigation.navigate("BlockedContacts")
    },
    { id: 6, name: "Privacy", onPress: () => navigation.navigate("Privacy") },
    { id: 7, name: "Security", onPress: () => navigation.navigate("Security") },
    { id: 8, name: "Help", onPress: () => navigation.navigate("Help") },
    { id: 9, name: "About", onPress: () => navigation.navigate("About") },
    {
      id: 10,
      name: "Delete Account",
      onPress: () => {
        setUserSettingsVisible(true);
      },
      color: colors.red
    }
  ];

  const RenderItem = ({ item }: ListRenderItemInfo<settingsRow>) => {
    if (!item) return null;
    return (
      <TouchableOpacity className="w-full" onPress={item.onPress}>
        <Text size="lg" className="my-4" color={item.color}>
          {item.name}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <View
      style={{
        backgroundColor: colors.background,
        flex: 1,
        paddingHorizontal: 24,
        paddingTop: 60,
        marginTop: -60
      }}
    >
      <NotificationModal
        visible={notificationsVisible}
        setVisible={setNotificationsVisible}
      />
      <FlatList data={SettingsRowData} renderItem={RenderItem} />
      <DeleteAccountModal
        isOpen={userSettingsVisible}
        setIsOpen={setUserSettingsVisible}
      />
    </View>
  );
}
