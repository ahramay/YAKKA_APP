import { useState } from "react";
import { Platform, StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { useCredentialsSignupMutation } from "../../api/auth/useCredentialsSignupMutation";
import { Text, TextInput, TextInputValidators } from "../../components";
import { ContinueButton } from "../../components/generics/ContinueButton";
import { colors } from "../../constants";
import { RootLoggedOutStackProps } from "../../navigation/navigation.props";

export default function SignupScreen({
  navigation
}: RootLoggedOutStackProps<"Signup">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const valid =
    TextInputValidators.emailValidator(email) &&
    password === confirmPassword &&
    TextInputValidators.passwordValidator(password);

  const signupMutation = useCredentialsSignupMutation();

  return (
    <ScrollView
      keyboardShouldPersistTaps="handled"
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} />
      {!TextInputValidators.emailValidator(email) && email ? (
        <Text style={styles.invalidText} color={colors.background} size="sm">
          Invalid Email
        </Text>
      ) : (
        <View style={styles.separator} />
      )}
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry={true}
        style={{ letterSpacing: password.length > 1 ? 4 : 0 }}
      />
      {!TextInputValidators.passwordValidator(password) && password ? (
        <Text style={styles.invalidText} color={colors.background} size="sm">
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
      {password !== confirmPassword && confirmPassword ? (
        <Text style={styles.invalidText} color={colors.background} size="sm">
          Passwords don't match
        </Text>
      ) : (
        <View style={styles.separator} />
      )}
      <ContinueButton
        disabled={!valid}
        text="Sign Up"
        onPress={async () => {
          await signupMutation.mutateAsync({ email, password });
        }}
      />
      <View style={styles.smallSeperator} />
      <Text
        style={styles.title}
      >{`Alternatively, create an account by signing in with ${
        Platform.OS === "ios" ? "Apple, " : ""
      }Facebook, LinkedIn or Google.`}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20
  },
  title: {
    fontSize: 14,
    textAlignVertical: "center",
    textAlign: "center",
    color: colors.background
  },
  separator: {
    marginVertical: 8,
    height: 0
  },
  smallSeperator: {
    marginVertical: 5,
    height: 0,
    width: "80%"
  },
  invalidText: {
    marginVertical: 8,
    minHeight: 0,
    maxHeight: 40,
    width: "100%"
  }
});
