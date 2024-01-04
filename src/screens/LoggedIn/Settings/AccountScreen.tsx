import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { WebView } from "react-native-webview";
import { Alert, ScrollView, View } from "react-native";
import { Button } from "../../../components";
import { logout } from "../../../api/auth/logout";
import { deleteAccount } from "../../../api/auth/useDeleteAccountMutation";
import { colors } from "../../../constants";

export default function AccountScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"Account">) {
  const alertDeletion = () => {
    Alert.alert(
      "Do you want to delete your account?",
      "This action cannot be undone.",
      [
        {
          text: "Yes",
          onPress: () => deleteAccount(),
          style: "destructive"
        },
        {
          text: "No",
          onPress: () => {},
          style: "default"
        }
      ],
      {
        cancelable: true,
        onDismiss: () => {}
      }
    );
  };

  return (
    <View className="items-center justify-center flex-1 bg-white -mt-16">
      <View className="flex-1" />
      <View className="flex-1 items-center justify-center">
        <Button text="Logout" onPress={logout} style={{ marginBottom: 20 }} />
        <Button
          text="Delete Account"
          onPress={alertDeletion}
          style={{ backgroundColor: colors.red }}
        />
      </View>
    </View>
  );
}
