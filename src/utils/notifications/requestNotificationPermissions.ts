import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { baseUrl } from "../../api/config";
import { MutationKeys } from "../../constants/queryKeys";
import { goFetchLite } from "../goFetchLite";
import { storeData } from "../localStorage";

export const requestNotificationPermissions = async () => {
  console.log("[😷] -push notification function executing");
  let token: Notifications.ExpoPushToken | undefined = undefined;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log("[🫒] - current status:", existingStatus);
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      if (status !== "granted") {
        // alert("Failed to get push token for push notification!");
        return;
      }
      finalStatus = status;
    }
    try {
      token = await Notifications.getExpoPushTokenAsync({
        projectId: "b4853d98-550c-47bd-8638-fb2c04182915"
      });
      console.log("[🧀] - token object:", token);
    } catch (err) {
      console.log("[🐭] - fetch token error", err);
    }
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C"
    });
  }

  if (token) {
    console.log("token", token);
    token && storeData("pushNotificationsToken", token.data);

    console.log("[🍕]- returning push token", token);
    return token.data;
  }
  return;
};
