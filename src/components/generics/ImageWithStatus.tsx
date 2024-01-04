import clsx from "clsx";
import { View, Image } from "react-native";
import { UserStatus } from "../../types/types";
import VerifiedBadge from "./Icons/VerifiedBadge";
import UserProfileImage from "./UserProfileImage";

export default function ImageWithStatus({
  imageUrl,
  status,
  isVerified
}: {
  imageUrl: string;
  status: UserStatus;
  isVerified: boolean;
}) {
  const statusIndicator = clsx(
    {
      "bg-green-500": status === "AVAILABLE_TO_YAKKA",
      "bg-yellow-500": status === "AVAILABLE_TO_CHAT",
      "bg-red-500": status === "UNAVAILABLE"
    },
    "w-[21px] h-[21px] rounded-full absolute -top-1.5 -right-1 items-center justify-center"
  );
  return (
    <View className="overflow-visible">
      <UserProfileImage imageUrl={imageUrl} />
      <View className={statusIndicator} />
    </View>
  );
}
