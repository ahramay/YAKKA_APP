import { useEffect, useState } from "react";
import { Animated, TouchableOpacity, View } from "react-native";
import { colors, Layout } from "../../../constants";
import { sizeObj } from "../../defaults/Text/Text.presets";
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-n;lavigator
 */

const tabItemWidth = (item: string) => {
  return item === "Signin" ? 60 : item === "Signup" ? 64 : 0;
};

const TabBarIndicator = ({ state, lineWidthsPercent }: any) => {
  const [translateValue, setTranslateValue] = useState(
    new Animated.Value(Layout.window.width / 5)
  );
  // const [scaleValue, setScaleValue] = useState(
  //   new Animated.Value(Layout.window.width / 4)
  // );
  useEffect(() => {
    slide();
  }, [state]);
  const slide = () => {
    const toValue =
      state.routes[state.index].name === "Signin"
        ? Layout.window.width * 0.222
        : state.routes[state.index].name === "Signup"
        ? Layout.window.width * 0.615
        : 0;

    Animated.timing(translateValue, {
      toValue: toValue,
      duration: 300,
      useNativeDriver: true
    }).start();
    // Animated.timing(scaleValue, {
    //   toValue: toScaleValue,
    //   duration: 300,
    //   useNativeDriver: true,
    // }).start();
  };
  return (
    <Animated.View
      style={{
        position: "absolute",
        bottom: 0,
        zIndex: 90,
        width: tabItemWidth(state.routes[state.index].name),
        borderBottomColor: colors.background,
        borderBottomWidth: 3,
        borderRadius: 10,
        transform: [{ translateX: translateValue }]
      }}
    />
  );
};

export const SigninSignupTopTabBar = ({
  state,
  descriptors,
  navigation,
  position
}: any) => {
  /*top tab bar always has 3 tabs
  lineWidthsPercent is an array of percentages(as a decimal) 
  of the width of the screen that the tab indicator should be, */
  return (
    <View
      style={{
        flexDirection: "row",
        width: "100%",
        paddingBottom: 7
      }}
    >
      <TabBarIndicator state={state} />
      <View
        style={{
          flexDirection: "row",
          width: "100%",
          justifyContent: "center",
          paddingTop: 20,
          paddingBottom: 2
        }}
      >
        {state.routes.map((route: any, index: any) => {
          const { options } = descriptors[route.key];
          const label =
            options.tabBarLabel !== undefined
              ? options.tabBarLabel
              : options.title !== undefined
              ? options.title
              : route.name;

          const isFocused = state.index === index;
          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true
            });

            if (!isFocused && !event.defaultPrevented) {
              // The `merge: true` option makes sure that the params inside the tab screen are preserved
              navigation.navigate({ name: route.name, merge: true });
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key
            });
          };

          return (
            <TouchableOpacity
              key={index}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                justifyContent: "flex-start",
                alignItems: "center",

                width: "40%"
              }}
            >
              <Animated.Text
                style={{
                  //   opacity,
                  fontSize: sizeObj.xl,
                  color: colors.background
                }}
              >
                {label}
              </Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
