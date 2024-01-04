import {
  CardStyleInterpolators,
  createStackNavigator
} from "@react-navigation/stack";
import { useEffect } from "react";
import { useRecoilValue } from "recoil";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
import useNotifications from "../../../hooks/usePushNotifications";
import { signupScreensAtom } from "../../../recoil/signupAtoms";
import ChatScreen from "../../../screens/LoggedIn/Chat/ChatScreen";
import EditProfileScreen from "../../../screens/LoggedIn/ProfileFlow/EditProfileScreen";
import ReviewListScreen from "../../../screens/LoggedIn/ProfileFlow/ReviewListScreen";
import AboutScreen from "../../../screens/LoggedIn/Settings/AboutScreen";
import AccountScreen from "../../../screens/LoggedIn/Settings/AccountScreen";
import CheckPoseScreen from "../../../screens/LoggedIn/Settings/CheckPoseScreen";
import ContactsSyncingScreen from "../../../screens/LoggedIn/Settings/ContactsSyncingScreen";
import HelpScreen from "../../../screens/LoggedIn/Settings/HelpScreen";
import PrivacyScreen from "../../../screens/LoggedIn/Settings/PrivacyScreen";
import SecurityScreen from "../../../screens/LoggedIn/Settings/SecurityScreen";
import { requestNotificationPermissions } from "../../../utils/notifications/requestNotificationPermissions";
import { RootLoggedInStackList } from "../../navigation.props";
// import { getSignupProgress } from "../rootStackNavigator";
import BlockedContactsScreen from "../../../screens/LoggedIn/Settings/BlockedContactsScreen";
import EmergencyContactScreen from "../../../screens/LoggedIn/Settings/EmergencyContactScreen";
import VerifyAccountScreen from "../../../screens/LoggedIn/Settings/VerifyAccountScreen";
import LoadingScreen from "../../../screens/LoggedIn/SignUpFlow/1- LoadingScreen";
import AddContactsOnYakkaScreen from "../../../screens/LoggedIn/SignUpFlow/12a-AddContactsOnYakkaScreen";
import AddContactsToYakkaScreen from "../../../screens/LoggedIn/SignUpFlow/12b-AddContactsToYakkaScreen";
import { DrawerNavigator } from "./DrawerNavigator";
import { loadingAtom } from "../../../recoil/loadingAtom";
import AddGroupScreen from "../../../screens/LoggedIn/GroupsFlow/AddGroup/AddGroupScreen";
import SafetyScreen from "../../../screens/LoggedIn/Tabs/SafetyScreen";
import GroupScreen from "../../../screens/LoggedIn/GroupsFlow/GroupScreen";
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Stack = createStackNavigator<RootLoggedInStackList>();

export const RootLoggedInNavigator = () => {
  const signupScreens = useRecoilValue(signupScreensAtom);
  useNotifications();

  const loading = useRecoilValue(loadingAtom);
  useEffect(() => {
    // getSignupProgress(setSignupScreens);
    (async () => {
      await requestNotificationPermissions();
    })();
  }, []);

  // return null;
  return (
    <Stack.Navigator
      initialRouteName={
        //insert screen you want to check here
        signupScreens.length > 0
          ? signupScreens[0].name
          : loading
          ? "Loading"
          : "HomeDrawer"
      }
      screenOptions={{
        // cUSTOM HEADER
        headerShown: false,
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
      }}
    >
      {signupScreens.length > 0 ? (
        <>
          {signupScreens.map(val => {
            return (
              <Stack.Screen
                key={val.id}
                name={val.name}
                component={val.component}
              />
            );
          })}
          <Stack.Screen
            name={"AddContactsToYakka"}
            component={AddContactsToYakkaScreen}
          />
          <Stack.Screen
            name={"AddContactsOnYakka"}
            component={AddContactsOnYakkaScreen}
          />
        </>
      ) : (
        <>
          {loading && <Stack.Screen name="Loading" component={LoadingScreen} />}
          <Stack.Screen name="HomeDrawer" component={DrawerNavigator} />
          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({ navigation, route }) => (
                <GreenHeader
                  //@ts-expect-error
                  navigation={navigation}
                  route={route}
                  backButtonText="Settings"
                />
              )
            }}
          >
            <Stack.Screen name="Account" component={AccountScreen} />
            <Stack.Screen
              name="ContactsSyncing"
              component={ContactsSyncingScreen}
            />
            <Stack.Screen name="Privacy" component={PrivacyScreen} />
            <Stack.Screen name="Security" component={SecurityScreen} />
            <Stack.Screen name="Help" component={HelpScreen} />
            <Stack.Screen name="About" component={AboutScreen} />
            <Stack.Screen
              name="VerifyAccount"
              component={VerifyAccountScreen}
            />
            <Stack.Screen
              name="EmergencyContact"
              component={EmergencyContactScreen}
            />
            <Stack.Screen
              name="BlockedContacts"
              component={BlockedContactsScreen}
            />
          </Stack.Group>
          <Stack.Screen
            options={{
              headerShown: true,
              header: ({ navigation, route }) => (
                <GreenHeader
                  //@ts-expect-error
                  navigation={navigation}
                  route={route}
                  backButtonText="Settings"
                />
              )
            }}
            name="CheckPose"
            component={CheckPoseScreen}
          />
          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({ navigation, route }) => (
                <GreenHeader
                  //@ts-expect-error
                  navigation={navigation}
                  route={route}
                  backButtonText="Groups"
                />
              )
            }}
          >
            <Stack.Screen name="CreateGroup" component={AddGroupScreen} />
          </Stack.Group>
          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({ navigation, route }) => (
                <GreenHeader
                  //@ts-expect-error
                  navigation={navigation}
                  route={route}
                  backButtonText="Profile"
                />
              )
            }}
          >

          </Stack.Group>
          <Stack.Screen name="ViewGroup" component={GroupScreen} />

          <Stack.Group
            screenOptions={{
              headerShown: true,
              header: ({ navigation, route }) => (
                <GreenHeader
                  //@ts-expect-error
                  navigation={navigation}
                  route={route}
                  backButtonText="Profile"
                />
              )
            }}
          >
            <Stack.Screen name="SafetyScreen" component={SafetyScreen} />
            <Stack.Screen name="EditProfile" component={EditProfileScreen} />
            <Stack.Screen name="ReviewList" component={ReviewListScreen} />
            <Stack.Screen
              name="Chat"
              component={ChatScreen}
              options={{ headerShown: false }}
            />
          </Stack.Group>
        </>
      )}
    </Stack.Navigator>
  );
};
