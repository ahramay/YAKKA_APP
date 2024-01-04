/**
 * If you are not familiar with React Navigation, refer to the "Fundamentals" guide:
 * https://reactnavigation.org/docs/getting-started
 *
 */

import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { useRecoilState } from "recoil";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { getData } from "../../utils/localStorage";
import { RootStackList } from "../navigation.props";
import { RootLoggedInNavigator } from "./LoggedIn/RootLoggedInNavigator";
import { RootLoggedOutNavigator } from "./LoggedOut/RootLoggedOutNavigator";

/**
 * A root stack navigator is often used for displaying modals on top of all other content.
 * https://reactnavigation.org/docs/modal
 */
const Stack = createNativeStackNavigator<RootStackList>();

export const RootNavigator = () => {
  const [loggedIn, setLoggedIn] = useRecoilState(loggedInAtom); //Get this from logged
  const checkLoggedIn = async () => {
    const token = await getData("accessToken");
    setLoggedIn(!!token);
    if (!token) {
      // Hide splash screen immediately if user is not logged in
      // If they are, we hide it after we get the signup progress
      await SplashScreen.hideAsync();
    }
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  return (
    <Stack.Navigator>
      {loggedIn ? (
        <Stack.Screen
          name={"LoggedIn"}
          component={RootLoggedInNavigator}
          options={{
            headerShown: false
          }}
        />
      ) : (
        <Stack.Screen
          name={"LoggedOut"}
          component={RootLoggedOutNavigator}
          options={{
            headerShown: false
          }}
        />
      )}
    </Stack.Navigator>
  );
};
