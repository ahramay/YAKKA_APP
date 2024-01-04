import { Ionicons } from "@expo/vector-icons";
import clsx from "clsx";
import React from "react";
import { View } from "react-native";
import { Text } from "../defaults";
import { Tick } from "./Icons/Tick";

export default function RequestStatusIndicator({ status }: { status: string }) {
  // Green, red and grey variant
  const statusColours = clsx(
    {
      "bg-green-500": status === "ACCEPTED",
      "bg-red-500": status === "DECLINED",
      "bg-[#E7E7E7]": status === "PENDING"
    },
    "w-6 h-6 rounded-full  items-center justify-center"
  );
  const statusLabel = status[0] + status.slice(1).toLowerCase();
  return (
    <View className="items-center flex-row gap-x-2">
      <View className={statusColours}>
        {status === "ACCEPTED" ? (
          <Tick dimmed />
        ) : status === "PENDING" ? (
          <Tick />
        ) : (
          <Ionicons name="close" color={"white"} size={20} />
        )}
      </View>
      <Text size="sm" color="white">
        {statusLabel}
      </Text>
    </View>
  );
}
