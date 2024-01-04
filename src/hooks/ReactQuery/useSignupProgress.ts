import { View, Text } from "react-native";
import React from "react";
import { useQuery } from "react-query";
import { checkSignupProgressSchema } from "../../models";
import { QueryKeys } from "../../constants/queryKeys";
import { goFetchLite } from "../../utils/goFetchLite";
import signupConfig, { SignUpScreenProps } from "../../utils/signupConfig";
import * as SplashScreen from "expo-splash-screen";
import { useRecoilState } from "recoil";
import { signupScreensAtom } from "../../recoil/signupAtoms";
export default function useSignupProgress({
  enabled,
  onSuccess
}: {
  enabled: boolean;
  onSuccess?: (data: checkSignupProgressSchema) => void;
}) {
  const [signupScreens, setSignupScreens] = useRecoilState(signupScreensAtom);

  return useQuery<checkSignupProgressSchema>(
    QueryKeys.SIGNUP_PROGRESS,
    () =>
      goFetchLite("users/signup/progress", {
        method: "GET"
      }),
    {
      onSuccess: async data => {

        console.log("✔️✔️",data);
        if (data) {
          let old = signupConfig.filter(val => {
            return data.progress[val.route] === false;
          });
          setSignupScreens(old);
          setTimeout(() => onSuccess && onSuccess(data), 500);
          if (old.length === 0) {
            await SplashScreen.hideAsync().catch(() => {});
          } else {
            // TODO: This is a hack to make sure the splash screen is hidden after the animation of navigating
            // Ideally would like a better way to do this
            setTimeout(async () => {
              await SplashScreen.hideAsync().catch(() => {});
            }, 500);
          }
        }
      },
      onError: async (err) => {
        console.log("❌❌❌",err);

        await SplashScreen.hideAsync().catch(() => {});
      },
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      enabled
    }
  );
}
