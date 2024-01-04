import { useRoute } from "@react-navigation/native";
import { useEffect, useRef, useState } from "react";
import {
  Alert,
  ScrollView,
  StyleSheet,
  TextInput as TextInputRef,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import {
  RootLoggedInScreenProps,
  RootLoggedInStackList
} from "../../../navigation/navigation.props";
import { storeData } from "../../../utils/localStorage";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function BirthdayScreen({
  navigation
}: RootLoggedInScreenProps<"Birthday">) {
  const [day, setDay] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const today = new Date();
  const dayRef = useRef<TextInputRef>(null);
  const monthRef = useRef<TextInputRef>(null);
  const yearRef = useRef<TextInputRef>(null);
  const routeState = useRoute();

  // THIS STEP IN THE SIGNUP HAS BEEN REMOVED.
  // I AM GOING TO LEAVE IT INCASE A SIMILAR FEATURE RETURNS
  // BUT LETS SKIP HERE

  const navNext = () => {
    signupNextNav({ navigation: navigation, routeName: routeState.name });
  };

  const [BirthdayToday, setBirthdayToday] = useState(false);
  const age =
    new Date().getFullYear() -
    Number(year) +
    (Number(month) - new Date().getMonth() - 1 >= 0
      ? Number(month) - new Date().getMonth() - 1 == 0
        ? Number(day) - new Date().getDate() >= 0
          ? Number(day) - new Date().getDate() == 0
            ? -1000000
            : -1
          : 0
        : -1
      : 0);

  const alertAge = () => {
    Alert.alert(
      age < 0 ? `Happy birthday! You're ${age + 1000000}` : `You're ${age}`,
      `Make sure this is your correct age as you can't change this later. `,
      [
        {
          text: "OK",
          onPress: () => {
            navNext();
            storeData<keyof RootLoggedInStackList>(
              "signupNavigation",
              "Gender"
            );
            storeData("dateOfBirth", `${year}-${month}-${day}`);
          },
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
        onDismiss: () => {}
      }
    );
  };

  const validateDay = (value: string) => {
    if (Number(value) < 32 && Number(value) > 0 && value.length === 2) {
      return true;
    } else {
      return false;
    }
  };

  const validateMonth = (value: string) => {
    if (Number(value) < 13 && Number(value) > 0 && value.length === 2) {
      return true;
    } else {
      return false;
    }
  };
  const validateYear = (value: string) => {
    const century = value.slice(0, 2);
    if (
      today.getFullYear() - 17 >= Number(value) &&
      value.length === 4 &&
      (century == "20" || century == "19")
    ) {
      return true;
    } else {
      return false;
    }
  };

  useEffect(() => {
    //use timeout so the keyboard comes up
    setTimeout(() => dayRef.current?.focus());
  }, []);
  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          When is your birthday?
        </Text>
      </SafeAreaView>

      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.row}>
          <View className="flex-1 items-center gap-y-1">
            <Text weight="900">Day</Text>
            <TextInput
              style={styles.input}
              placeholder="DD"
              maxLength={2}
              value={day}
              innerRef={dayRef}
              keyboardType={"number-pad"}
              onChangeText={setDay}
              validator={val => validateDay(val) || val.length !== 2}
              onSubmitEditing={() => {
                if (validateDay(day)) {
                  monthRef.current?.focus();
                }
              }}
            />
          </View>
          <View style={{ width: 10 }} />
          <View className="flex-1 items-center gap-y-1">
            <Text weight="900">Month</Text>
            <TextInput
              style={styles.input}
              placeholder="MM"
              maxLength={2}
              value={month}
              innerRef={monthRef}
              onChangeText={setMonth}
              keyboardType={"number-pad"}
              validator={val => validateMonth(val) || val.length !== 2}
              onSubmitEditing={() => {
                if (validateMonth(month)) {
                  yearRef.current?.focus();
                }
              }}
            />
          </View>
          <View style={{ width: 10 }} />
          <View className="flex-1 items-center gap-y-1">
            <Text weight="900">Year</Text>
            <TextInput
              style={[styles.input, { flex: 2 }]}
              placeholder="YYYY"
              maxLength={4}
              value={year}
              innerRef={yearRef}
              onChangeText={setYear}
              validator={val => validateYear(val) || val.length !== 4}
              keyboardType={"number-pad"}
            />
          </View>
        </View>
        <View style={styles.separator} />
        <Text preset="b" style={{ textAlign: "center" }}>
          {`We only show your age, not your birthday. You won't be able to change this later. You must be 18 to YAKKA.`}
        </Text>
        <View style={styles.separator} />
        <ContinueButton
          disabled={
            !validateDay(day) ||
            !validateMonth(month) ||
            !validateYear(year) ||
            (age > 0 ? age < 18 : age + 1000000 < 18)
          }
          onPress={alertAge}
        />
      </ScrollView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
    paddingTop: 30,
    flex: 4
  },
  row: { flexDirection: "row", paddingHorizontal: 20 },
  topContainer: {
    paddingHorizontal: 15
  },
  input: {
    textAlign: "center",
    fontFamily: "Roboto_700Bold",
    letterSpacing: 2,
    flex: 1,
    width: "100%"
  },
  separator: {
    height: 20
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
