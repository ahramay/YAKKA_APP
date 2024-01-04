import { View, Text, Image } from "react-native";
import React from "react";
import GroupImage from "./GroupImage ";
import clsx from "clsx";
import { YakkaUser } from "./Icons/YakkaUser";

export default function GroupImageWithInvite({
  imageUrl,
  invited
}: {
  imageUrl: string;
  invited: boolean;
}) {
  // const statusIndicator = clsx(
  //   {
  //     "bg-green-500": status === "AVAILABLE_TO_YAKKA",
  //     "bg-yellow-500": status === "AVAILABLE_TO_CHAT",
  //     "bg-red-500": status === "UNAVAILABLE"
  //   },
  //   "w-[21px] h-[21px] rounded-full absolute -top-1.5 -right-1 items-center justify-center"
  // );
  return (
    <View className="overflow-visible">
      <GroupImage imageUrl={imageUrl} />
      {invited && (
        <View className="absolute -top-1.5 -right-5 flex-row">
          invited
          <View className="bg-white rounded-full">
            <YakkaUser />
          </View>
        </View>
      )}
    </View>
  );
}
