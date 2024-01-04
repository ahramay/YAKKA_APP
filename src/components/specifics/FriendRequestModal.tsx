import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Image,
  Keyboard,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { Text } from "..";
import { colors } from "../../constants";
import { MutationKeys } from "../../constants/queryKeys";
import { useFriends } from "../../hooks/ReactQuery/useFriends";
import { useProfile } from "../../hooks/ReactQuery/useProfile";
import { sender } from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";
import { CancelSubmitButtons } from "../generics/CancelSubmitButtons";
import CurvedModal from "../generics/CurvedModal";
import { AddUser } from "../generics/Icons/AddUser";

export default function FriendRequestModal(props: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  requestId: number;
  sender: sender;
  onModalHide?: () => void;
}) {
  const { visible, setVisible, requestId, sender, onModalHide } = props;

  const { refetch: refetchFriends } = useFriends();
  const { refetch: refetchProfile } = useProfile(sender.id);

  const respondMutation = useMutation(
    MutationKeys.RESPOND_FRIEND_REQUEST,
    (accept: boolean) =>
      goFetchLite(`friends/requests/${requestId}`, {
        method: "PUT",
        body: { accept: accept }
      }),
    {
      onSuccess: (data, variables) => {
        //@ts-ignore
        setVisible(false);
        refetchProfile();
        if (variables) {
          refetchFriends();
        }
        Toast.show({
          text1: `Friend request ${variables ? "accepted" : "declined"}`
        });
      },
      onError: (error, variables, context) => {
        console.log(error, context), setVisible(false);
        Toast.show({
          text1: `Error ${variables ? "accepting" : "declining"} friend request`
        });
      }
    }
  );
  const navigation = useNavigation();
  return (
    <CurvedModal
      isOpen={visible}
      setIsOpen={setVisible}
      title={"Friend Request"}
      onModalHide={onModalHide}
    >
      <View className="space-y-3 pt-2">
        <View className="flex-row gap-x-4 items-center">
          <View>
            <Image source={{ uri: sender?.image }} style={styles.image} />
            <View style={styles.subIcon}>
              <AddUser width={20} height={20} />
            </View>
          </View>
          <View className="gap-y-2">
            <Text>
              {sender.firstName} {sender.lastName}
            </Text>
            <View className="flex flex-row gap-x-1 items-center">
              <Ionicons
                name="person"
                size={18}
                color={colors.lightGreyBorder}
              />
              <TouchableOpacity
                onPress={() => {
                  //@ts-ignore
                  navigation.navigate("Profile", { id: sender.id });
                  setVisible(false);
                  Keyboard.dismiss();
                }}
              >
                <Text preset="blue">View profile</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <CancelSubmitButtons
          cancelText="Decline"
          submitText="Accept"
          destructiveButtonIndex={0}
          noArrow
          style={{ paddingTop: 16 }}
          submitStyle={{ backgroundColor: colors.greenYakka }}
          onPressCancel={() => {
            respondMutation.mutate(false);
          }}
          onPressSubmit={() => {
            respondMutation.mutate(true);
          }}
        />
      </View>
    </CurvedModal>
  );
}
const styles = StyleSheet.create({
  notifications: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 5
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 40,
    backgroundColor: colors.svgUserGrey
  },
  subIcon: {
    width: 22,
    height: 22,
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: colors.background,
    position: "absolute",
    bottom: -2.5,
    right: -5
  },
  row: {
    width: "100%",
    height: 75,
    alignItems: "center",
    flexDirection: "row",
    paddingHorizontal: 15
  },
  greyCircle: {
    backgroundColor: colors.lightGreyBorder,
    height: 32,
    width: 32,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30
  }
});
