import { useRoute } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { Alert, Pressable, StyleSheet, View } from "react-native";
import { Checkbox } from "../../../components/generics/Checkbox";
import CountryPicker, {
  CallingCode,
  CountryCode
} from "react-native-country-picker-modal";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { Text, TextInput, TextInputValidators } from "../../../components";
import {
  sizeObj,
  weightObj
} from "../../../components/defaults/Text/Text.presets";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function PhoneNumberScreen({
  navigation
}: RootLoggedInScreenProps<"PhoneNumber">) {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [countryCode, setCountryCode] = useState<CountryCode>("GB");
  const [callingCode, setCallingCode] = useState<CallingCode>("44");
  const [ageConfirmed, setAgeConfirmed] = useState(false);
  const [e164Format, setE164Format] = useState("");
  //regex for maximum length 15
  const routeState = useRoute();
  const sendPhoneNumberMutation = useMutation(
    MutationKeys.PHONE_NUMBER_OTP,
    () =>
      goFetchLite("auth/otp/request", {
        method: "POST",
        body: { phoneNumber: phoneNumber, phoneCountryCode: `+${callingCode}` }
      }),
    {
      onSuccess: async data => {
        Toast.show({
          text1: `Check ${e164Format}`,
          text2: data.message
        });
        signupNextNav({ navigation: navigation, routeName: routeState.name });
      },
      onError: (error: any) => {
        Toast.show({
          type: "error",
          text1: "Error sending new passcode",
          text2: error?.response?.data?.message
        });
      }
    }
  );

  useEffect(() => {
    setE164Format(
      `+${callingCode}${phoneNumber.replace(/^(?!00[1-9])0|[^0-9]/g, "")}`
    );
  }, [phoneNumber, callingCode]);
  const alertPhoneNumber = () => {
    if (!ageConfirmed)
      return Alert.alert(
        "Age confirmation",
        "Please confirm that you are over the age of 18 to continue.",
        [
          {
            text: "OK",
            onPress: () => {},
            style: "default"
          }
        ]
      );
    Alert.alert(
      "We need to verify your number",
      `We need to make sure ${e164Format} is your number.`,
      [
        {
          text: "OK",
          onPress: () => sendPhoneNumberMutation.mutate(),
          style: "default"
        },
        {
          text: "Cancel",
          onPress: () => {},
          style: "cancel"
        }
      ],
      {
        cancelable: true,
        onDismiss: () => []
      }
    );
  };

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton logout dumb />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          What's your number?
        </Text>
      </SafeAreaView>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ flexDirection: "row" }}>
          <Pressable style={styles.callingCode}>
            <CountryPicker
              countryCode={countryCode}
              theme={{
                fontSize: sizeObj["md"],
                fontFamily: weightObj["400"]
              }}
              withCallingCodeButton
              withCallingCode
              onSelect={country => {
                setCountryCode(country.cca2);
                setCallingCode(country.callingCode[0]);
              }}
            />
          </Pressable>
          <View style={{ width: 15 }} />
          <TextInput
            style={{ width: "auto", flex: 1 }}
            placeholder="e.g. 07118118118"
            maxLength={11}
            keyboardType="phone-pad"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
        </View>
        <View style={styles.separator} />
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%"
          }}
        >
          <Text>Confirm you are over 18 years of age.</Text>
          <Checkbox
            isChecked={ageConfirmed}
            onPress={() => setAgeConfirmed(prev => !prev)}
          />
        </View>
        {/* <Text>{e164Format}</Text> */}
        <View style={styles.separator} />
        <Text preset="blg" style={{ textAlign: "center" }}>
          {`We never share this with anyone and it won't be on your profile.`}
        </Text>
        <View style={styles.separator} />
        <ContinueButton
          text="Sign Up"
          disabled={
            !TextInputValidators.phoneValidator(phoneNumber) ||
            sendPhoneNumberMutation.isLoading
          }
          onPress={alertPhoneNumber}
        />
      </ScrollView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 50,
    flex: 4
  },
  topContainer: {
    paddingHorizontal: 15
  },
  separator: {
    height: 20,
    width: "80%"
  },
  callingCode: {
    height: 40,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "left",
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    borderRadius: 8
  }
});
