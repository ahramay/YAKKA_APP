import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { useQuery } from "react-query";
import { Text, TextInput } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { QueryKeys } from "../../../constants/queryKeys";
import { checkSignupProgressSchema } from "../../../models";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";
import { storeData } from "../../../utils/localStorage";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function NameSetupScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"NameSetup">) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const { data } = useQuery<checkSignupProgressSchema>(
    QueryKeys.SIGNUP_PROGRESS,
    () =>
      goFetchLite("users/signup/progress", {
        method: "GET"
      }),
    {
      onSuccess: data => {
        setFirstName(data.autoFill.firstName);
        setLastName(data.autoFill.lastName);
      },
      onError: data => {
        console.log(data);
      }
    }
  );
  //regex for maximum length 15

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          What's your name?
        </Text>
        <View style={styles.separator} />
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.header}>First Name</Text>
        <TextInput
          placeholder="e.g. Bobby"
          value={firstName}
          onChangeText={setFirstName}
        />
        <View style={styles.separator} />
        <Text style={styles.header}>Last Name</Text>
        <TextInput
          placeholder="e.g. Brown"
          value={lastName}
          onChangeText={setLastName}
        />
        <View style={styles.separator} />
        <Text preset="b" style={{ textAlign: "center" }}>
          This will be shown on your profile. You won't be able to change this
          later.
        </Text>
        <View style={styles.separator} />
        <ContinueButton
          disabled={firstName.length < 2 || lastName.length < 2}
          signupNavigation={navigation}
          onPress={() => {
            storeData("firstName", firstName);
            storeData("lastName", lastName);
            return true;
          }}
        />
      </ScrollView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    flex: 4
  },
  topContainer: {
    paddingHorizontal: 15
  },
  separator: {
    height: 20,
    width: "80%"
  },
  header: {
    alignSelf: "flex-start",
    paddingBottom: 5
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
