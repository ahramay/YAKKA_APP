import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { colors } from "../../../../constants";
import { RootLoggedInScreenProps } from "../../../../navigation/navigation.props";
import { Button } from "../../../defaults";

export const EditProfile = () => {
  const navigation = useNavigation<RootLoggedInScreenProps<"Profile">>();
  return (
    <Button
      preset="link"
      text="Edit Profile"
      textPreset="blue"
      //@ts-expect-error
      onPress={() => navigation.navigate("EditProfile")}
      style={{ height: 32 }}
      childrenRight={
        <Ionicons
          name="create-outline"
          size={20}
          color={colors.greenYakka}
          style={{ marginLeft: 8 }}
        />
      }
    />
  );
};
