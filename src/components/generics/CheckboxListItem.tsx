import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import { colors } from "../../constants";
import { Text } from "../defaults";
import { Checkbox, CheckboxProps } from "./Checkbox";
export interface CheckboxListRenderItemInfo<T extends object>
  extends CheckboxProps {
  item: T;
  labelProp: keyof T;
  onPress: (isChecked: boolean) => void;
  checked: boolean;
  containerStyle?: ViewStyle;
}
export const CheckboxListItem = <T extends object>({
  containerStyle,
  item,
  labelProp,
  checked,
  onPress,
  ...rest
}: CheckboxListRenderItemInfo<T>) => {
  return (
    <Pressable
      onPress={() => onPress(!checked)}
      style={[styles.listItem, containerStyle]}
    >
      <Checkbox {...rest} isChecked={checked} onPress={onPress} />
      <Text style={{ flex: 1 }}>
        {`${
          typeof item == "string" && typeof item !== "undefined"
            ? item
            : item[labelProp]
        }`}
      </Text>
    </Pressable>
  );
};
const styles = StyleSheet.create({
  listItem: {
    width: "100%",
    backgroundColor: colors.background,
    paddingLeft: 15,
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    marginVertical: 4
  }
});
