import { useNavigation } from "@react-navigation/native";
import * as Notifications from "expo-notifications";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef } from "react";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useQueryClient } from "react-query";
import { setRecoil } from "recoil-nexus";
import { logout } from "../api/auth/logout";
import { QueryKeys } from "../constants/queryKeys";
import {
  RootLoggedInScreenProps,
  RootLoggedInStackList
} from "../navigation/navigation.props";
import { newNotificationsAtom } from "../recoil/newNotificationsAtom";
// Handles notification logic
// Sets what happens when the notification is recieved when app is foregrounded
// Sets what happens if the user taps on a notification
type PropType<TObj, TProp extends keyof TObj> = TObj[TProp];

const useNotifications = () => {
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const queryClient = useQueryClient();
  //prettier-ignore
  const navigation = useNavigation<PropType<RootLoggedInScreenProps<keyof RootLoggedInStackList>, "navigation">>();

  useEffect(() => {
    // This listener is fired whenever a notification is received while the app is foregrounded
    // used for debugging purposes to show the data of the notification in console log
    notificationListener.current =
      Notifications.addNotificationReceivedListener(notification => {
        if (notification?.request.content.data.type === "NEW_MESSAGE") {
          queryClient.refetchQueries(QueryKeys.CHATS);
        }
        // May need to refresh the notification list query here
      });

    Notifications.setNotificationHandler({
      // Show notification when app is foregrounded
      handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true
      })
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // We follow the convention of putting an action property in the data which we handle in the switch

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener(async response => {
        let responses = [];
        let responseData = response.notification.request.content.data;

        // if (!userData?.isLoggedIn) {
        //   errorToast({
        //     message: "You must be logged in for that"
        //   });
        //   return;
        // }

        queryClient.refetchQueries(QueryKeys.NOTIFICATIONS);

        switch (responseData?.type) {
          case "BLACKLISTED":
            logout();
            break;
          case "NEW_MESSAGE":
            try {
              //@ts-ignore
              navigation.navigate("LoggedIn", {
                screen: "Chat",
                params: {
                  chatId: responseData?.chatId,
                  friend: responseData?.friend
                }
              });
            } catch (error) {
              Toast.show({ text1: "You must be logged in for that" });
            }

            break;
          case "VERIFICATION_REMINDER":
          case "VERIFICATION_FAILED":
            try {
              navigation.navigate("LoggedIn", {
                screen: "VerifyAccount"
              });
            } catch (error) {
              Toast.show({ text1: "You must be logged in for that" });
            }
            break;
          default:
            setRecoil(newNotificationsAtom, false);

            try {
              await SplashScreen.hideAsync().catch(() => {});
              navigation.navigate("LoggedIn", {
                screen: "HomeDrawer",
                params: {
                  screen: "HomeTabs",
                  params: {
                    screen: "Home",
                    params: { openNotifications: true }
                  }
                }
              });
            } catch (error) {
              Toast.show({ text1: "You must be logged in for that" });
            }
            break;
        }
        // switch (responseData?.action) {
        //   case "rate_session":
        //     // Navigate to notification screen and pass props to open the review popup
        //     globalLoading(false);

        //     navigation.navigate("NotificationCentre", {
        //       showRateSession: true,
        //       data: responseData.rate_session_data
        //     });
        //     break;
        //   default:
        //     // For any other notifications, just open the notification screen
        //     globalLoading(false);
        //     navigation.navigate("NotificationCentre");
        //     break;
        // }
      });

    return () => {
      // Cleanup
      Notifications.removeNotificationSubscription(
        notificationListener.current
      );
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);
};

export default useNotifications;
