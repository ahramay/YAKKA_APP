import Toast from "react-native-toast-message";
import { MutationOptions, useMutation } from "react-query";
import { useSetRecoilState } from "recoil";
import { MutationKeys } from "../../constants/queryKeys";
import { loggedInAtom } from "../../recoil/loggedInAtom";
import { goFetchLite } from "../../utils/goFetchLite";
import { storeTokens } from "../../utils/localStorage";
interface signinParams {
  email: string;
  password: string;
}

export const useCredentialsLoginMutation = () => {
  const setLoggedIn = useSetRecoilState(loggedInAtom);
  return useMutation(
    MutationKeys.CREDENTIALS_LOGIN,
    (credentials: signinParams) =>
      goFetchLite("auth/credentials/login", {
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
        if (error?.response?.data?.message === "User not found") {
          Toast.show({
            type: "error",
            text1: "Your username or password is incorrect"
          });
        } else {
          Toast.show({
            type: "error",
            text1: error?.response?.data?.message
          });
        }
      }
    }
  );
};
