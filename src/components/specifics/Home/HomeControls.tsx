import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { Image, Pressable, TouchableOpacity, View } from "react-native";
import { colors } from "../../../constants";
import { ClassNames } from "../../../constants/ClassNames";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";
import useLocation from "../../../hooks/useLocation";
import { HomeTabScreenProps } from "../../../navigation/navigation.props";
import { YakkaListTypes } from "../../../types/types";
import { Text } from "../../defaults";
import AddButton from "../../generics/AddButton";
import ButtonGroupSelector from "../../generics/ButtonGroupSelector";
import MustBeVerifiedModal from "../MustBeVerifiedModal";

export default function YakkaControls({
  selectedYakkaListType,
  setSelectedYakkaListType,
  handleRefreshLocation,
  isLocationLoading
}: {
  selectedYakkaListType: YakkaListTypes;
  setSelectedYakkaListType: (type: YakkaListTypes) => void;
  handleRefreshLocation: () => void;
  isLocationLoading: boolean;
}) {
  // Get cached profile from React Query

  const { data, isLoading: isProfileLoading, error } = useMyProfile();

  const navigation = useNavigation<HomeTabScreenProps<"Home">["navigation"]>();
  const [verifiedAccountVisible, setVerifiedAccountVisible] =
    useState<boolean>(false);

  return (
    <View className={`gap-y-3 z-[2] bg-white ${ClassNames.OVERLAP}`}>
      <View className="flex-row justify-between  w-full px-cnt">
        <TouchableOpacity
          className="flex-row gap-x-3"
          onPress={() => navigation.navigate("MyProfile")}
        >
          <Image
            source={{
              uri: data?.images?.[0]?.url
            }}
            className="w-14 h-14 rounded-md"
            resizeMode="cover"
          />
          <View className="justify-center">
            <Text weight="500" size="lg">
              {data?.firstName}
            </Text>
            <Text className="opacity-50 -left-1">
              <Ionicons name="location-sharp" size={20} color="black" />
              {/* TODO: Api */}
              {data?.locationName || "Unknown"}
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleRefreshLocation}
          disabled={isLocationLoading}
          className="flex-row items-center gap-x-1"
        >
          <Text size="xs" color={colors.greyText}>
            Refresh{"\n"}location
          </Text>
          <MaterialIcons
            name="my-location"
            size={24}
            color={colors.greenYakka}
          />
        </TouchableOpacity>
      </View>
      <View className="flex-row items-center justify-between px-cnt">
        <AddButton
          text="Add YAKKA"
          onPress={() => {
            data?.isVerified
              ? navigation.navigate("FindYakkas", {
                  tab: "friends",
                  openAddYakkaModal: true
                })
              : setVerifiedAccountVisible(true);
          }}
        />
        <ButtonGroupSelector
          buttons={[
            {
              label: "Planned",
              onPress: () => {
                setSelectedYakkaListType("planned");
              }
            },
            {
              label: "Recent",
              onPress: () => {
                setSelectedYakkaListType("recent");
              }
            }
          ]}
        />
      </View>
      {data && !isProfileLoading && (
        <MustBeVerifiedModal
          isOpen={verifiedAccountVisible}
          setIsOpen={setVerifiedAccountVisible}
          userPendingVerification={data?.verificationPending}
        />
      )}
    </View>
  );
}
