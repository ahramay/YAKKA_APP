import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { MutationKeys, QueryKeys } from "../../constants/queryKeys";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { goFetchLite } from "../../utils/goFetchLite";
import { storeTokens } from "../../utils/localStorage";

interface signinParams {
  authToken: string | null | undefined;
  idToken: string | null | undefined;
  firstName: string | null | undefined;
  lastName: string | null | undefined;
}

export const useAppleSigninMutation = () => {
  const setLoggedIn = useSetRecoilState(loggedInAtom);
  const queryClient = useQueryClient();
  return useMutation(
    MutationKeys.APPLE,
    (credentials: signinParams) =>
      goFetchLite("auth/apple", {
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
          "Apple errors here",
          error,
          error.response,
          error.response.data
        );
        if (error) {
          if (error === "cancel") {
            console.log("Cancelled Apple signin");
          } else {
            Toast.show({
              type: "error",
              text1: `Error signing up with Apple`,
              text2: error?.response?.data?.message
            });
          }
        }
      }
    }
  );
};
