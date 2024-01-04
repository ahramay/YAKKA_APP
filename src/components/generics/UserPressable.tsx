import { useNavigation } from "@react-navigation/native";
import {
  Pressable,
  PressableProps,
  TouchableOpacity,
  TouchableOpacityProps
} from "react-native";

interface UserPressableProps extends Omit<PressableProps, "onPress"> {
  userId: number;
  openAddYakkaModal?: boolean;
}

export const UserPressable = (props: UserPressableProps) => {
  const navigation = useNavigation();
  const { userId, ...rest } = props;
  return (
    <Pressable
      onPress={() => {
        // clear navigation params so that the modal doesn't open again

        // @ts-expect-error
        navigation.setParams({
          openAddYakkaModal: undefined
        });
        // @ts-expect-error
        navigation.navigate("Profile", {
          id: props.userId,
          openAddYakkaModal: props.openAddYakkaModal
        });
      }}
      {...rest}
    />
  );
};
