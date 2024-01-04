import { useNavigation } from "@react-navigation/native";
import {
  Pressable,
  PressableProps,
  TouchableOpacity,
  TouchableOpacityProps
} from "react-native";

interface UserPressableProps extends Omit<PressableProps, "onPress"> {
  groupId: number;
}

export const GroupPressable = (props: UserPressableProps) => {
  const navigation = useNavigation();
  const { groupId, ...rest } = props;
  return (
    <Pressable
      onPress={() => {
        // clear navigation params so that the modal doesn't open again
        // @ts-expect-error
        navigation.navigate("ViewGroup", {
          id: groupId
        });
      }}
      {...rest}
    />
  );
};
