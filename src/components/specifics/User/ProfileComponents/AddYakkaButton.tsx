import { ButtonProps } from "../../../defaults/Button/Button.props";
import { Button } from "../../../defaults";
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import * as React from "react";
import { View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";
import { useMutation, useQuery } from "react-query";
import { colors } from "../../../../constants";
import { MutationKeys, QueryKeys } from "../../../../constants/queryKeys";
import { useMyProfile } from "../../../../hooks/ReactQuery/useMyProfile";
import { useProfile } from "../../../../hooks/ReactQuery/useProfile";
import { RootLoggedInScreenProps } from "../../../../navigation/navigation.props";
import { GetProfileResponse, InitiateChat } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { Text } from "../../../defaults";
import CurvedModal from "../../../generics/CurvedModal";
import { Tick } from "../../../generics/Icons/Tick";
import { YakkaUser } from "../../../generics/Icons/YakkaUser";
import AddYakkaModal from "../../AddYakka/AddYakkaModal";
import MustBeVerifiedModal from "../../MustBeVerifiedModal";
import { AreYouSure } from "../UserActions/AreYouSure";
type AddYakkaProps = {
  user: GetProfileResponse;
  openAddYakka: () => void;
};
export const AddYakkaButton = ({
  user,
  openAddYakka,
  ...props
}: AddYakkaProps & Partial<ButtonProps>) => {
  const { data } = useMyProfile();
  const [mustBeVerifiedModalOpen, setMustBeVerifiedModalOpen] =
    React.useState(false);
  return (
    <>
      {data && (
        <MustBeVerifiedModal
          isOpen={mustBeVerifiedModalOpen}
          setIsOpen={setMustBeVerifiedModalOpen}
          userPendingVerification={data?.verificationPending}
        />
      )}
      <Button
        hitSlop={{
          top: 10,
          bottom: 10,
          left: 10,
          right: 10
        }}
        className="z-50"
        preset="small"
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          borderColor: colors.lightGrey,
          backgroundColor: colors.background,
          height: "auto",
          borderWidth: 1
        }}
        textSize="md"
        textWeight="400"
        textColor={"greyText"}
        text="Add YAKKA"
        onPressIn={() =>
          data && data.isVerified
            ? openAddYakka()
            : setMustBeVerifiedModalOpen(true)
        }
        childrenRight={
          <YakkaUser
            // color="white"
            // yColor="white"
            svgProps={{ width: 18, height: 18, style: { marginLeft: 5 } }}
          />
        }
        {...props}
      />
    </>
  );
};
