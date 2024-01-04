import { Feather, Ionicons } from "@expo/vector-icons";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { DrawerNavigationProp } from "@react-navigation/drawer";
import {
  CompositeNavigationProp,
  ParamListBase,
  RouteProp
} from "@react-navigation/native";
import React, { useEffect, useRef, useState } from "react";
import {
  Platform,
  SafeAreaView,
  TextStyle,
  TouchableOpacity,
  View
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRecoilState, useRecoilValue } from "recoil";
import { colors } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import { headerHeightAtom } from "../../../recoil/headerHeightAtom";
import { newNotificationsAtom } from "../../../recoil/newNotificationsAtom";
import { Button, Text } from "../../defaults";
import { weightObj } from "../../defaults/Text/Text.presets";
import BellIcon from "../../generics/Icons/Bell/Bell";
import BellRedDotIcon from "../../generics/Icons/Bell/BellRedDot";
import { HomeSVG } from "../../generics/Icons/HomeSvg";
import { SmartBackButton } from "../../generics/SmartBackButton";
import NotificationModal from "../NotificationsModal";

type TabHeaderProps = {
  route: RouteProp<ParamListBase>;
  //If you have a navigation prop that is possibly two navigation props i.e. Tabs nested inside a drawer use the CompositeNavigationProp
  navigation: CompositeNavigationProp<
    DrawerNavigationProp<ParamListBase>,
    BottomTabNavigationProp<ParamListBase>
  >;
  tabScreen?: boolean;
  homeScreen?: boolean;
  openNotification?: boolean;
  redDot?: boolean;
  topRightText?: string;
  backButtonText?: string;
  onTopRightPress?: () => void;
  title?: string;
  titleStyle?: TextStyle;
  myProfileScreen?: boolean;
};

export default function GreenHeader(props: TabHeaderProps) {
  const {
    route,
    navigation,
    tabScreen,
    homeScreen,
    backButtonText,
    topRightText,
    onTopRightPress,
    redDot = false,
    openNotification = false,
    myProfileScreen = false,
    title,
    titleStyle
  } = props;
  //Tab Screens have a home button
  //Home Screens have menu and notifications symbol
  //Nested Screens have smartback button & optional topRightText
  const headerRef = useRef<SafeAreaView>(null);
  const [headerHeight, setHeaderHeight] = useRecoilState(headerHeightAtom);
  const newNotifications = useRecoilValue(newNotificationsAtom);
  const [notificationsVisible, setNotificationsVisible] =
    useState<boolean>(false);
  const insets = useSafeAreaInsets();
  const measureHeader = () => {
    headerRef.current &&
      headerRef.current.measure(
        // @ts-ignore
        (x, y, width, height, pageX, pageY) => {
          // Measure the header and set recoil atom.
          // Height + offset from top of screen as this is negative here
          const newHeight =
            Platform.OS === "android"
              ? height - insets.top + 4
              : height + pageY + 4;
          setHeaderHeight(newHeight);
        }
      );
  };
  useEffect(() => {
    setNotificationsVisible(openNotification);
  }, [openNotification]);
  return (
    <SafeAreaView
      ref={headerRef}
      style={{ elevation: 1 }}
      className={`bg-primary ${ClassNames.OVERLAP} pt-6 pb-0 z-[100]  mt-0`}
      onLayout={measureHeader}
    >
      <View className="items-center pt-4 px-6 pb-3 flex-row justify-between w-full">
        <View className="items-start">
          {homeScreen ? (
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => navigation.openDrawer()}
            >
              <Ionicons
                name="menu"
                size={30}
                color="white"
                onPress={() => navigation.openDrawer()}
              />
            </TouchableOpacity>
          ) : tabScreen ? (
            <TouchableOpacity onPress={() => navigation.navigate("Home")}>
              <HomeSVG />
            </TouchableOpacity>
          ) : (
            <SmartBackButton
              text={backButtonText ? backButtonText : undefined}
              dumb={backButtonText ? true : false}
            />
          )}
        </View>
        <View className="flex-1 items-center">
          <Text
            weight="500"
            size="xl"
            color="white"
            className="text-center"
            style={titleStyle}
          >
            {title ? title : route.name.replace(/([A-Z])/g, " $1")}
          </Text>
        </View>
        <View className="items-end min-w-[45px]">
          {homeScreen ? (
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              onPress={() => setNotificationsVisible(true)}
            >
              {newNotifications || redDot ? <BellRedDotIcon /> : <BellIcon />}
            </TouchableOpacity>
          ) : myProfileScreen ? (
            <TouchableOpacity
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              style={{ right: -7 }}
              onPress={onTopRightPress}
            >
              <Ionicons name="menu" size={30} color="white" />
            </TouchableOpacity>
          ) : (
            topRightText && (
              <Button
                text={topRightText}
                preset="link"
                textStyle={{ fontFamily: weightObj["400"], fontSize: 15 }}
                onPress={onTopRightPress}
              />
            )
          )}
        </View>
      </View>
      {homeScreen && (
        <NotificationModal
          visible={notificationsVisible}
          setVisible={setNotificationsVisible}
        />
      )}
    </SafeAreaView>
  );
}
