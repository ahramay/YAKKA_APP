import { default as DefaultModal } from "@euanmorgan/react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import { Text } from "../Text/Text";
import { boxPresets, modalPresets } from "./Modal.presets";
import { ModalProps } from "./Modal.props";

export const Modal = (props: ModalProps) => {
  const {
    children,
    wrapperStyle: styleOverride,
    ref,
    preset = "bigSquare",
    isVisible,
    cross = true,
    title,
    noWrapper = false,
    setIsVisible = () => {},
    onBackdropPress = () => {},
    hideOnBackdropPress = true,
    ...rest
  } = props;
  const wrapperStyle = boxPresets[preset] || boxPresets.bounceSquare;
  const wrapperStyles = [wrapperStyle, styleOverride];

  return (
    <DefaultModal
      isVisible={isVisible}
      {...modalPresets[preset]}
      onBackdropPress={
        hideOnBackdropPress
          ? () => {
              setIsVisible(false);
              onBackdropPress;
            }
          : onBackdropPress
      }
      {...rest}
    >
      {noWrapper ? (
        children
      ) : (
        <View style={wrapperStyles}>
          {(title || cross) && (
            <View
              style={{
                flexDirection: "row"
              }}
            >
              {title && (
                <Text preset="b" style={[{ flex: 1 }]}>
                  {title}{" "}
                </Text>
              )}
              {cross && (
                <TouchableOpacity onPress={() => setIsVisible(false)}>
                  <Ionicons name="close-sharp" size={24} style={{ top: -3 }} />
                </TouchableOpacity>
              )}
            </View>
          )}
          {children}
        </View>
      )}
    </DefaultModal>
  );
};
