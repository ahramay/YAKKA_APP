import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { Image, Keyboard, TouchableOpacity, View } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Button, Text } from "..";
import { colors, Layout } from "../../constants";
import { MutationKeys, QueryKeys } from "../../constants/queryKeys";
import { fullYakka, sender } from "../../types/types";
import { yakkaDateFormat, yakkaTimeFormat } from "../../utils/dateFormat";
import { goFetchLite } from "../../utils/goFetchLite";
import { CancelSubmitButtons } from "../generics/CancelSubmitButtons";
import CurvedModal from "../generics/CurvedModal";
import SafetyAlertModal from "../generics/SafetyAlertModal";
import ReadOnlyMap from "./AddYakka/ReadOnlyMap";

export default function InviteModal(props: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  yakkaId: number;
  sender: sender;
  onModalHide: () => void;
}) {
  const { visible, setVisible, yakkaId, sender, onModalHide } = props;
  const [mapOpen, setMapOpen] = useState(false);
  const [confirmAlertVisible, setConfirmAlertVisible] = useState(false);

  const yakka = useQuery<{
    yakka: fullYakka;
  }>(
    QueryKeys.getYakka(yakkaId || -1),
    () =>
      goFetchLite(`yakkas/${yakkaId}`, {
        method: "GET"
      }),
    {
      onError: err => {
        Toast.show({ text1: "Error getting invite" });
      }
    }
  );
  const invite = yakka.data?.yakka;

  const queryClient = useQueryClient();

  const respondMutation = useMutation(
    MutationKeys.RESPOND_YAKKA,
    (accept: boolean) =>
      goFetchLite(`yakkas/requests/${yakkaId}`, {
        method: "PUT",
        body: { accept: accept }
      }),
    {
      onSuccess: (data, variables) => {
        //@ts-ignore
        setVisible(false);
        Toast.show({
          text1: `YAKKA request ${variables ? "accepted" : "declined"}`
        });
        queryClient.refetchQueries(QueryKeys.PLANNED_YAKKAS);
        queryClient.refetchQueries(QueryKeys.RECENT_YAKKAS);
      },
      onError: (error, context) => console.log(error, context)
    }
  );

  return (
    <>
      <CurvedModal
        isOpen={visible && yakka.isFetched}
        setIsOpen={setVisible}
        title={sender?.firstName}
        onModalHide={onModalHide}
        customCloseButton={
          mapOpen ? (
            <TouchableOpacity onPress={() => setMapOpen(false)}>
              <Text preset="blue">Close map</Text>
            </TouchableOpacity>
          ) : null
        }
      >
        <View
          style={{ height: mapOpen ? Layout.window.height : "auto" }}
          className="space-y-3"
        >
          <View className="flex-row gap-x-3 items-center">
            <View className={`flex-1  items-start`}>
              <Button
                style={{ backgroundColor: colors.greenYakka, opacity: 1 }}
                disabled
                textSize="xl"
                preset="small"
                text="YAKKA"
              />
            </View>
            <Image
              source={{ uri: sender?.image }}
              style={{
                height: 55,
                width: 55,
                borderRadius: 100
              }}
            />
          </View>
          <Text>Date/Time</Text>
          {invite && (
            <View className="mb-5 flex-row gap-x-3 items-center">
              <View className={`flex-1  items-start`}>
                <Text className="opacity-60">
                  {yakkaDateFormat(invite.startTimestamp)}
                </Text>
              </View>
              <Text className="opacity-60">
                {yakkaTimeFormat(invite.startTimestamp)}
              </Text>
              <Text className="opacity-60">to</Text>
              <Text className="opacity-60">
                {yakkaTimeFormat(invite.endTimestamp)}
              </Text>
            </View>
          )}
        </View>
        <View className="flex flex-row gap-x-3 items-center mb-2">
          <Text>Location</Text>
          <Ionicons name="location" size={18} color={colors.lightGreyBorder} />
          <TouchableOpacity
            onPress={() => {
              setMapOpen(mapOpen => !mapOpen);
              Keyboard.dismiss();
            }}
          >
            <Text preset="blue">View on map</Text>
          </TouchableOpacity>
        </View>
        <Text className="opacity-60">{invite?.locationName}</Text>
        <CancelSubmitButtons
          destructiveButtonIndex={0}
          cancelText="Decline"
          submitText="Accept"
          noArrow
          submitStyle={{ backgroundColor: colors.greenYakka }}
          onPressCancel={() => {
            respondMutation.mutate(false);
            setConfirmAlertVisible(false);
          }}
          onPressSubmit={() => {
            setVisible(false);
            respondMutation.mutate(true);
            //limitation of react native in ios is an inability to handle two modals at once so the timeout is the work around
            setTimeout(() => setConfirmAlertVisible(true), 460);
          }}
        />

        {mapOpen && invite && (
          <ReadOnlyMap
            closeMap={() => setMapOpen(false)}
            location={{
              latitude: invite?.coordinates.latitude,
              longitude: invite?.coordinates.longitude,
              name: invite?.locationName
            }}
          />
        )}
      </CurvedModal>
      <SafetyAlertModal
        isOpen={confirmAlertVisible}
        setIsOpen={setConfirmAlertVisible}
        title="Accept YAKKA"
        onPressContinue={() => respondMutation.mutate(true)}
        onPressBackDrop={() => {
          setTimeout(() => setVisible(true), 460);
          setConfirmAlertVisible(false);
        }}
      >
        <Text className="text-center">
          I confirm I am meeting in a public place, have read the safety screen
          and I have let someone else know where I am.
        </Text>
      </SafetyAlertModal>
    </>
  );
}
