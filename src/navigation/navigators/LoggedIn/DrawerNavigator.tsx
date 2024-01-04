// Replace home tabs in root logged in navigator with drawer navigator,
// with home tab navigator as the first screen in the drawer navigator

import { Ionicons } from "@expo/vector-icons";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItem,
  DrawerItemList,
  DrawerScreenProps
} from "@react-navigation/drawer";
import { useRef, useState } from "react";
import { Alert, StyleSheet } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { G, Path } from "react-native-svg";
import { useSetRecoilState } from "recoil";
import { logout } from "../../../api/auth/logout";
import NotificationModal from "../../../components/specifics/NotificationsModal";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
import { colors } from "../../../constants/Colors";
import { ShadowStyle } from "../../../constants/CommonStyles";
import { loggedInAtom } from "../../../recoil/loggedInAtom";
import MyProfileScreen from "../../../screens/LoggedIn/ProfileFlow/MyProfileScreen";
import ProfileScreen from "../../../screens/LoggedIn/ProfileFlow/ProfileScreen";
import SettingsScreen from "../../../screens/LoggedIn/Settings/SettingsScreen";
import SafetyScreen from "../../../screens/LoggedIn/Tabs/SafetyScreen";
import {
  DrawerList,
  HomeDrawerScreenProps,
  TabsParamList
} from "../../navigation.props";
import { HomeTabNavigator } from "./HomeTabNavigator";
import { useNavigation } from "@react-navigation/native";
import { Safety } from "../../../components/generics/Icons/Safety";

/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */
const Drawer = createDrawerNavigator<DrawerList & TabsParamList>();

export const DrawerNavigator = () => {
  const { top } = useSafeAreaInsets();
  const drawerRef = useRef(null);
  const [notificationsVisible, setNotificationsVisible] =
    useState<boolean>(false);

  const navigation =
    useNavigation<HomeDrawerScreenProps<"HomeTabs">["navigation"]>();

  return (
    <>
      <NotificationModal
        visible={notificationsVisible}
        setVisible={setNotificationsVisible}
      />
      <Drawer.Navigator
        defaultStatus="closed"
        screenOptions={{
          drawerType: "front",
          drawerActiveBackgroundColor: colors.greenYakka,
          overlayColor: colors.transparent,
          swipeEnabled: false,
          // header: props => (
          //   <TabHeader route={subRoute} navigation={props.navigation} />
          // ),
          drawerItemStyle: styles.itemStyle,
          drawerLabelStyle: styles.labelText,
          drawerStyle: {
            ...ShadowStyle,
            height: "90%",
            maxWidth: "65%",
            borderBottomRightRadius: 100,
            marginTop: top + 15,
            justifyContent: "flex-start"
          },
          drawerContentContainerStyle: {
            width: "100%"
          }
        }}
        drawerContent={props => {
          return (
            <DrawerContentScrollView
              ref={drawerRef}
              contentContainerStyle={{
                justifyContent: "flex-start",
                paddingTop: 10
              }}
            >
              <TouchableOpacity
                style={styles.greyCircle}
                onPress={() => {
                  props.navigation.closeDrawer();
                }}
              >
                <Ionicons
                  size={22}
                  name="close"
                  style={{ fontWeight: "bold" }}
                  color={colors.dim}
                />
              </TouchableOpacity>
              <DrawerItem
                label="Profile"
                onPress={() =>
                  navigation.navigate("HomeTabs", { screen: "MyProfile" })
                }
                labelStyle={styles.labelText}
                style={styles.itemStyle}
                icon={(props: {
                  color: string;
                  size: number;
                  focused: boolean;
                }) => <DrawerIcon name="profile" color={props.color} />}
              />
              <DrawerItemList {...props} />
              <DrawerItem
                label="Sign out"
                onPress={() =>
                  Alert.alert(
                    "Sign out?",
                    "You will have to re-enter your details to sign back in",
                    [
                      {
                        text: "Cancel",
                        onPress: () => {},
                        style: "cancel"
                      },
                      { text: "Yes", onPress: logout }
                    ]
                  )
                }
                labelStyle={styles.labelText}
                style={styles.itemStyle}
                icon={(props: {
                  color: string;
                  size: number;
                  focused: boolean;
                }) => <DrawerIcon name="signout" color={props.color} />}
              />
            </DrawerContentScrollView>
          );
        }}
      >
        <Drawer.Screen
          name="HomeTabs"
          component={HomeTabNavigator}
          options={{
            headerShown: false,
            drawerItemStyle: { height: 0 }
          }}
        />

        <Drawer.Screen
          name="Safety"
          component={SafetyScreen}
          options={{
            title: "Safety",
            header: ({ navigation, route }) => (
              <GreenHeader navigation={navigation} route={route} tabScreen />
            ),
            drawerIcon: (props: {
              color: string;
              size: number;
              focused: boolean;
            }) => <DrawerIcon name="safety" color={props.color} />
          }}
        />
        <Drawer.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            title: "Settings",
            header: ({ navigation, route }) => (
              <GreenHeader navigation={navigation} route={route} tabScreen />
            ),
            drawerIcon: (props: {
              color: string;
              size: number;
              focused: boolean;
            }) => <DrawerIcon name="settings" color={props.color} />
          }}
        />
      </Drawer.Navigator>
    </>
  );
};

