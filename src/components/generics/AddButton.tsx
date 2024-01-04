import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../../constants";
import { Text } from "../defaults";
interface AddButtonProps {
  text: string;
  onPress: () => void;
}
export default function AddButton(props: AddButtonProps) {
  return (
    <TouchableOpacity
      onPress={props.onPress}
      className="flex-row items-center gap-x-[2px]"
    >
      <Ionicons name="add-circle" size={32} color={colors.greenYakka} />

      <Text size="sm2" style={{ color: colors.blueText }}>
        {props.text}
      </Text>
    </TouchableOpacity>
  );
}
