import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  TouchableOpacity,
  View
} from "react-native";
import { useMutation, useQueryClient } from "react-query";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import useCustomToast from "../../../hooks/useCustomToast";
import { BasicProfile, PlannedYakka } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { Text } from "../../defaults";
import DatePicker from "../../defaults/DateTimePicker";
// import DatePicker from "../../defaults/DatePicker";
import { CancelSubmitButtons } from "../../generics/CancelSubmitButtons";
import CurvedModal, { CurvedModalProps } from "../../generics/CurvedModal";
import { AreYouSure } from "../User/UserActions/AreYouSure";
import Map from "./Map";
import PlacesAutoComplete from "./PlacesAutoComplete";

interface AddReviewModalProps
  extends Omit<CurvedModalProps, "children" | "title"> {
  // yakka: RecentYakka | null;
  userData: BasicProfile;
  yakka?: PlannedYakka | null;
}
type Time = {
  date: Date;
  startTime: Date;
  endTime: Date;
};

export default function AddYakkaModal({
  userData,
  yakka = null,
  setIsOpen,
  isOpen,
  ...props
}: AddReviewModalProps) {
  const { toast, errorToast } = useCustomToast();

  const queryClient = useQueryClient();

  const [unverifiedUserModalVisible, setUnverifiedUserModalVisible] =
    useState(false);
  const [yakkaModalVisible, setYakkaModalVisible] = useState(false);

  useEffect(() => {
    console.log("[😓]yakka should open hehe", isOpen);
    //If user verified or editing a yakka open yakka modal
    if ((userData.isVerified && isOpen) || (yakka && isOpen)) {
      setYakkaModalVisible(true);
    }
    //If user isn't verified & there's no yakka open unverified user modal
    if (!userData.isVerified && isOpen && !yakka) {
      setUnverifiedUserModalVisible(true);
    }
    //If isn't open close modals
    if (!isOpen) {
      setYakkaModalVisible(false);
      setUnverifiedUserModalVisible(false);
    }
  }, [isOpen]);

  const [mapOpen, setMapOpen] = useState(false);

  const [errorText, setErrorText] = useState("");

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
    selectedWith: "map" | "search";
  } | null>();
