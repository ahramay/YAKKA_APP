import React, { useLayoutEffect, useRef, useState } from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming
} from "react-native-reanimated";
import { useMutation } from "react-query";
import { colors } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import { MutationKeys } from "../../../constants/queryKeys";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";
import useCustomToast from "../../../hooks/useCustomToast";
import { UserStatus } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { Text } from "../../defaults";

const AvailabilitySelector = () => {
  const [selected, setSelected] = useState<number>();
  const barX = useSharedValue(110.5);
  //   Bar width should be as big as the first option
  const barWidth = useSharedValue(65);
  const barColor = useSharedValue(colors.darkGreenYakka);

  const refOne = useRef<any>(null);
  const refTwo = useRef<any>(null);
  const refThree = useRef<any>(null);
  const refArray = [refOne, refTwo, refThree];

  const statusList: UserStatus[] = [
    "AVAILABLE_TO_YAKKA",
    "AVAILABLE_TO_CHAT",
    "UNAVAILABLE"
  ];

  const profile = useMyProfile();

  useLayoutEffect(() => {
    if (profile.data?.status && selected === undefined) {
      const index = statusList.indexOf(profile.data.status);

      setSelected(index);
      setTimeout(() => {
        moveToSelected(index, true);
      }, 0);
    }
  }, [profile.data]);

  const { errorToast, toast } = useCustomToast();

  const availabilityMutation = useMutation(
    MutationKeys.AVAILABILITY,
    (status: (typeof statusList)[number]) =>
      goFetchLite("users/me/status", {
        method: "PUT",
        body: {
          status
        }
      }),
    {
      onSuccess: () => {
        profile.refetch();
      },
      onError: error => {
        errorToast("Something went wrong, please try again later");
      }
    }
  );

  const barStyle = useAnimatedStyle(() => {
    return {
      // backgroundColor: barColor?.value,
      transform: [{ translateX: barX.value }],
      width: barWidth.value
    };
  });
  const colours = [colors.greenYakka, "rgb(234, 179, 8)", colors.red];

  const moveToSelected = (index: number, noAnimation: boolean = false) => {
    const offset = refArray[index].current.measure(
      // @ts-ignore
      (x, y, width, height, pageX, pageY) => {
        barX.value = noAnimation
          ? Platform.OS === "android"
            ? pageX - 15
            : x
          : withTiming(Platform.OS === "android" ? pageX - 15 : x, {
              duration: 300,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
        barColor.value = withSpring(colours[index]);
        barWidth.value = noAnimation
          ? width
          : withTiming(width, {
              duration: 300,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1)
            });
      }
    );
  };

  const onPress = (index: number) => {
    // Each option has a different width, so we need to calculate the offset
    // of the bar based on the width of the option
    moveToSelected(index);
    setSelected(index);
    availabilityMutation.mutate(statusList[index]);
  };
  return (
    <View
      className={`bg-primaryDark  z-[3] flex-row  justify-between px-cnt  ${ClassNames.OVERLAP} pb-0 -top-2`}
    >
      <View className="relative flex-row pl-[8%] w-full items-center py-4 justify-between">
        <TouchableOpacity
          ref={refOne}
          hitSlop={{ top: 25, bottom: 25, right: 10 }}
          className="justify-center items-center"
          onPress={() => onPress(0)}
        >
          <Text color={colors.background} size="sm2">
            Available to YAKKA
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 25, bottom: 25, right: 10 }}
          ref={refTwo}
          className="justify-center items-center"
          onPress={() => onPress(1)}
        >
          <Text color={colors.background} size="sm2">
            Available to Chat
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          hitSlop={{ top: 25, bottom: 25 }}
          ref={refThree}
          className="justify-center items-center"
          onPress={() => onPress(2)}
        >
          <Text color={colors.background} size="sm2">
            Unavailable
          </Text>
        </TouchableOpacity>
        <Animated.View
          className="absolute bottom-[-2px]  h-[5px] rounded-full  bg-primary"
          style={barStyle}
        />
      </View>
    </View>
  );
};

export default AvailabilitySelector;
