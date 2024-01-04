import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "../../../components";
import { sizeObj } from "../../../components/defaults/Text/Text.presets";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import JobSearch from "../../../components/specifics/JobSearch";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { storeData } from "../../../utils/localStorage";

export default function JobScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"Job">) {
  const [job, setJob] = useState("");
  //regex for maximum length 15

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          What's your job?
        </Text>
      </SafeAreaView>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <Text preset="b" style={{ textAlign: "center" }}>
          We ask for your job title to help you connect with like minded people.
        </Text>
        <View style={styles.separator} />
        <JobSearch
          jobTitle={job}
          onBlur={() => void 0}

          setJobTitle={setJob}
          options={{
            containerStyle: {
              width: "100%",
              justifyContent: "center"
            },
            inputContainerStyle: {
              borderRadius: 8,
              width: "100%",
              backgroundColor: colors.background
            },
            textInputProps: {
              style: [
                styles.input,
                {
                  fontSize: sizeObj["md"]
                }
              ],
              allowFontScaling: false,
              placeholder: "start typing your occupation"
            }
          }}
        />

        <View style={styles.separator} />
        <View style={styles.separator} />
        <ContinueButton
          disabled={job.length < 3}
          signupNavigation={navigation}
          style={{ zIndex: -1000 }}
          onPress={() => {
            storeData("jobTitle", job);
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
    paddingTop: 40,
    flex: 4
  },
  topContainer: {
    paddingHorizontal: 15
  },
  separator: {
    height: 22
  },
  input: {
    width: "100%",
    borderRadius: 10,
    paddingHorizontal: 16
  }
});
