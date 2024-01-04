import React from "react";
import { View } from "react-native";
import { colors } from "../../../constants";

export default function Message() {
  return (
    <View className="w-full">
      <View style={{ backgroundColor: colors.greenYakka }}></View>
    </View>
  );
}
