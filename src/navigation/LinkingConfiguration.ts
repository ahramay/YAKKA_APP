// /**
//  * Learn more about deep linking with React Navigation
//  * https://reactnavigation.org/docs/deep-linking
//  * https://reactnavigation.org/docs/configuring-links
//  */

import { LinkingOptions } from "@react-navigation/native";
import * as Linking from "expo-linking";

import { RootLoggedInStackList } from "./navigation.props";

const linking: LinkingOptions<RootLoggedInStackList> = {
  prefixes: [Linking.makeUrl("/")],
  config: {
    screens: {
      ViewGroup: { path: "group" },
      HomeDrawer: {
        screens: { HomeTabs: {} }
      }
    }
  }
};

export default linking;
