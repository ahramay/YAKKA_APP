import { useRoute } from "@react-navigation/native";
import React, { Fragment, useRef, useState } from "react";
import { Pressable, StyleSheet, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { refreshToken } from "../../../api/auth/refreshToken";
import { Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";
export default function VerifyPhoneNumberScreen({
  navigation
}: RootLoggedInScreenProps<"VerifyPhoneNumber">) {
  const [code, setCode] = useState("");
  const [containerIsFocused, setContainerIsFocused] = useState(true);
  const CODE_LENGTH = 6;
  const routeState = useRoute();

  const verifyOTPMutation = useMutation(
    MutationKeys.PHONE_NUMBER,
    () =>
      goFetchLite("auth/otp/verify", {
        method: "POST",
        body: { otp: code }
      }),
    {
      onSuccess: async data => {
        Toast.show({
          text1: "Success!",
          text2: "Correct one time passcode"
        });
        await refreshToken();
        signupNextNav({ navigation: navigation, routeName: routeState.name });
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: error?.response?.data?.message
        });
      }
    }
  );

  const codeDigitsArray = Array.from(Array(CODE_LENGTH).keys());

  const inputRef = useRef<TextInput>(null);

  const handleOnPress = (idx: number) => {
    setContainerIsFocused(true);
    setCode(code.slice(0, idx));
    inputRef.current?.focus();
  };

  const handleOnBlur = () => {
    setContainerIsFocused(false);
  };

  const toDigitInput = (_value: number, idx: number) => {
    const emptyInputChar = " ";
    const digit = code[idx] || emptyInputChar;

    const isFocused = idx === code.length;

    const containerStyle =
      containerIsFocused && isFocused
        ? { ...styles.inputContainer, ...styles.inputContainerFocused }
        : styles.inputContainer;

    return (
      <Pressable style={containerStyle} onPress={() => handleOnPress(idx)}>
        <Text size="md" weight="700">
          {digit}
        </Text>
      </Pressable>
    );
  };

  return (
    <MottledGreenBackground style={{ flex: 1 }}>
      <TextInput
        ref={inputRef}
        value={code}
        onChangeText={text => {
          setCode(text);
          if (text.length === CODE_LENGTH) {
            inputRef.current?.blur();
          }
        }}
        onSubmitEditing={handleOnBlur}
        keyboardType="number-pad"
        returnKeyType="done"
        autoFocus
        textContentType="oneTimeCode"
        maxLength={CODE_LENGTH}
        style={{
          backgroundColor: "white",
          position: "absolute",
          height: 1,
          top: -1,
          width: 1
        }}
      />
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center", width: "60%" }}>
          Enter your verification code
        </Text>
      </SafeAreaView>
      <View style={styles.container}>
        <View style={styles.inputsContainer}>
          {codeDigitsArray.map((item, index) => (
            <Fragment key={index}>{toDigitInput(item, index)}</Fragment>
          ))}
        </View>
        <ContinueButton
          style={{ marginTop: 60 }}
          disabled={code.length < 6}
          onPress={verifyOTPMutation.mutate}
        />
      </View>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 30,
    flex: 4,
    alignItems: "center"
  },
  topContainer: {
    paddingHorizontal: 15
  },
  inputsContainer: {
    width: "auto",
    zIndex: 5,
    flexDirection: "row",
    justifyContent: "space-between"
  },
  inputContainer: {
    borderRadius: 4,
    marginHorizontal: 5,
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderColor: colors.background,
    borderWidth: 2,
    width: 40,
    height: 40
  },
  inputContainerFocused: {
    borderColor: colors.facebookBlue
  },
  separator: {
    height: 20
  },
  hiddenCodeInput: {
    position: "absolute",
    height: 0,
    width: 0,
    opacity: 0
  }
});
