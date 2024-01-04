import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation, useQueryClient } from "react-query";
import { useSetRecoilState } from "recoil";
import { colors } from "../../../../constants";
import { MutationKeys, QueryKeys } from "../../../../constants/queryKeys";
import useCustomToast from "../../../../hooks/useCustomToast";
import { SignInResponse } from "../../../../models";
import { loggedInAtom } from "../../../../recoil/loggedInAtom";
import { LinkedinLoginLinkResponse } from "../../../../types/types";
import { goFetchLite } from "../../../../utils/goFetchLite";
import { storeTokens } from "../../../../utils/localStorage";
import { Button, Text } from "../../../defaults";
// https://docs.expo.dev/versions/latest/sdk/auth-session/
// https://docs.expo.dev/guides/authentication/#google

export default function LinkedInSignIn() {
  const client = useQueryClient();
  const { toast, errorToast } = useCustomToast();
  const setLoggedIn = useSetRecoilState(loggedInAtom);
  const LinkedinLinkMutation = useMutation(
    MutationKeys.LINKEDIN,
    () =>
      goFetchLite("auth/linkedin/link", {
        method: "GET"
      }),
    {
      onSuccess: async (data: LinkedinLoginLinkResponse) => {
        // Open the browser with expo web browser auth session. Handle deep link back
        // to app
        const res = (await WebBrowser.openAuthSessionAsync(data.url)) as any;

        Linking.openURL(res.url);

        // storeTokens(data);
        // setLoggedIn(true);
      },
      onError: (error: any) => {
        errorToast("Something went wrong sigining in with LinkedIn");
      }
    }
  );

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      console.log("🛳️-linked in url here", url);
      try {
        if (url?.startsWith("yakka://authRedirect?")) {
          // Parse url
          const { path, queryParams, hostname, scheme } = Linking.parse(url);
          //@ts-ignore
          if (queryParams && queryParams.isNewUser == true) {
            Toast.show({ text1: "Creating new Account" });
          }
          await storeTokens(queryParams as SignInResponse);
          client.refetchQueries(QueryKeys.SIGNUP_PROGRESS);
          setLoggedIn(true);
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          text1: `Error completing LinkedIn sign in`,
          //@ts-ignore
          text2: error.message
        });
      }
    };
    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });

    return () => subscription.remove();
  }, []);

  return (
    <>
      <Button
        preset="wide"
        children={
          <>
            <Ionicons
              name={
                Platform.OS == "ios" ? "ios-logo-linkedin" : "logo-linkedin"
              }
              size={21}
              color={colors.background}
              style={{
                position: "absolute",
                left: 35
              }}
            />
            <Text
              preset="b"
              style={{
                color: colors.background,
                textAlign: "center",
                flex: 1
              }}
            >
              {"Sign in with LinkedIn"}
            </Text>
          </>
        }
        style={{
          backgroundColor: colors.linkedInBlue
        }}
        onPress={() => LinkedinLinkMutation.mutate()}
      />
    </>
  );
}
