import { Ionicons } from "@expo/vector-icons";
import {
  GestureResponderEvent,
  StyleSheet,
  View,
  ViewStyle
} from "react-native";
import { Button } from "../defaults";

export const CancelSubmitButtons = (props: {
  style?: ViewStyle;
  cancelStyle?: ViewStyle;
  submitStyle?: ViewStyle;
  disabled?: boolean;
  onPressSubmit?: (event: GestureResponderEvent) => void;
  onPressCancel?: (event: GestureResponderEvent) => void;
  submitText?: string;
  cancelText?: string;
  noArrow?: boolean;
  destructiveButtonIndex?: number;
}) => {
  const {
    style,
    cancelStyle,
    submitStyle,
    onPressSubmit,
    onPressCancel,
    disabled = false,
    noArrow = false,
    submitText = "Submit",
    cancelText = "Cancel",
    destructiveButtonIndex = 0
  } = props;
  return (
    <View
      style={style}
      className="flex-row pt-8 space-x-4 justify-between w-full z-[-10]"
    >
      <Button
        text={cancelText}
        preset={destructiveButtonIndex === 0 ? "redPill" : "pill"}
        style={[styles.btn, cancelStyle]}
        onPress={onPressCancel}
      />
      <Button
        onPress={onPressSubmit}
        disabled={disabled}
        text={submitText}
        preset={destructiveButtonIndex === 1 ? "redPill" : "pill"}
        style={[styles.btn, submitStyle]}
        childrenRight={
          !noArrow && (
            <Ionicons
              name="chevron-forward"
              size={19}
              color={"white"}
              style={{ paddingLeft: 6 }}
            />
          )
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    width: 120
  }
});
