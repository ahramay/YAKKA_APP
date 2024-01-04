import {
  createNavigationContainerRef,
  DefaultTheme,
  NavigationContainer
} from "@react-navigation/native";
import React from "react";
// import LinkingConfiguration from "./LinkingConfiguration";
import { RootNavigator } from "./navigators/rootStackNavigator";
const navigationRef = createNavigationContainerRef();

export const Navigation = () => {
  return (
    <NavigationContainer
      ref={navigationRef}
      // linking={LinkingConfiguration}
      theme={DefaultTheme}
    >
      <RootNavigator />
    </NavigationContainer>
  );
};
