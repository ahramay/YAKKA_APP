import Modal from "@euanmorgan/react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { color } from "react-native-reanimated";
import { useRecoilValue } from "recoil";
import { colors } from "../../constants";
import { headerHeightAtom } from "../../recoil/headerHeightAtom";
import { Button, Text } from "../defaults";
import { BigSafety } from "./Icons/BigSafety";

export interface CurvedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  containerClassName?: string;
  title: string;
  contentContainerClassName?: string;
  onPressContinue?: () => void;
  onPressBackDrop?: () => void;
  backdropOpacity?: number;
  noSafetyIcon?: boolean;
}

export default function SafetyAlertModal({
  isOpen,
  setIsOpen,
  children,
  containerClassName = "",
  contentContainerClassName = "",
  backdropOpacity,
  noSafetyIcon,
  onPressContinue,
  onPressBackDrop,
  title
}: CurvedModalProps) {
  const headerHeight = useRecoilValue(headerHeightAtom);

  return (
    <Modal
      animationIn={"fadeIn"}
      animationOut="fadeOut"
      onBackdropPress={() => {
        setIsOpen(false);
        onPressBackDrop && onPressBackDrop();
      }}
      backdropOpacity={backdropOpacity}
      isVisible={isOpen}
      style={{
        margin: 0
      }}
    >
      <View
        style={{
          top: Platform.OS === "android" ? 0 : headerHeight / 1.6,
          backgroundColor: colors.alertBackground
        }}
        className={`w-[72%] z-50 self-center items-center shadow-lg rounded-bl-[70px] ${containerClassName}}`}
      >
        <View className="absolute h-full w-full rounded-xl bg-[#F2F2F2CC] " />
        <View className="p-4 flex-grow items-center">
          <Text size="xl" weight="700">
            {title}
          </Text>
          <View className={`pt-4 px-cnt pb-2 ${contentContainerClassName}`}>
            {children}
          </View>
          {!noSafetyIcon && <BigSafety />}
        </View>
        <View
          style={{
            width: "100%",
            height: 48,
            borderTopWidth: 0.25
          }}
        >
          <Button
            text="Continue"
            preset="wide"
            textSize="xl"
            onPress={() => {
              setIsOpen(false);
              onPressContinue && onPressContinue();
            }}
            style={{
              backgroundColor: colors.alertBackground,
              borderTopLeftRadius: 0,
              borderTopRightRadius: 0,
              height: "100%"
            }}
            textColor={colors.greenYakka}
          />
        </View>
      </View>
    </Modal>
  );
}
