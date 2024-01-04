import { useRoute } from "@react-navigation/native";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { Button, Text } from "../../../components";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { InterestList } from "../../../components/specifics/Interests/InterestList";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { MutationKeys } from "../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function InterestsScreen({
  navigation
}: RootLoggedInScreenProps<"Interests">) {
  const [chosenInterests, setChosenInterests] = useState<number[]>([]);

  const addInterests = useMutation(
    MutationKeys.INTERESTS,
    () =>
      goFetchLite("users/me/interests", {
        method: "POST",
        body: { interests: chosenInterests }
      }),

    {
      onMutate: () => {
        console.log(chosenInterests);
      },
      onSuccess: () => {
        Toast.show({ text1: "Interests added" });
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Interests failed to be added`,
          text2: error?.response?.data?.message || "",
          type: "error"
        });
      }
    }
  );

  const routeState = useRoute();
  const onPress = async () => {
    const res = await addInterests.mutateAsync();
    if (res) {
      signupNextNav({ navigation: navigation, routeName: routeState.name });
    }
  };

  return (
    <MottledGreenBackground style={styles.container}>
      <SafeAreaView style={styles.topContainer}>
        <View style={{ flexDirection: "row" }}>
          <SmartBackButton />
          <View style={{ flex: 1 }} />
          <Button preset="link" text="Next" textSize="xl" onPress={onPress} />
        </View>
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          What are your main interests?
        </Text>
      </SafeAreaView>
      <InterestList
        setChosenInterests={setChosenInterests}
        chosenInterests={chosenInterests}
      />
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15
  },
  topContainer: {
    paddingBottom: 15
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  separator: {
    height: 10,
    width: "80%"
  }
});
