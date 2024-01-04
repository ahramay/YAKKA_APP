import { AxiosError } from "axios";
import * as Location from "expo-location";
import { useState } from "react";
import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "react-query";
import { useRecoilState } from "recoil";
import { QueryKeys } from "../constants/queryKeys";
import { locationAtom } from "../recoil/locationAtom";
import { goFetchLite } from "../utils/goFetchLite";

export default function useLocation() {
  const [loading, setLoading] = useState(false);

  const [location, setLocation] = useRecoilState(locationAtom);

  const queryClient = useQueryClient();

  const locationMutation = useMutation(
    async (location: Location.LocationObject) =>
      goFetchLite("users/me/location", {
        method: "PUT",
        body: {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude
        }
      }),
    {
      onSuccess: () => {
        queryClient.refetchQueries(QueryKeys.MY_PROFILE);
      },
      onError: (error: { response: AxiosError }) => {
        if (error.response.status !== 403 && error.response.status !== 401) {
          // If it's a 403, it's because the user has not yet verified their phone number
          Toast.show({
            type: "error",
            text1: "Error updating location",
            //@ts-ignore
            text2: error?.response?.data?.message
          });
        }
      }
    }
  );

  const requestPermissions = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();

    if (status !== "granted") {
      Toast.show({
        type: "error",
        text1: "Permission to access location was denied"
      });
      return false;
    }
    return true;
  };

  const getLocation = async () => {
    setLoading(true);
    const hasPermission = await requestPermissions();
    let location;
    console.log("[🚏] - permission request response:", hasPermission);
    if (hasPermission) {
      location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced
      });
      console.log(location);
    }
    if (!location || !location.coords || !hasPermission)
      return Toast.show({
        type: "error",
        text1: "Error getting location"
      });
    setLocation({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude
    });
    setLoading(false);
    return location;
  };

  return {
    getLocation,
    locationMutation,
    isLoading: loading || locationMutation.isLoading,
    location
  };
}
