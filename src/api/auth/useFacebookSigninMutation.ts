import Toast from "react-native-toast-message";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { MutationKeys, QueryKeys } from "../../constants/queryKeys";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { goFetchLite } from "../../utils/goFetchLite";
import { storeTokens } from "../../utils/localStorage";

interface signinParams {
  accessToken: string;
}

export const useFacebookSigninMutation = () => {
  const setLoggedIn = useSetRecoilState(loggedInAtom);
  const queryClient = useQueryClient();
  return useMutation(
    MutationKeys.FACEBOOK,
    (credentials: signinParams) =>
      goFetchLite("auth/facebook", {
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
          "Facebook errors here",
          error,
          error.response,
          error.response.data
        );
        if (error) {
          if (error === "cancel") {
            console.log("Cancelled Facebook signin");
          } else {
            Toast.show({
              type: "error",
              text1: `Error signing up with Facebook`,
              text2: error?.response?.data?.message
            });
          }
        }
      }
    }
  );
};
