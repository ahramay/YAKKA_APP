import * as Google from "expo-auth-session/providers/google";
import React, { useEffect } from "react";
import { View } from "react-native";
import Svg, { Path } from "react-native-svg";
import config from "../../../../../env";
import { useGoogleSigninMutation } from "../../../../api/auth/useGoogleSigninMutation";
import { colors } from "../../../../constants";
import { Button, Text } from "../../../defaults";

// https://docs.expo.dev/versions/latest/sdk/auth-session/
// https://docs.expo.dev/guides/authentication/#google

export default function GoogleSignIn() {
  const [request, response, promptAsync] = Google.useAuthRequest({
    iosClientId: config.GOOGLE_IOS_CLIENT_ID,
    androidClientId: config.GOOGLE_ANDROID_CLIENT_ID
  });

  const signInMutation = useGoogleSigninMutation();
  useEffect(() => {
    if (
      response?.type === "success" &&
      response.authentication?.idToken &&
      response.authentication.refreshToken
    ) {
      if (!response.authentication) {
        // TODO: throw error or something
        return;
      }
      signInMutation.mutate({
        idToken: response.authentication.idToken,
        refreshToken: response.authentication.refreshToken
      });
    }
  }, [response]);

  return (
    <Button
      preset="wide"
      children={
        <>
          <View style={{ position: "absolute", left: 35 }}>
            <Svg viewBox="0 0 24 24" width={18} height={18}>
              <Path
                fill="#4285F4"
                d="M-3.264 51.509c0-.79-.07-1.54-.19-2.27h-11.3v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"
                transform="translate(27.009 -39.239)"
              />
              <Path
                fill="#34A853"
                d="M-14.754 63.239c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96h-3.98v3.09c1.97 3.92 6.02 6.62 10.71 6.62z"
                transform="translate(27.009 -39.239)"
              />
              <Path
                fill="#FBBC05"
                d="M-21.484 53.529c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29v-3.09h-3.98a11.86 11.86 0 000 10.76l3.98-3.09z"
                transform="translate(27.009 -39.239)"
              />
              <Path
                fill="#EA4335"
                d="M-14.754 43.989c1.77 0 3.35.61 4.6 1.8l3.42-3.42c-2.07-1.94-4.78-3.13-8.02-3.13-4.69 0-8.74 2.7-10.71 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"
                transform="translate(27.009 -39.239)"
              />
            </Svg>
          </View>
          <Text
            preset="b"
            style={{
              color: colors.text,
              textAlign: "center",
              flex: 1
            }}
          >
            {"Sign in with Google"}
          </Text>
        </>
      }
      style={{
        backgroundColor: colors.background
      }}
      disabled={!request}
      onPress={() => {
        promptAsync({ showInRecents: true });
      }}
    />
  );
}
