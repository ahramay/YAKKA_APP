import { useNavigation } from "@react-navigation/native";
import { Alert, View } from "react-native";
import { Text } from "../defaults";
import CurvedModal, { CurvedModalProps } from "../generics/CurvedModal";
import { AreYouSure } from "./User/UserActions/AreYouSure";

interface MustBeVerifiedModalProps
  extends Omit<CurvedModalProps, "children" | "title"> {
  userPendingVerification: boolean;
}

export default function MustBeVerifiedModal(props: MustBeVerifiedModalProps) {
  const {
    alignTop = true,
    userPendingVerification,
    setIsOpen,
    ...rest
  } = props;

  const navigation = useNavigation();
  return (
    <CurvedModal
      backdropOpacity={0.8}
      alignTop={alignTop}
      setIsOpen={setIsOpen}
      {...rest}
      title={"Verify Account"}
    >
      {userPendingVerification === true ? (
        <View style={{ paddingLeft: 15 }}>
          <Text size="lg">{`Your account must be verified before you can add a YAKKA. \n \nWe have your verification photo, it may take time for your picture to be verfied by our team. Thank you for your patience.`}</Text>
        </View>
      ) : (
        <AreYouSure
          content={
            "Your account must be verified before you can add a YAKKA. \n \nWhen you have submitted a photo for verification, it may take time for your picture to be verfied by our team. Thank you for your patience."
          }
          onPressSubmit={() => {
            //@ts-ignore
            navigation.navigate("VerifyAccount");
            setIsOpen(false);
          }}
          onPressCancel={() => {
            setIsOpen(false);
          }}
          submitText={"Verify Me"}
        />
      )}
    </CurvedModal>
  );
}
