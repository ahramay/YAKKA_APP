import Modal from "@euanmorgan/react-native-modal";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { setBadgeCountAsync } from "expo-notifications";
import { useEffect, useState } from "react";
import {
  Image,
  ListRenderItemInfo,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View
} from "react-native";
import {
  FlatList,
  GestureHandlerRootView,
  Swipeable
} from "react-native-gesture-handler";
import { Rating } from "react-native-ratings";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useInfiniteQuery, useMutation } from "react-query";
import { Text } from "..";
import { colors } from "../../constants";
import { DarkShadowStyle } from "../../constants/CommonStyles";
import { MutationKeys, QueryKeys } from "../../constants/queryKeys";
import { useMyProfile } from "../../hooks/ReactQuery/useMyProfile";
import {
  getNotificationsResponse,
  notification,
  notificationTypes
} from "../../types/types";
import { goFetchLite } from "../../utils/goFetchLite";
import { TimeSince } from "../../utils/timeSince";
import { AddUser } from "../generics/Icons/AddUser";
import { YakkaUser } from "../generics/Icons/YakkaUser";
import FriendRequestModal from "./FriendRequestModal";
import InviteModal from "./InviteModal";
import ViewYakkaModal from "./ViewYakka/ViewYakkaModal";

const Icon = (props: { name: notificationTypes }) => {
  const { name } = props;
  switch (name) {
    case "YAKKA_INVITE":
    case "YAKKA_ACCEPTED":
    case "YAKKA_UPDATED":
    case "GROUP_INVITE":
    case "GROUP_ACCEPTED":
    case "GROUP_UPDATED":
      return (
        <View style={styles.subIcon}>
          <YakkaUser
            svgProps={{ width: 19, height: 19 }}
            color={colors.svgUserGrey}
          />
        </View>
      );
    // case "YAKKA_GROUP":
    //   return <UserGroup />;
    case "FRIEND_REQUEST":
    case "ACCEPTED_FRIEND_REQUEST":
      return (
        <View style={styles.subIcon}>
          <AddUser width={19} height={19} />
        </View>
      );

    case "YAKKA_CANCELLED":
    case "YAKKA_DECLINED":
    case "GROUP_CANCELLED":
    case "GROUP_DECLINED":
      return (
        <View style={styles.subIcon}>
          <Ionicons
            name="warning-sharp"
            color={colors.red}
            style={{ top: -1 }}
            size={16}
          />
        </View>
      );
    default:
      return null;
  }
};

