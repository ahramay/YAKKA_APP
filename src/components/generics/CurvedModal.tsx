import Modal from "@euanmorgan/react-native-modal";
import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { platformApiLevel } from "expo-device";
import React from "react";
import { Platform, TouchableOpacity, View } from "react-native";
import { color } from "react-native-reanimated";
import {
  SafeAreaInsetsContext,
  SafeAreaProvider,
  useSafeAreaInsets
} from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useRecoilValue } from "recoil";
import { colors } from "../../constants";
import { headerHeightAtom } from "../../recoil/headerHeightAtom";
import toastConfig from "../../utils/toastConfig";
import { Text } from "../defaults";

export interface CurvedModalProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  children: React.ReactNode;
  containerClassName?: string;
  title: string;
  contentContainerClassName?: string;
  backdropOpacity?: number;
  alignTop?: boolean;
  customCloseButton?: React.ReactNode;
  onModalHide?: () => void;
}

export default function CurvedModal({
  isOpen,
  setIsOpen,
  children,
  containerClassName = "",
  contentContainerClassName = "",
  backdropOpacity,
  alignTop,
  title,
  onModalHide,
  customCloseButton
}: CurvedModalProps) {
  const headerHeight = useRecoilValue(headerHeightAtom);
  const inset = useSafeAreaInsets();
  return (
    <Modal
      animationIn={"slideInRight"}
      animationOut="slideOutRight"
      onBackdropPress={() => setIsOpen(false)}
      onModalHide={onModalHide}
      backdropOpacity={backdropOpacity}
      isVisible={isOpen}
      style={{
        margin: 0
      }}
      statusBarTranslucent={false}
    >
      <Toast config={toastConfig} />
      <ActionSheetProvider>
        <View
          style={{ top: 0 }}
          className={`bg-white w-full absolute self-end shadow-lg rounded-bl-[70px] ${containerClassName}}`}
        >
          {Platform.OS === "ios" && (
            <View
              style={{
                height: inset.top,
                width: "100%",
                backgroundColor: colors.greenYakka
              }}
            />
          )}
          <View className=" border-b border-[#ECECEC] bg-[#F2F2F2] p-4 flex-row justify-between items-center w-full">
            <Text preset="blg">{title}</Text>

            {customCloseButton ? (
              customCloseButton
            ) : (
              <TouchableOpacity
                hitSlop={{
                  top: 10,
                  bottom: 10,
                  left: 10,
                  right: 10
                }}
                onPress={() => setIsOpen(false)}
                className="w-8 h-8 bg-gray-300 rounded-full items-center justify-center"
              >
                <Ionicons name="close" size={20} color={colors.dim} />
              </TouchableOpacity>
            )}
          </View>
          <View className={`pt-4 px-cnt pb-12 ${contentContainerClassName}`}>
            {children}
          </View>
        </View>
      </ActionSheetProvider>
    </Modal>
  );
}
