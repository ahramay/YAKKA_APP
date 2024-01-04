import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { Button, Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { BellSvg } from "../../../svgs/BellSvg";
import { storeData } from "../../../utils/localStorage";
import { requestNotificationPermissions } from "../../../utils/notifications/requestNotificationPermissions";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function AllowNotificationsScreen({
  navigation
}: RootLoggedInScreenProps<"AllowNotifications">) {
  const routeState = useRoute();
  const [isLoading, setIsLoading] = useState(false);
  const onPress = async (allow: boolean = false) => {
    if (allow) {
      setIsLoading(true);
      const token = await requestNotificationPermissions();
      if (token) {
        storeData("pushNotificationToken", token);
        Toast.show({
          text1: "Notifications Allowed"
        });
      } else {
        Toast.show({
          text1: "Something went wrong allowing notifications"
        });
      }
      setIsLoading(false);
    }

    signupNextNav({
      routeName: routeState.name,
      navigation: navigation
    });
  };

  return (
    <MottledGreenBackground>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <View style={[styles.container, { height: 200 }]}>
          <SmartBackButton style={{ alignSelf: "flex-start" }} dumb logout />
          <Text preset="title" style={{ alignSelf: "center", width: "75%" }}>
            Allow notifications
          </Text>
          <Text size="lg" style={{ textAlign: "center" }}>
            We use your location to show you potential YAKKAs in your area
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size={30} color={colors.black} />
        ) : (
          <>
            <BellSvg />
            <View
              style={{
                height: 100,
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <ContinueButton
                onPress={() => onPress(true)}
                text="Accept Notifications"
                noArrow
              />
              <Button
                preset="link"
                text="Not Now"
                textSize="md"
                textWeight="500"
                style={{ height: 30, paddingTop: 10 }}
                onPress={() => onPress()}
              />
            </View>
          </>
        )}
        <View style={{ height: "10%" }} />
      </SafeAreaView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  modalText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center"
  },
  separator: {
    height: 10,
    width: "80%"
  }
});
