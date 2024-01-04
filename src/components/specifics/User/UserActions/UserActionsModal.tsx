import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { FlatList, TouchableOpacity, View, ViewStyle } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Layout } from "../../../../constants";
import { MutationKeys } from "../../../../constants/queryKeys";
import useInitiateChat from "../../../../hooks/ReactQuery/useInitiateChat";
import { GetProfileResponse } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { Text } from "../../../defaults";
import CurvedModal, { CurvedModalProps } from "../../../generics/CurvedModal";
import { AreYouSure } from "./AreYouSure";
import { Report } from "./Report";
import {  HomeTabScreenProps } from "../../../../navigation/navigation.props";

interface AddReviewModalProps
  extends Omit<CurvedModalProps, "children" | "title"> {
  user: GetProfileResponse;
}

interface AreYouSureContent {
  title: string;
  content: string;
  submitText?: string;
  onPress: () => void;
}
const defaultAreYouSure = {
  title: "",
  content: "",
  submitText: "",
  onPress: () => {}
};
export default function UserActionsModal(props: AddReviewModalProps) {
  const { user, alignTop = true, ...rest } = props;
  const [reportVisible, setReportVisible] = useState<boolean>(false);
  const [areYouSureVisible, setAreYouSureVisible] = useState<boolean>(false);

  const navigation = useNavigation<HomeTabScreenProps<"Home">["navigation"]>();

  const deleteFriendMutation = useMutation(
    MutationKeys.DELETE_FRIEND,
    () =>
      goFetchLite(`friends/${user.friendshipId}`, {
        method: "DELETE"
      }),
    {
      onSuccess: () => {
        //@ts-ignore
        navigation.navigate("HomeTabs", { screen: "Home" });
        props.setIsOpen(false);
        Toast.show({
          text1: `You deleted ${user.firstName} ${user.lastName} as a friend`
        });
      }
    }
  );

  const blockMutation = useMutation(
    MutationKeys.BLOCK,
    () =>
      goFetchLite(`users/${user.id}/block`, {
        method: "POST"
      }),
    {
      onSuccess: () => {
        navigation.navigate("HomeTabs", { screen: "Home" });
        props.setIsOpen(false);
        Toast.show({ text1: `You blocked ${user.firstName} ${user.lastName}` });
      }
    }
  );

  const [areYouSure, setAreYouSure] =
    useState<AreYouSureContent>(defaultAreYouSure);

  interface buttonItem {
    text: string;
    onPress: () => void;
    style?: ViewStyle;
  }

  useEffect(() => {
    if (props.isOpen) {
      setAreYouSureVisible(false);
    }
  }, [props.isOpen]);

  const chatQuery = useInitiateChat(user);
  

  const actions: buttonItem[] = [
 
    {
      text: "Chat",
      onPress: () => {
        chatQuery.refetch();
        props.setIsOpen(false);
      }
    },
    {
      text: "Unfriend",
      onPress: () => {
        setAreYouSure({
          title: "Unfriend",
          content: `${user.firstName} will be removed as your friend on YAKKA.`,
          onPress: () => deleteFriendMutation.mutate()
        });
        setAreYouSureVisible(true);
      }
    },
    {
      text: "Block",
      onPress: () => {
        setAreYouSure({
          title: "Block",
          content: `${user.firstName} will no longer be able to view your profile, chat with you or invite you to YAKKA`,
          onPress: () => blockMutation.mutate()
        });
        setAreYouSureVisible(true);
      }
    },
    {
      text: "Report",
      onPress: () => {
        setReportVisible(true);
      }
    }
  ];

  const RenderItem = (props: { item: buttonItem }) => {
    const { item } = props;
    return (
      <TouchableOpacity style={item.style} onPress={item.onPress}>
        <Text preset="blue">{item.text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <CurvedModal
      backdropOpacity={0.8}
      contentContainerClassName={"pb-7"}
      alignTop={alignTop}
      {...rest}
      title={user.firstName}
    >
      {!areYouSureVisible && !reportVisible && (
        <FlatList
          ListHeaderComponent={() => (
            <View style={{ width: Layout.window.width * 0.1 }} />
          )}
          style={{
            paddingTop: 10
          }}
          contentContainerStyle={{
            justifyContent: "space-between",
            width: "100%",
            paddingHorizontal: 15,
            position: "relative"
          }}
          data={actions}
          horizontal
          renderItem={({ item }) => <RenderItem item={item} />}
        />
      )}
      {reportVisible && (
        <Report
          onSuccess={() => props.setIsOpen(false)}
          onPressCancel={() => setReportVisible(false)}
          user={user}
        />
      )}
      {areYouSureVisible && (
        <AreYouSure
          title={areYouSure?.title}
          content={areYouSure?.content}
          onPressCancel={() => {
            setAreYouSureVisible(false);
            setAreYouSure(defaultAreYouSure);
          }}
          onPressSubmit={areYouSure.onPress}
          submitText={areYouSure.submitText}
        />
      )}
    </CurvedModal>
  );
}
