import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { MutationKeys, QueryKeys } from "../../constants/queryKeys";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { goFetchLite } from "../../utils/goFetchLite";
import { storeTokens } from "../../utils/localStorage";

interface signinParams {
  idToken: string;
  refreshToken: string;
}

export const useGoogleSigninMutation = () => {
  const setLoggedIn = useSetRecoilState(loggedInAtom);
  const queryClient = useQueryClient();
  return useMutation(
    MutationKeys.GOOGLE,
    (credentials: signinParams) =>
      goFetchLite("auth/google", {
        method: "POST",
        body: credentials
      }),
    {
      onSuccess: async data => {
        await storeTokens(data);
        setLoggedIn(true);
        if (data.isNewUser) {
          Toast.show({ text1: "Creating new Account" });
        }
        queryClient.refetchQueries(QueryKeys.SIGNUP_PROGRESS);
      },
      onError: (error: any) => {
        console.log(
          "google errors here",
          error,
          error.response,
          error.response.data
        );
        if (error) {
          if (error === "cancel") {
            console.log("Cancelled google signin");
          } else {
            Toast.show({
              type: "error",
              text1: `Error signing up with Google`,
              text2: error?.response?.data?.message
            });
          }
        }
      }
    }
  );
};
