import { View, Text, Image } from "react-native";
import React from "react";

export default function GroupImage({ imageUrl }: { imageUrl: string }) {
  return (
    <Image
      source={{
        uri: imageUrl
      }}
      className="w-14 h-14 rounded-[20px] bg-gray-200"
    />
  );
}
