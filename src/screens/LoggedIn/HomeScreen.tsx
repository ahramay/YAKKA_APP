import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useState } from "react";
import { View, Text, StyleSheet, Alert} from "react-native";
import AvailabilitySelector from "../../components/specifics/Home/AvailabilitySelector";
import PlannedYakkas from "../../components/specifics/Home/PlannedYakkas";
import RecentYakkas from "../../components/specifics/Home/RecentYakkas";
import HomeControls from "../../components/specifics/Home/HomeControls";
import { useMyProfile } from "../../hooks/ReactQuery/useMyProfile";
import { usePlannedYakkas } from "../../hooks/ReactQuery/usePlannedYakkas";
import { useRecentYakkas } from "../../hooks/ReactQuery/useRecentYakkas";
import { HomeTabScreenProps } from "../../navigation/navigation.props";
import { getNotificationsResponse, YakkaListTypes } from "../../types/types";
import GreenHeader from "../../components/specifics/TabScreens/TabHeader";
import { queryClient } from "../../reactQuery/queryClient";
import { QueryKeys } from "../../constants/queryKeys";
import { UseInfiniteQueryResult } from "react-query";
import useLocation from "../../hooks/useLocation";
import { useSetRecoilState } from "recoil";
import { loadingAtom } from "../../recoil/loadingAtom";
import { Button } from "../../components";
import { colors } from "../../constants";
import DefaultButtonGroup from "../../components/specifics/Home/DefaultButtonGroup";

export default function HomeScreen({
  navigation,
  route
}: HomeTabScreenProps<"Home">) {
  const YakkaListType = route.params?.openRecent;
  const [selectedYakkaListType, setSelectedYakkaListType] =
    useState<YakkaListTypes>(YakkaListType || null);

  const notificationsOpen = route.params?.openNotifications;
  const notificationData = queryClient.getQueryData<
    UseInfiniteQueryResult<getNotificationsResponse>["data"]
  >(QueryKeys.NOTIFICATIONS);
  const profile = useMyProfile();
  const recentYakkas = useRecentYakkas();
  const plannedYakkas = usePlannedYakkas();
  const unsubscribe = navigation.addListener("blur", e => {
    // Prevent default action
    navigation.setParams({
      openNotifications: false
    });
  });

  const {
    getLocation,
    locationMutation,
    isLoading: isLocationLoading
  } = useLocation();

  const handleRefreshLocation = async () => {
    const location = await getLocation();
    if (location) {
      locationMutation.mutate(location);
    }
  };
  useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
        e.preventDefault();
      }),
    [navigation]
  );
  const setLoading = useSetRecoilState(loadingAtom);
  useFocusEffect(
    useCallback(() => {
      setLoading(false);
      setSelectedYakkaListType(YakkaListType || null);
      profile.refetch();
      recentYakkas.refetch();
      plannedYakkas.refetch();
      queryClient.refetchQueries(QueryKeys.NOTIFICATIONS);
      handleRefreshLocation();
      unsubscribe();
    }, [YakkaListType])
  );
console.log(notificationData)
  return (
    <>
      <View className="z-[0]" style={{ elevation: 0 }}>
        {/* Availability switcher */}
        <GreenHeader
          //@ts-ignore
          navigation={navigation}
          route={route}
          homeScreen
          redDot={
            notificationData && 
            notificationData?.pages.flatMap(val => val.unreadCount)[0] > 0
          }
          openNotification={notificationsOpen}
          />
        <AvailabilitySelector />
        <HomeControls
          isLocationLoading={isLocationLoading}
          handleRefreshLocation={handleRefreshLocation}
          selectedYakkaListType={selectedYakkaListType}
          setSelectedYakkaListType={setSelectedYakkaListType}
        />
        {/* YAKKA list */}
        {selectedYakkaListType === "planned" && <PlannedYakkas />}
        {selectedYakkaListType === "recent" && <RecentYakkas />}
        {selectedYakkaListType === null && <DefaultButtonGroup navigation={navigation} />}
      </View>
    </>
  );
}


