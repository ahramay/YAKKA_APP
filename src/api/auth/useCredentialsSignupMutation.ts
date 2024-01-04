import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { useSetRecoilState } from "recoil";
import { MutationKeys } from "../../constants/queryKeys";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { goFetchLite } from "../../utils/goFetchLite";
import { storeTokens } from "../../utils/localStorage";

interface signinParams {
  email: string;
  password: string;
}

export const useCredentialsSignupMutation = () => {
  const setLoggedIn = useSetRecoilState(loggedInAtom);
  return useMutation(
    MutationKeys.CREDENTIALS_SIGNUP,
    (credentials: signinParams) =>
      goFetchLite("auth/credentials/signup", {
        method: "POST",
        body: credentials
      }),
    {
      onMutate: variables => {
        console.log(variables);
      },
      onSuccess: async data => {
        await storeTokens(data);
        setLoggedIn(true);
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: `Error signing up`,
          text2: error?.response?.data?.message
        });
      }
    }
  );
};
