import { useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
  FlatList,
  ListRenderItemInfo,
  Pressable,
  StyleSheet,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { colors } from "../../../../constants";
import { MutationKeys } from "../../../../constants/queryKeys";
import { HomeDrawerScreenProps } from "../../../../navigation/navigation.props";
import { GetProfileResponse } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { Text } from "../../../defaults";
import { CancelSubmitButtons } from "../../../generics/CancelSubmitButtons";
import { Checkbox } from "../../../generics/Checkbox";

type reportReason = {
  string: string;
  popupString: string;
  enum: "HARASSMENT" | "BIO" | "PICTURE" | "SAFETY";
};

const reportReasons: reportReason[] = [
  {
    popupString: "an unsuitable picture",
    string: "Unsuitable picture",
    enum: "PICTURE"
  },
  {
    popupString: "having unsuitable bio content",
    string: "Unsuitable bio content",
    enum: "BIO"
  },
  { popupString: "harrassment", string: "Harrassment", enum: "HARASSMENT" },
  {
    popupString: "being a safety concern",
    string: "Safety concern",
    enum: "SAFETY"
  }
];
export const Report = (props: {
  onPressCancel: () => void;
  onSuccess: () => void;
  user: GetProfileResponse;
}) => {
  const [reportReason, setReportReason] = useState<reportReason>();
  const navigation = useNavigation();
  const reportMutation = useMutation(
    MutationKeys.REPORT,
    () =>
      goFetchLite(`users/${props.user.id}/report`, {
        method: "POST",
        body: { reason: reportReason?.enum }
      }),
    {
      onSuccess: () => {
        props.onSuccess();
        //@ts-ignore
        setTimeout(() => navigation.navigate("HomeTabs"), 460);
        Toast.show({
          text1: `You reported ${props.user.firstName} ${props.user.lastName} for ${reportReason?.popupString}`
        });
      }
    }
  );
  const RenderItem = ({ item }: ListRenderItemInfo<reportReason>) => {
    return (
      <Pressable style={[styles.listItem]}>
        <Checkbox
          hitSlop={{ right: 300, top: 10, bottom: 10 }}
          isChecked={reportReason?.enum === item.enum}
          variant="circle"
          onPress={() => {
            setReportReason(item);
          }}
        />
        <Text size="lg" style={{ flex: 1 }}>
          {item.string}
        </Text>
      </Pressable>
    );
  };
  return (
    <View>
      <Text
        style={{ paddingLeft: 15, paddingBottom: 25 }}
        size="lg"
        color={colors.dim}
      >
        Report
      </Text>
      <FlatList
        data={reportReasons}
        renderItem={RenderItem}
        style={{ width: "100%" }}
      />
      <CancelSubmitButtons
        onPressCancel={props.onPressCancel}
        onPressSubmit={() => {
          reportMutation.mutate();
        }}
        disabled={reportReason === undefined}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 1
  },
  topContainer: {
    paddingHorizontal: 15
  },
  separator: {
    height: 20
  },
  largeSeparator: {
    height: 40
  },
  listItem: {
    width: "100%",
    backgroundColor: colors.background,
    paddingLeft: 15,
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    marginVertical: 4
  }
});