console.log("new location",selectedLocation)

  const addYakkaMutation = useMutation(
    (time: Time) => {
      const endTime = new Date(time.endTime.getTime());

      // add start time to the date
      const startTime = new Date(time.startTime.getTime());
      return goFetchLite(yakka ? `yakkas/${yakka.id}` : "yakkas", {
        method: yakka ? "PATCH" : "POST",
        body: yakka
          ? {
              date: startTime,
              endTime,
              coordinates: {
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lng
              },
              locationName: selectedLocation?.name
            }
          : {
              date: startTime,
              endTime,
              coordinates: {
                latitude: selectedLocation?.lat,
                longitude: selectedLocation?.lng
              },
              locationName: selectedLocation?.name,
              inviteeId: userData.id
            }
      });
    },

    {
      onSuccess: () => {
        toast(yakka ? "YAKKA edited successfully!" : "YAKKA request sent");
        queryClient.refetchQueries(QueryKeys.PLANNED_YAKKAS);
        setIsOpen(false);
      },
      onError: (error: any) => {
        console.log("[🍒]", error?.response?.data);
        console.log("[🙉]", error?.response?.data.errors.endTime);
        console.log("[😬]", error?.response?.data.errors.date);
        const errDateMsgs = error?.response?.data.errors.date.map(
          (val: { message: string }) => val.message
        );
        const errEndMsgs = error?.response?.data.errors.endTime.map(
          (val: { message: string }) => val.message
        );
        const noDuplicateMsgs = [...new Set([...errDateMsgs, ...errEndMsgs])];
        setErrorText(noDuplicateMsgs.join(" "));
        setTimeout(() => {
          setErrorText("");
        }, 3000);
      },
      onSettled: () => {
        setSelectedLocation(undefined);
      },
      retry: false
    }
  );

  const addYakkaHandler = async () => {
    addYakkaMutation.mutate(time);
  };

  const [time, setTime] = useState<Time>({
    date: new Date(new Date().getTime() + 20 * 60000),
    startTime: new Date(new Date().getTime() + 20 * 60000),
    endTime: new Date(new Date().getTime() + 40 * 60000)
  });

  useEffect(() => {
    console.log(time);
  }, [time]);
  useEffect(() => {
    if (yakka && isOpen) {
      setTime({
        date: new Date(yakka?.startTimestamp),
        startTime: new Date(yakka?.startTimestamp),
        endTime: new Date(yakka?.endTimestamp)
      });
      setSelectedLocation({
        lat: yakka.coordinates.latitude,
        lng: yakka.coordinates.longitude,
        name: yakka.locationName,
        selectedWith: "map"
      });
    }
  }, [isOpen]);

  return (
    <>
      <CurvedModal
        title="User not verified"
        isOpen={unverifiedUserModalVisible}
        setIsOpen={setIsOpen}
      >
        <AreYouSure
          content="Are you sure you want to schedule a YAKKA with an unverified User?"
          onPressCancel={() => setIsOpen(false)}
          onPressSubmit={() => {
            setUnverifiedUserModalVisible(false);
            setTimeout(() => setYakkaModalVisible(true), 460);
          }}
          submitText="Schedule"
        />
      </CurvedModal>
      <CurvedModal
        {...props}
        backdropOpacity={0.8}
        isOpen={yakkaModalVisible}
        setIsOpen={setIsOpen}
        contentContainerClassName={mapOpen ? "px-0 pt-0 pb-0" : "space-y-6"}
        title={
          yakka ? `Edit YAKKA With ${userData.firstName}` : userData.firstName
        }
        containerClassName={"pb-8"}
        customCloseButton={
          mapOpen ? (
            <TouchableOpacity onPress={() => setMapOpen(false)}>
              <Text preset="blue">Close map</Text>
            </TouchableOpacity>
          ) : null
        }
      >
        {addYakkaMutation.isLoading ? (
          <View style={{ paddingTop: 20 }}>
            <ActivityIndicator size={30} color={colors.greenYakka} />
          </View>
        ) : (
          <>
            {errorText.length > 0 ? (
              <View className="pt-5">
                <ActivityIndicator size={30} color={colors.greenYakka} />
                <View className="flex-row justify-center items-center pt-4">
                  <Ionicons
                    size={20}
                    color={colors.greenYakka}
                    name="warning"
                  />
                  <Text>{errorText}</Text>
                </View>
              </View>
            ) : (
              <>
                {!mapOpen && (
                  <>
                    <View className="space-y-3 mb-4">
                      <Text className="mb-2">Date/Time</Text>
                      <DatePicker time={time} setTime={setTime} />
                    </View>
                    <View className="flex flex-row gap-x-3 items-center mb-2">
                      <Text>Location</Text>
                      <Ionicons
                        name="location"
                        size={18}
                        color={colors.lightGreyBorder}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setMapOpen(mapOpen => !mapOpen);
                          Keyboard.dismiss();
                        }}
                      >
                        <Text preset="blue">Locate on map</Text>
                      </TouchableOpacity>
                    </View>

                    <PlacesAutoComplete
                      disableAutocomplete={
                        selectedLocation?.selectedWith === "map"
                      }
                      setValue={(value: string) => {
                        if (!selectedLocation) return;

                        setSelectedLocation(
                          value.length > 0
                            ? {
                                ...selectedLocation,
                                name: value
                              }
                            : null
                        );
                      }}
                      value={
                        selectedLocation?.lat
                          ? selectedLocation?.name || "Unnamed location"
                          : ""
                      }
                      onLocationChange={location => {
                        setSelectedLocation({
                          ...location,
                          selectedWith: "search"
                        });
                      }}
                    />
                    <CancelSubmitButtons
                      destructiveButtonIndex={0}
                      style={{ paddingTop: 32 }}
                      onPressCancel={() => setIsOpen(false)}
                      onPressSubmit={addYakkaHandler}
                      disabled={!selectedLocation}
                    />
                  </>
                )}
                {mapOpen && (
                  <View className="w-screen h-screen bg-white">
                    <Map
                      closeMap={() => setMapOpen(false)}
                      onLocationSelected={location => {
                        setMapOpen(false);
                        if (location.name) {
                          setSelectedLocation({
                            ...location,
                            selectedWith: "map"
                          });
                        } else {
                          setSelectedLocation({
                            ...location,
                            name: "",
                            selectedWith: "map"
                          });
                        }
                      }}
                    />
                  </View>
                )}
              </>
            )}
          </>
        )}
      </CurvedModal>
    </>
  );
}
