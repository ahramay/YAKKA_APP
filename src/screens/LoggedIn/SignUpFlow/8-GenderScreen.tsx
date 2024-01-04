import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import GenderPicker from "../../../components/specifics/GenderPicker";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import {
  RootLoggedInScreenProps,
  RootLoggedInStackList
} from "../../../navigation/navigation.props";
import { storeData } from "../../../utils/localStorage";

export default function GenderScreen({
  navigation
}: RootLoggedInScreenProps<"Gender">) {
  const [gender, setGender] = useState<string>("");

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          How do you identify?
        </Text>
      </SafeAreaView>
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.largeSeparator} />
        <GenderPicker gender={gender} setGender={setGender} />
        <View style={styles.largeSeparator} />
        <ContinueButton
          disabled={!gender}
          signupNavigation={navigation}
          onPress={() => {
            gender && storeData("gender", gender);
            storeData<keyof RootLoggedInStackList>(
              "signupNavigation",
              "DescribeYourself"
            ); //'Interests');
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
    flex: 1
  },
  topContainer: {
    paddingHorizontal: 15
  },
  separator: {
    height: 20
  },
  largeSeparator: {
    height: 40
  },

  listItem: {
    width: "100%",
    backgroundColor: colors.background,
    paddingLeft: 15,
    height: 40,
    alignItems: "center",
    flexDirection: "row",
    borderRadius: 8,
    marginVertical: 4
  }
});
