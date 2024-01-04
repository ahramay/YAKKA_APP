import { useState } from "react";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useCredentialsLoginMutation } from "../../api/auth/useCredentialsLoginMutation";
import { Button, Text, TextInput, TextInputValidators } from "../../components";
import { ContinueButton } from "../../components/generics/ContinueButton";
import AppleSignIn from "../../components/specifics/LoggedOut/SocialSignUp/Apple";
import FacebookSignIn from "../../components/specifics/LoggedOut/SocialSignUp/Facebook";
import GoogleSignIn from "../../components/specifics/LoggedOut/SocialSignUp/Google";
import LinkedInSignIn from "../../components/specifics/LoggedOut/SocialSignUp/LinkedIn";
import { colors } from "../../constants";
import { RootLoggedOutStackProps } from "../../navigation/navigation.props";

export default function SigninScreen({
  navigation
}: RootLoggedOutStackProps<"Signin">) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const loginMutation = useCredentialsLoginMutation();

  const valid = TextInputValidators.emailValidator(email) && password;
  return (
    <ScrollView
      style={styles.container}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ alignItems: "center" }}
    >
      <TextInput
        placeholder="Email or phone number"
        value={email}
        onChangeText={setEmail}
      />
      <View style={styles.separator} />
      <TextInput
        placeholder="Password"
        secureTextEntry={true}
        value={password}
        onChangeText={setPassword}
        style={{ letterSpacing: password.length > 1 ? 4 : 0 }}
      />
      <View style={[styles.row, { justifyContent: "flex-end" }]}>
        <Button
          text="Forgot Password"
          preset="link"
          textColor={"black"}
          textSize="md"
          textStyle={{ color: colors.background }}
          onPress={() => navigation.navigate("ForgotPassword")}
        />
      </View>
      <View style={styles.separator} />
      <ContinueButton
        disabled={!valid}
        text="Sign In"
        onPress={async () => {
          await loginMutation.mutateAsync({ email, password });
        }}
      />
      <View style={styles.separator} />
      <Text style={styles.title}>or</Text>
      {Platform.OS === "ios" && (
        <>
          <View style={styles.separator} />
          <AppleSignIn />
        </>
      )}
      <View style={styles.separator} />
      <FacebookSignIn />
      <View style={styles.smallSeperator} />
      <GoogleSignIn />
      <View style={styles.smallSeperator} />
      <LinkedInSignIn />
      <View style={{ marginVertical: 20 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.transparent,
    paddingTop: 20
  },
  title: {
    fontSize: 20,

    color: colors.background
  },
  row: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    paddingTop: 10,
    alignItems: "center"
  },
  separator: {
    marginVertical: 8,
    height: 0
  },
  smallSeperator: {
    marginVertical: 5,
    height: 0
  }
});
