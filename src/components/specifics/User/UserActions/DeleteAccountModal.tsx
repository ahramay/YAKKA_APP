import { ActivityIndicator, Alert } from "react-native";
import { useDeleteAccountMutation } from "../../../../api/auth/useDeleteAccountMutation";
import { colors } from "../../../../constants";
import CurvedModal, { CurvedModalProps } from "../../../generics/CurvedModal";
import { AreYouSure } from "./AreYouSure";

interface DeleteAccountModalProps
  extends Omit<CurvedModalProps, "children" | "title"> {}

export default function DeleteAccountModal(props: DeleteAccountModalProps) {
  const { alignTop = true, setIsOpen, ...rest } = props;
  const deleteAccountMutation = useDeleteAccountMutation();
  const alertDeletion = () => {
    Alert.alert(
      "Are you sure you want to delete your account?",
      "This action cannot be undone.",
      [
        {
          text: "Cancel",
          onPress: () => {},
          style: "default"
        },
        {
          text: "Yes",
          onPress: () => {
            deleteAccountMutation.mutate(undefined, {
              onSuccess: () => setIsOpen(false)
            });
          },
          style: "destructive"
        }
      ],
      {
        cancelable: true,
        onDismiss: () => {}
      }
    );
  };

  return (
    <CurvedModal
      backdropOpacity={0.8}
      alignTop={alignTop}
      setIsOpen={setIsOpen}
      {...rest}
      title={"Delete Account"}
    >
      {deleteAccountMutation.isLoading ? (
        <ActivityIndicator
          size={30}
          color={colors.black}
          style={{ marginTop: 20 }}
        />
      ) : (
        <AreYouSure
          content={
            "Your account will be deleted, including all your personal information that we store, and any contacts you have"
          }
          onPressSubmit={alertDeletion}
          onPressCancel={() => {
            setIsOpen(false);
          }}
          submitText={"Delete"}
        />
      )}
    </CurvedModal>
  );
}
