import * as AppleAuthentication from "expo-apple-authentication";
import React from "react";
import { useAppleSigninMutation } from "../../../../api/auth/useAppleSigninMutation";
import useCustomToast from "../../../../hooks/useCustomToast";

export default function AppleSignIn() {
  // https://docs.expo.dev/versions/latest/sdk/apple-authentication/
  const { errorToast } = useCustomToast();

  // Because Apple are control freaks, they require us to use their button
  //   With limited customisation

  const signInMutation = useAppleSigninMutation();
  return (
    <AppleAuthentication.AppleAuthenticationButton
      buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
      buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
      cornerRadius={8}
      style={{
        width: "100%",
        paddingVertical: 28,
        justifyContent: "space-between"
      }}
      onPress={async () => {
        try {
          const credential = await AppleAuthentication.signInAsync({
            requestedScopes: [
              AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
              AppleAuthentication.AppleAuthenticationScope.EMAIL
            ]
          });

          if (!credential) {
            throw new Error("Oops, something went wrong");
          }
          signInMutation.mutate({
            firstName: credential.fullName?.givenName,
            lastName: credential.fullName?.familyName,
            authToken: credential.authorizationCode,
            idToken: credential.identityToken
          });
          // Backend will create the user's account and send back an access and refresh token.
        } catch (e: any) {
          if (e.code === "ERR_CANCELED") {
            // handle that the user canceled the sign-in flow
            console.log("cancelled signup");
          } else {
            // handle other errors
            errorToast("Something went wrong with Apple sign in");
          }
        }
      }}
    />
  );
}
