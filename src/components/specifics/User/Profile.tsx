import clsx from "clsx";
import { Dimensions, ScrollView, View } from "react-native";
import { colors } from "../../../constants";
import { GetProfileResponse, UserStatus } from "../../../types/types";
import { Text } from "../../defaults";
import VerifiedBadge from "../../generics/Icons/VerifiedBadge";
import { CoverPhoto } from "./ProfileComponents/CoverPhoto";
import { ProfileButtons } from "./ProfileComponents/ProfileButtons";
import { ProfilePics } from "./ProfileComponents/ProfilePics";
import { UserInfo } from "./ProfileComponents/UserInfo";
import { useNavigation } from "@react-navigation/native";

type ProfileProps = {
  profile: GetProfileResponse;
  isUser: boolean;
  openAddYakka: () => void;
};

export const Profile = ({ profile, isUser, openAddYakka }: ProfileProps) => {
  const statusIndicator = (status: UserStatus) =>
    clsx(
      // {
      //   "bg-green-500": status === "AVAILABLE_TO_YAKKA",
      //   "bg-yellow-500": status === "AVAILABLE_TO_CHAT",
      //   "bg-red-500": status === "UNAVAILABLE"
      // },
      `w-5 h-5 rounded-full items-center self-center justify-center ml-1`
    );

  return (
    <ScrollView
      className="z-[0] -mt-11 bg-white"
      style={{ height: Dimensions.get("window").height, elevation: 0 }}
    >
      <CoverPhoto profile={profile} isUser={isUser} />
      <View className=" items-center">
        <ProfilePics profile={profile} isUser={isUser} />
        <View className="-top-10 flex-row items-center justify-center py-2 ">
          <Text
            size="xl"
            style={{
              color: colors.black,
              textAlign: "center",
              top: -0.5
            }}
          >
            {profile.firstName} {profile.lastName}
          </Text>
          {profile.isVerified && (
            <View className={statusIndicator(profile.status)}>
              <VerifiedBadge color={colors.greenYakka} width={15} height={16} />
            </View>
          )}
        </View>
        <ProfileButtons
          openAddYakka={openAddYakka}
          user={profile}
          isUser={isUser}
        />
        <UserInfo user={profile} isUser={isUser} />
      </View>
    </ScrollView>
  );
};
