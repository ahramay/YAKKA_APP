import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { setRecoil } from "recoil-nexus";
import { MutationKeys } from "../../constants/queryKeys";
import { loadingAtom } from "../../recoil/loadingAtom";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { signupScreensAtom } from "../../recoil/signupAtoms";
import { goFetchLite } from "../../utils/goFetchLite";
import { deleteItem } from "../../utils/localStorage";

export const useDeleteAccountMutation = () =>
  useMutation(
    MutationKeys.DELETE_ACCOUNT,
    () =>
      goFetchLite("auth/", {
        method: "DELETE"
      }),
    {
      onSuccess: data => {
        setTimeout(async () => {
          await deleteItem("accessToken");
          await deleteItem("refreshToken");
          setRecoil(loggedInAtom, false);
          setRecoil(signupScreensAtom, []);
          setRecoil(loadingAtom, true);
          Toast.show({
            text1: "Account deleted successfully"
          });
        }, 460);
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: "Something went wrong",
          text2: error?.response?.data?.message
        });
      }
    }
  );
