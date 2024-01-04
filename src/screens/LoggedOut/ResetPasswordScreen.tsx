import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Text, TextInput, TextInputValidators } from "../../components";
import { ContinueButton } from "../../components/generics/ContinueButton";
import { SmartBackButton } from "../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../constants";
import { MutationKeys } from "../../constants/queryKeys";
import { RootLoggedOutStackProps } from "../../navigation/navigation.props";
import { goFetchLite } from "../../utils/goFetchLite";

interface resetPasswordInput {
  newPassword: string;
  token: string;
  userId: number;
}

export default function ResetPasswordScreen({
  route,
  navigation
}: RootLoggedOutStackProps<"ResetPassword">) {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetObj, setResetObj] = useState<resetPasswordInput>(route.params);

  const usePasswordResetMutation = useMutation(
    MutationKeys.PASSWORD_RESET,
    () =>
      goFetchLite(`auth/credentials/reset`, {
        method: "POST",
        body: resetObj
      }),
    {
      onSuccess: (data, variables) => {
        //@ts-ignore
        Toast.show({
          text1: `Password reset successfully`
        });
        navigation.navigate("Signin");
      },
      onError: (error, context) => {
        Toast.show({
          text1: `Password reset failed`,
          //@ts-ignore
          text2: error
        });
        navigation.goBack();
      }
    }
  );
  return (
    <MottledGreenBackground style={{ flex: 1 }}>
      <SafeAreaView className="flex-1 px-4 items-center">
        <View style={styles.row}>
          <SmartBackButton dumb onPress={() => navigation.goBack()} />
          <View style={{ flex: 1 }} />
          <Text preset="strong" style={styles.title}>
            Password Reset
          </Text>
        </View>
        <View className="items-center w-full p-4">
          <Text weight="700" style={{ textAlign: "center", width: "85%" }}>
            Enter your email address and we will send you a password reset link.
          </Text>
          <View style={styles.separator} />
          <TextInput
            placeholder="Password"
            value={resetObj?.newPassword}
            onChangeText={text =>
              setResetObj({ ...resetObj, newPassword: text })
            }
            secureTextEntry={true}
            style={{ letterSpacing: resetObj.newPassword.length > 1 ? 4 : 0 }}
          />
          {!TextInputValidators.passwordValidator(resetObj.newPassword) &&
          resetObj.newPassword ? (
            <Text
              style={styles.invalidText}
              color={colors.background}
              size="sm"
            >
              Password requires 1 number, 1 upper case character and lower case
              character
            </Text>
          ) : (
            <View style={styles.separator} />
          )}
          <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={true}
            style={{ letterSpacing: confirmPassword.length > 1 ? 4 : 0 }}
          />
          {resetObj.newPassword !== confirmPassword && confirmPassword ? (
            <Text
              style={styles.invalidText}
              color={colors.background}
              size="sm"
            >
              Passwords don't match
            </Text>
          ) : (
            <View style={styles.separator} />
          )}
          <ContinueButton
            text="Reset password"
            disabled={
              resetObj.newPassword !== confirmPassword ||
              !TextInputValidators.passwordValidator(resetObj.newPassword)
            }
            onPress={() => usePasswordResetMutation.mutate()}
          />
        </View>
      </SafeAreaView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  invalidText: {
    marginVertical: 12,
    minHeight: 0,
    maxHeight: 40,
    width: "100%"
  },
  separator: {
    marginVertical: 12,
    height: 0
  },
  row: {
    flexDirection: "row",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 20
  },
  title: {
    fontSize: 20,
    textAlign: "center",
    alignSelf: "center",
    position: "absolute",
    paddingBottom: 3
  }
});
