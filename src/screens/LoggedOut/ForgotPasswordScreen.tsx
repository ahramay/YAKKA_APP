import * as Linking from "expo-linking";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Text, TextInput, TextInputValidators } from "../../components";
import { ContinueButton } from "../../components/generics/ContinueButton";
import { SmartBackButton } from "../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../components/specifics/LoggedOut/MottledGreenBackground";
import { MutationKeys } from "../../constants/queryKeys";
import { RootLoggedOutStackProps } from "../../navigation/navigation.props";
import { goFetchLite } from "../../utils/goFetchLite";

interface resetPasswordInput {
  newPassword: string;
  token: string;
  userId: number;
}

export default function ForgotPasswordScreen({
  navigation
}: RootLoggedOutStackProps<"ForgotPassword">) {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState<boolean>(false);

  const useForgotPasswordMutation = useMutation(
    MutationKeys.FORGOT_PASSWORD,
    () =>
      goFetchLite(`auth/credentials/forgot`, {
        method: "POST",
        body: { email: email }
      }),
    {
      onSuccess: (data, variables) => {
        setLoading(true);
        console.log(data);
        Toast.show({
          text1: data.message
        });
        setTimeout(() => setLoading(false), 1000 * 10);
      },
      onError: (error, context) => {}
    }
  );

  useEffect(() => {
    const handleUrl = async (url: string | null) => {
      if (url) {
        // Parse url
        const { path, queryParams, hostname, scheme } = Linking.parse(url);
        //@ts-ignore
        navigation.navigate("ResetPassword", {
          newPassword: "",
          //@ts-ignore
          token: queryParams.token,
          //@ts-ignore
          userId: Number(queryParams.userId)
        });
      }
    };

    const subscription = Linking.addEventListener("url", ({ url }) => {
      handleUrl(url);
    });
    // if (!loggedIn) {
    //   SplashScreen.hideAsync();
    // }
    return () => subscription.remove();
  }, []);

  const valid = TextInputValidators.emailValidator(email);
  return (
    <MottledGreenBackground style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 px-4 items-center">
        <View style={styles.row}>
          <SmartBackButton dumb onPress={() => navigation.goBack()} />
          <View style={{ flex: 1 }} />
        </View>
        <Text preset="title">Password Reset</Text>
        <View className="items-center w-full p-4 gap-y-6">
          <Text weight="700" style={{ textAlign: "center", width: "85%" }}>
            Enter your email address and we will send you a password reset link.
          </Text>
          <TextInput
            placeholder="Email address"
            value={email}
            onChangeText={setEmail}
          />
          <ContinueButton
            text="Send request"
            disabled={!valid && !loading}
            onPress={() => useForgotPasswordMutation.mutate()}
          />
        </View>
      </SafeAreaView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center"
  }
});
