import {
  RootLoggedOutStackList,
  RootLoggedInScreenProps
} from "../../navigation.props";
import HomeScreen from "../../../screens/LoggedIn/HomeScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { SigninSignupTabNavigator } from "./SigninSignupTabNavigator";
import LandingScreen from "../../../screens/LoggedOut/LandingScreen";
import ForgotPasswordScreen from "../../../screens/LoggedOut/ForgotPasswordScreen";
import { useRecoilValue } from "recoil";
import { landingScreenAtom } from "../../../recoil/landingScreenAtom";
import ResetPasswordScreen from "../../../screens/LoggedOut/ResetPasswordScreen";
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Stack = createNativeStackNavigator<RootLoggedOutStackList>();

export const RootLoggedOutNavigator = () => {
  const skipLanding = useRecoilValue(landingScreenAtom);
  return (
    <Stack.Navigator
      initialRouteName={skipLanding ? "SigninSignupTabs" : "Landing"}
    >
      <Stack.Screen
        name="Landing"
        component={LandingScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="SigninSignupTabs"
        component={SigninSignupTabNavigator}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScreen}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen
        name="ResetPassword"
        component={ResetPasswordScreen}
        options={{
          headerShown: false
        }}
      />
    </Stack.Navigator>
  );
};
