import { useCallback, useState } from "react";
import { Insets, StyleSheet, TextStyle, View, ViewStyle } from "react-native";
import BouncyCheckbox from "react-native-bouncy-checkbox";
import { colors } from "../../constants";
import { Text } from "../defaults";
import { presets } from "../defaults/Text/Text.presets";

export interface CheckboxProps {
  text?: string;
  onPress?: (isChecked: boolean) => void;
  isChecked?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  hitSlop?: Insets;
  variant?: "circle" | "default";
  checkBoxSize?: number;
  noneChecked?: boolean;
}

export const Checkbox = (props: CheckboxProps) => {
  const {
    text,
    onPress,
    style,
    textStyle,
    hitSlop,
    isChecked: paramChecked,
    noneChecked = false,
    variant = "default",
    checkBoxSize = 25
  } = props;
  const [checked, setChecked] = useState(false);
  const handlePressed =
    onPress === undefined
      ? () => {
          if (noneChecked) {
            setChecked(false);
          } else {
            setChecked(!checked);
          }
        }
      : useCallback(() => {
          if (paramChecked === undefined) {
            if (noneChecked) {
              setChecked(false);
            } else {
              setChecked(!checked);
            }
            onPress && onPress(!checked);
          } else {
            onPress && onPress(!paramChecked);
          }
        }, [paramChecked, onPress]);

  const isChecked = paramChecked === undefined ? checked : paramChecked;
  return (
    <BouncyCheckbox
      size={checkBoxSize}
      fillColor={colors.greenYakka}
      unfillColor={colors.background}
      text={text || ""}
      textComponent={<Text style={[{ marginLeft: 8 }, textStyle]}>{text}</Text>}
      style={style}
      hitSlop={hitSlop}
      isChecked={isChecked}
      disableBuiltInState
      iconComponent={
        variant === "circle" && <View style={styles.IconComponent} />
      }
      innerIconStyle={{
        borderRadius: variant === "circle" ? 100 : 6,
        borderWidth: 1,
        borderColor: colors.lightGreyBorder,
        backgroundColor: isChecked ? colors.greenYakka : colors.background
      }}
      onPress={handlePressed}
    />
  );
};

const styles = StyleSheet.create({
  IconComponent: {
    width: "100%",
    height: "100%",
    borderRadius: 100,
    borderColor: colors.background,
    borderWidth: 1
  }
});
