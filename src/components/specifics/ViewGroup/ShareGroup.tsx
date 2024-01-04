import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useMutation, useQuery } from "react-query";
import { Button, Text } from "../../defaults";
import { colors } from "../../../constants";
import { useViewGroup } from "../../../hooks/ReactQuery/useViewGroup";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { GroupType } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import { MutationKeys } from "../../../constants/queryKeys";
import { YakkaUser } from "../../generics/Icons/YakkaUser";
import * as Sharing from "expo-sharing";
interface ShareGroupProps {
  group: GroupType;
}

export const ShareGroup = ({ group }: ShareGroupProps) => {
  const navigation = useNavigation<RootLoggedInScreenProps<"Profile">>();

  const share = async () => {
    await Sharing.shareAsync("");
  };
  const [isLoading, setIsLoading] = React.useState();

  return (
    <Button
      style={{
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderColor: colors.lightGrey,
        backgroundColor: colors.background,
        height: "auto",
        borderWidth: 1,
        minHeight: 32,
        marginTop: 10
      }}
      preset="small"
      disabled={isLoading}
      onPress={share}
    >
      <Ionicons
        name="share-social-outline"
        color={colors.greenYakka}
        size={16}
        style={{ marginRight: 4 }}
      />
      <Text
        size="md"
        weight="400"
        style={{
          opacity: isLoading ? 0.6 : 1
        }}
      >
        {"Share"}
      </Text>
    </Button>
  );
};