export default function NotificationModal(props: {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}) {
  const { visible, setVisible } = props;
  const [inviteVisible, setInviteVisible] = useState(false);
  const [friendRequestVisible, setFriendRequestVisible] = useState(false);
  const [viewYakkaVisible, setViewYakkaVisible] = useState(false);
  const user = useMyProfile();
  const nav = useNavigation();
  const [chosenNotification, setChosenNotification] =
    useState<notification | null>(null);
  const {
    data: notifications,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage
  } = useInfiniteQuery<getNotificationsResponse>(
    QueryKeys.NOTIFICATIONS,
    ({ pageParam }) =>
      goFetchLite("notifications", {
        method: "GET",
        params: {
          page: pageParam
        }
      }),
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true,
      onSuccess: data => {
        console.log("not",data)
        setListData(data?.pages.flatMap(p => p.notifications));
      }
    }
  );

  const notificationsRead = useMutation(
    MutationKeys.NOTIFICATION_READ,
    (notificationIds: number[]) =>
      goFetchLite("notifications/read", {
        method: "PUT",
        body: { notificationIds }
      }),
    {
      onSuccess: data => {
        setBadgeCountAsync(data.unreadCount);
      }
    }
  );

  const notificationDelete = useMutation(
    MutationKeys.NOTIFICATION_READ,
    (notificationId: number) =>
      goFetchLite(`notifications/${notificationId}`, {
        method: "DELETE"
      }),
    {
      onSuccess: data => {
        refetch();
        setListData(notifications?.pages.flatMap(p => p.notifications));
        console.log("success deleting notification!");
      }
    }
  );

  const minimise = () => {
    setVisible(false);
    refetch();
  };
  const insets = useSafeAreaInsets();
  const onPressYakkaInvite = (item: notification) => {
    setChosenNotification(item);
    minimise();
    setTimeout(() => setInviteVisible(true), 460);
  };

  const onPressFriendRequest = (item: notification) => {
    setChosenNotification(item);
    minimise();
    setTimeout(() => setFriendRequestVisible(true), 460);
  };

  const onPressInspectYakka = (item: notification) => {
    setChosenNotification(item);
    minimise();
    setTimeout(() => setViewYakkaVisible(true), 460);
  };

  const onPressVerifyYakka = () => {
    minimise();
    //@ts-ignore
    setTimeout(() => nav.navigate("VerifyAccount"), 460);
  };

  useEffect(() => {
    const notificationIds = notifications?.pages
      .flatMap(val => val.notifications)
      .map(val => val.id);
    refetch();
    if (
      visible &&
      notifications?.pages.flatMap(val => val.unreadCount)[0] !== 0
    ) {
      const sendOffIds = async () => {
        notificationIds && notificationsRead.mutate(notificationIds);
      };
      sendOffIds();
    }
  }, [visible]);
  let row: Array<any> = [];
  let prevOpenedRow: any;

  const [listData, setListData] = useState<notification[]>();
  console.log("list Not", listData)
  console.log("ne not",notifications)

  const renderNotification = (
    { item, index }: { item: notification; index: number },
    onDelete: () => void
  ) => {
    return (
      <Swipeable
        containerStyle={{
          backgroundColor: !item.isRead
            ? colors.lightGreenBackground
            : colors.background
        }}
        onSwipeableOpen={() => {
          notificationDelete.mutate(item.id);
          onDelete();
        }}
        enabled={item.type !== "FRIEND_REQUEST" && item.type !== "YAKKA_INVITE"}
        renderLeftActions={(progress, dragX) => {
          return (
            <View className="bg-[#b00000] w-full pr-5 justify-center m-0">
              <View className="h-[33px] w-[33px] items-center justify-center rounded-full bg-[#b00000]">
                <Ionicons
                  name="ios-trash-bin"
                  color={
                    !item.isRead
                      ? colors.lightGreenBackground
                      : colors.background
                  }
                  size={20}
                />
              </View>
            </View>
          );
        }}
        ref={ref => (row[index] = ref)}
        rightThreshold={-100}
      >
        <View className="w-full">
          <TouchableOpacity
            onPress={() => {
              //limitation of react native in ios is an inability to handle two modals at once so the timeout is the work around
              item.type === "YAKKA_INVITE" && onPressYakkaInvite(item);

              item.type === "FRIEND_REQUEST" && onPressFriendRequest(item);
              //@ts-ignore
              (item.type === "VERIFICATION_FAILED" ||
                item.type === "VERIFICATION_REMINDER") &&
                onPressVerifyYakka();

              (item.type === "YAKKA_UPDATED" ||
                item.type === "YAKKA_ACCEPTED" ||
                item.type === "YAKKA_DECLINED") &&
                onPressInspectYakka(item);
            }}
            disabled={
              item.type === "YAKKA_REVIEWED" ||
              item.type === "MISC" ||
              item.type === "ACCEPTED_FRIEND_REQUEST" ||
              item.type === "VERIFICATION_SUCCEEDED" ||
              (item.type === "VERIFICATION_FAILED" && user.data?.isVerified)
            }
            style={[
              styles.row,
              {
                backgroundColor: !item.isRead
                  ? colors.lightGreenBackground
                  : colors.background
              }
            ]}
          >
            <>
              <View>
                {item.sender ? (
                  <Image
                    source={{ uri: item.sender.image || "" }}
                    style={styles.image}
                  />
                ) : (
                  <View style={styles.image}>
                    <Ionicons
                      name="person-outline"
                      size={26}
                      color={colors.background}
                    />
                  </View>
                )}

                <Icon name={item.type} />
              </View>
              <View
                style={{
                  flexGrow: 1,
                  paddingLeft: 20,
                  paddingRight: 40,
                  paddingTop: 3,
                  alignItems: "flex-start"
                }}
              >
                {item.review && (
                  <Rating
                    startingValue={item.review.rating}
                    readonly
                    imageSize={16}
                    style={{
                      paddingBottom: 2,
                      backgroundColor: !item.isRead
                        ? colors.lightGreenBackground
                        : colors.background
                    }}
                  />
                )}
                <Text size="lg" style={{ width: "99%" }}>
                  {item.prepositionName && (
                    <Text size="lg" weight="700" style={{ width: "100%" }}>
                      {item.prepositionName}
                    </Text>
                  )}
                  {`${item.prepositionName ? " " : ""}${item.clause}`}
                </Text>
                <Text className="pt-1">{TimeSince(item.timestamp).string}</Text>
              </View>
            </>
          </TouchableOpacity>
        </View>
      </Swipeable>
    );
  };
  const deleteItem = ({ item, index }: ListRenderItemInfo<any>) => {
    console.log(item, index);
    let a = notifications?.pages.flatMap(p => p.notifications);
    if (a) {
      a.splice(index, 1);
      console.log(a);
      setListData([...a]);
    }
  };
  return (
    <>
      <Modal
        animationIn={"bounceInRight"}
        animationOut={"bounceOutRight"}
        statusBarTranslucent={false}
        onBackdropPress={visible ? minimise : undefined}
        backdropOpacity={0}
        isVisible={visible}
        style={[
          DarkShadowStyle,
          {
            margin: 0,
            justifyContent: "flex-start"
          }
        ]}
      >
        <View
          className="shadow-lg"
          style={[
            {
              backgroundColor: colors.background,
              elevation: 8,
              top: Platform.OS === "ios" ? insets.top : undefined,
              maxHeight: "100%"
            }
          ]}
        >
          <View className="flex-row w-full items-center justify-between p-4">
            <Text size="2xl" weight="700">
              Notifications
            </Text>
            <TouchableOpacity style={styles.greyCircle} onPress={minimise}>
              <Ionicons
                size={22}
                name="close"
                style={{ fontWeight: "bold" }}
                color={colors.dim}
              />
            </TouchableOpacity>
          </View>
          <GestureHandlerRootView className="w-full h-full">
            {notifications && (
              <FlatList
                CellRendererComponent={({ children }) => children}
                removeClippedSubviews={false}
                keyExtractor={(item, index) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                onEndReachedThreshold={0.8}
                onEndReached={() => {
                  if (hasNextPage) {
                    fetchNextPage();
                  }
                }}
                contentContainerStyle={{ paddingBottom: 70 }}
                data={listData}
                renderItem={v => renderNotification(v, () => deleteItem(v))}
              />
            )}
          </GestureHandlerRootView>
        </View>
      </Modal>
      {chosenNotification && (
        <>
          <InviteModal
            visible={inviteVisible}
            setVisible={setInviteVisible}
            onModalHide={() => setChosenNotification(null)}
            yakkaId={Number(chosenNotification.yakkaId)}
            sender={chosenNotification?.sender}
          />
          <FriendRequestModal
            visible={friendRequestVisible}
            setVisible={setFriendRequestVisible}
            onModalHide={() => setChosenNotification(null)}
            requestId={Number(chosenNotification?.friendRequestId)}
            sender={chosenNotification?.sender}
          />
          <ViewYakkaModal
            visible={viewYakkaVisible}
            setVisible={setViewYakkaVisible}
            onModalHide={() => setChosenNotification(null)}
            yakkaId={Number(chosenNotification.yakkaId)}
            yourYakka={chosenNotification.type !== "YAKKA_UPDATED"}
          />
        </>
      )}
    </>
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
    backgroundColor: colors.svgUserGrey,
    borderColor: colors.black,
    justifyContent: "center",
    alignItems: "center"
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
