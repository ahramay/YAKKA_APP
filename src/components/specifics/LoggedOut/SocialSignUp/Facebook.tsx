import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform } from "react-native";
import { AccessToken, LoginManager } from "react-native-fbsdk-next";
import { useFacebookSigninMutation } from "../../../../api/auth/useFacebookSigninMutation";
import { colors } from "../../../../constants";
import { ShadowStyle } from "../../../../constants/CommonStyles";
import { Button, Text } from "../../../defaults";

// https://docs.expo.dev/versions/latest/sdk/auth-session/
// https://docs.expo.dev/guides/authentication/#facebook

export default function FacebookSignIn(props: {
  getPhotos?: () => Promise<any>;
  disabled?: boolean;
}) {
  const { getPhotos = false } = props;
  const signinMutation = useFacebookSigninMutation();
  const loginWithFacebook = () => {
    LoginManager.logInWithPermissions([
      "public_profile",
      "email",
      "user_photos"
    ]).then(
      function (result) {
        if (result.isCancelled) {
          console.log("Cancelled facebook");
        } else {
          AccessToken.getCurrentAccessToken().then(async response => {
            response?.accessToken &&
              signinMutation.mutate({ accessToken: response?.accessToken });
          });
        }
      },
      function (error) {
        console.log("Facebook login error", error);
      }
    );
  };

  return (
    <Button
      preset="wide"
      children={
        <>
          <Ionicons
            name={Platform.OS == "ios" ? "ios-logo-facebook" : "logo-facebook"}
            size={20}
            color={colors.background}
            style={{
              position: "absolute",
              left: 35
            }}
          />
          <Text
            preset="b"
            style={{ flex: 1, color: colors.background, textAlign: "center" }}
          >
            {getPhotos ? "Add from Facebook" : "Sign in with Facebook"}
          </Text>
        </>
      }
      style={{ ...ShadowStyle, backgroundColor: colors.facebookBlue }}
      disabled={props.disabled}
      onPress={() => {
        props.getPhotos ? props.getPhotos() : loginWithFacebook();
      }}
    />
  );
}
