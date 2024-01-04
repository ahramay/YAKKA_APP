import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Keyboard, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation, useQuery } from "react-query";
import { Text } from "../..";
import { colors, Layout } from "../../../constants";
import { MutationKeys, QueryKeys } from "../../../constants/queryKeys";
import { queryClient } from "../../../reactQuery/queryClient";
import { fullYakka } from "../../../types/types";
import { yakkaDateFormat, yakkaTimeFormat } from "../../../utils/dateFormat";
import { goFetchLite } from "../../../utils/goFetchLite";
import { CancelSubmitButtons } from "../../generics/CancelSubmitButtons";
import CurvedModal from "../../generics/CurvedModal";
import ReadOnlyMap from "../AddYakka/ReadOnlyMap";
import { AreYouSure } from "../User/UserActions/AreYouSure";

export default function ViewYakkaModal(props: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  yakkaId: number;
  yourYakka?: boolean;
  onModalHide?: () => void;
  onDelete?: () => void;
  deleteYakka?: boolean;
}) {
  const {
    visible,
    setVisible,
    yakkaId,
    onModalHide,
    deleteYakka = false,
    onDelete,
    yourYakka = false
  } = props;
  const [mapOpen, setMapOpen] = useState(false);
  const deleteYakkaMutation = useMutation(
    MutationKeys.DELETE_YAKKA,
    (id: number) =>
      goFetchLite(`yakkas/${id}`, {
        method: "DELETE"
      }),
    {
      onMutate(variables) {
        console.log(variables);
      },
      onSuccess: () => {
        queryClient.refetchQueries(QueryKeys.PLANNED_YAKKAS);
        onDelete && onDelete();
        Toast.show({ text1: "Planned Yakka cancelled" });
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Failed to cancel Planned  Yakka`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );

  const yakkaQuery = useQuery<{
    yakka: fullYakka;
  }>(
    QueryKeys.getYakka(yakkaId || -1),
    () =>
      goFetchLite(`yakkas/${yakkaId}`, {
        method: "GET"
      }),
    {
      onError: err => {
        Toast.show({ text1: "Error getting YAKKA" });
      }
    }
  );

  const yakka = yakkaQuery.data?.yakka;

  return (
    <>
      {yakka && (
        <CurvedModal
          isOpen={visible && yakkaQuery.isFetched}
          setIsOpen={setVisible}
          title={
            deleteYakka
              ? `Cancel YAKKA with ${yakka.attendee.firstName}`
              : yourYakka
              ? "Your YAKKA"
              : yakka.attendee.firstName
          }
          customCloseButton={
            mapOpen ? (
              <TouchableOpacity onPress={() => setMapOpen(false)}>
                <Text preset="blue">Close map</Text>
              </TouchableOpacity>
            ) : null
          }
          onModalHide={onModalHide}
        >
          <View
            style={{ height: mapOpen ? Layout.window.height : "auto" }}
            className="space-y-3"
          >
            <Text>Date/Time</Text>
            <View className="mb-5 flex-row gap-x-3 items-center">
              <View
                style={{ backgroundColor: colors.chatBoxBackground }}
                className={`flex-1  items-start rounded-sm opacity-60  p-1 border-[0.5px] border-black`}
              >
                <Text>{yakkaDateFormat(yakka.startTimestamp)}</Text>
              </View>
              <View className="flex-row gap-x-2 items-center">
                <Text
                  style={{ backgroundColor: colors.chatBoxBackground }}
                  className="opacity-60 p-1 rounded-sm border-[0.5px] border-black"
                >
                  {yakkaTimeFormat(yakka.startTimestamp)}
                </Text>
                <Text className="opacity-60">to</Text>
                <Text
                  style={{ backgroundColor: colors.chatBoxBackground }}
                  className="opacity-60 p-1 rounded-sm border-[0.5px] border-black"
                >
                  {yakkaTimeFormat(yakka.endTimestamp)}
                </Text>
              </View>
            </View>
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
              <Text preset="blue">View on map</Text>
            </TouchableOpacity>
          </View>
          <Text className="opacity-60">
            {yakka.locationName.length > 0
              ? yakka.locationName
              : "Unknown, see map for details"}
          </Text>
          {mapOpen && (
            <ReadOnlyMap
              closeMap={() => setMapOpen(false)}
              location={{
                latitude: yakka.coordinates.latitude,
                longitude: yakka.coordinates.longitude,
                name: yakka.locationName
              }}
            />
          )}
          {yakka && deleteYakka && (
            <>
              <CancelSubmitButtons
                destructiveButtonIndex={1}
                onPressCancel={() => setVisible(false)}
                submitText="Cancel"
                cancelText="Go back"
                onPressSubmit={() => {
                  setVisible(false);
                  deleteYakkaMutation.mutate(yakka.id);
                }}
              />
            </>
          )}
        </CurvedModal>
      )}
    </>
  );
}
