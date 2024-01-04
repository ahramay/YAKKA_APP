import { useState } from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInputSubmitEditingEventData,
  ViewStyle
} from "react-native";
import { colors } from "../../constants";
import { TextInput } from "../defaults";

type SearchBoxProps<T extends object> = {
  listCopy: T[];
  textProp: keyof T;
  setList: (list: T[]) => void;
  className?: string;
  onChangeText?: (text?: string) => void;
  style?: ViewStyle;
  onSubmit?: (
    e?: NativeSyntheticEvent<TextInputSubmitEditingEventData>
  ) => void;
};

export const SearchBox = <T extends object>({
  setList,
  textProp,
  style,
  listCopy,
  onSubmit,
  className,
  onChangeText
}: SearchBoxProps<T>) => {
  const [value, setValue] = useState<string>("");

  const search = (text: string) => {
    setValue(text);
    onChangeText && onChangeText(text);
    if (text) {
      let old = [...listCopy];
      console.log(old);
      old = old.filter(item => {
        if (typeof item[textProp] === "string") {
          //@ts-ignore
          return item[textProp].toLowerCase().includes(text.toLowerCase());
        }
      });
      setList(old);
    } else {
      setList(listCopy);
    }
  };
  return (
    <TextInput
      value={value}
      onChangeText={search}
      style={[styles.textInput, style]}
      className={className}
      onSubmitEditing={onSubmit}
      placeholder={"Search"}
    />
  );
};

const styles = StyleSheet.create({
  textInput: {
    backgroundColor: colors.lightGreyBorder
  }
});