const Settings = () => (
  <G data-name="settings" fill="silver">
    <Path
      d="M21.256 13.4v-1.158l1.444-1.267a1.508 1.508 0 00.286-1.923L21.21 6.035a1.52 1.52 0 00-1.787-.678l-1.833.618a8.559 8.559 0 00-.988-.566l-.385-1.9a1.508 1.508 0 00-1.507-1.214h-3.53a1.508 1.508 0 00-1.508 1.214l-.385 1.9a8.657 8.657 0 00-1 .566L6.5 5.326a1.508 1.508 0 00-.482-.045 1.508 1.508 0 00-1.3.754L2.931 9.052a1.508 1.508 0 00.309 1.893l1.425 1.3V13.4L3.24 14.67a1.508 1.508 0 00-.309 1.923l1.78 3.016a1.52 1.52 0 001.787.678l1.833-.618a8.559 8.559 0 00.988.566l.385 1.9a1.508 1.508 0 001.508 1.214h3.559a1.508 1.508 0 001.508-1.214l.385-1.9a8.657 8.657 0 001-.566l1.825.618a1.52 1.52 0 001.787-.678l1.719-3.016a1.508 1.508 0 00-.309-1.893zm-1.35 5.46l-2.587-.875a6.681 6.681 0 01-2.044 1.184l-.535 2.707h-3.559l-.536-2.677a7.058 7.058 0 01-2.036-1.189l-2.593.845-1.78-3.016 2.051-1.81a6.712 6.712 0 010-2.36L4.236 9.806l1.78-3.016 2.584.874a6.681 6.681 0 012.046-1.184l.535-2.707h3.559l.536 2.677a7.058 7.058 0 012.036 1.184l2.593-.845 1.78 3.016-2.051 1.81a6.712 6.712 0 010 2.36l2.051 1.863z"
      transform="translate(-2.715 -2.295)"
    />
    <Path
      d="M15.775 20.3a4.48 4.48 0 113.213-1.312 4.525 4.525 0 01-3.213 1.312zm0-7.541a2.949 2.949 0 102.154.863 2.949 2.949 0 00-2.154-.863z"
      transform="translate(-5.529 -5.247)"
    />
  </G>
);

const Profile = () => (
  <G data-name="profile" fill="silver" fillRule="evenodd">
    <Path
      d="M20.727 11.864A4.364 4.364 0 1116.364 7.5a4.364 4.364 0 014.363 4.364zm-2.182 0a2.182 2.182 0 11-2.182-2.182 2.182 2.182 0 012.182 2.182z"
      transform="translate(-6.364 -4.279)"
    />
    <Path
      d="M11.5 1.5a10 10 0 1010 10 10 10 0 00-10-10zm-8.182 10a8.149 8.149 0 001.735 5.038 8.184 8.184 0 0112.954-.076A8.182 8.182 0 103.318 11.5zm8.182 8.182a8.148 8.148 0 01-5.156-1.829 6.366 6.366 0 0110.388-.062 8.149 8.149 0 01-5.232 1.891z"
      transform="translate(-1.5 -1.5)"
    />
  </G>
);
const Signout = () => (
  <G fill="silver">
    <Path
      d="M6.345 5.345H17.1v6.59h1.345v-6.59A1.345 1.345 0 0017.1 4H6.345A1.345 1.345 0 005 5.345v16.138a1.345 1.345 0 001.345 1.345H17.1a1.345 1.345 0 001.345-1.345h-12.1z"
      transform="translate(-5 -4)"
    />
    <Path
      d="M23.728 17.2a.672.672 0 00-.948.948l2.273 2.226H15.3a.672.672 0 000 1.345h9.75l-2.27 2.327a.672.672 0 10.948.948l3.927-3.9z"
      transform="translate(-8.155 -8.272)"
    />
  </G>
);

/**
 * You can explore the built-in icon families and icons on the web at https://icons.expo.fyi/
 */
function DrawerIcon(props: {
  name: "safety" | "settings" | "profile" | "signout";
  color: string;
}) {
  let DrawerIcon = () => <></>;
  switch (props.name) {
    case "safety":
      return <Safety color="silver" />;
      break;
    case "settings":
      DrawerIcon = Settings;
      break;
    case "profile":
      DrawerIcon = Profile;
      break;
    case "signout":
      DrawerIcon = Signout;
      break;
  }

  return (
    <Svg
      width={21}
      height={21}
      style={{ top: 1 }}
      viewBox="0 0 22 22"
      {...props}
    >
      <DrawerIcon />
    </Svg>
  );
}

const styles = StyleSheet.create({
  labelText: {
    fontFamily: "Roboto_500Medium",
    left: -20,
    color: colors.black,
    fontSize: 20
  },
  itemStyle: {
    width: "100%",
    zIndex: 100
  },
  greyCircle: {
    backgroundColor: colors.lightGreyBorder,
    alignSelf: "flex-end",
    right: 10,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  }
});
