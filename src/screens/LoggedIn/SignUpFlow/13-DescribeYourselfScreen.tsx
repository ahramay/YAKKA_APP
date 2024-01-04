import { useRoute } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Text, TextInput } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import useSignupProgress from "../../../hooks/ReactQuery/useSignupProgress";
import { createUserProfileInput } from "../../../models";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";
import { getData } from "../../../utils/localStorage";
import { signupNextNav } from "../../../utils/signupNextNav";

const localStorageKeys = [
  "firstName",
  "lastName",
  "jobTitle",
  // "dateOfBirth",
  "gender",
  "pushNotificationToken"
];

export default function DescribeYourselfScreen({
  navigation
}: RootLoggedInScreenProps<"DescribeYourself">) {
  const [bio, setBio] = useState<string>("");
  const [profile, setProfile] = useState<createUserProfileInput>();
  useEffect(() => {
    /**
     * Loops through the local storage keys array, getting everything that was stored locally and setting it as the profile route.
     */
    const getLocalData = async () => {
      let locallyStoredProfileData = profile;
      for (let i = 0; i < localStorageKeys.length; i++) {
        const data = await getData(localStorageKeys[i]);
        if (data) {
          locallyStoredProfileData = {
            ...locallyStoredProfileData,
            [localStorageKeys[i]]: data
          };
        }
      }
      setProfile(locallyStoredProfileData);
    };
    getLocalData();
  }, []);

  const changeBio = (val: string) => {
    setBio(val);
    setProfile({ ...profile, bio: bio });
  };

  const { refetch } = useSignupProgress({
    onSuccess: data => {
      console.log("hello", data);
      if (
        data?.progress.phoneVerified == true &&
        data?.progress.profileCompleted == true &&
        data?.progress.profileImagesUploaded == true
      ) {
        navigation.navigate("HomeDrawer");
      }
    },
    enabled: false
  });

  const createProfileMutation = useMutation(
    MutationKeys.PROFILE,
    (props: createUserProfileInput) =>
      goFetchLite("users/me/profile", {
        method: "POST",
        body: props
      }),
    {
      onMutate: variables => {
        console.log("profile here", variables);
      },
      onSuccess: () => {
        refetch();
        signupNextNav({
          navigation: navigation,
          routeName: route.name
        });
      },
      onError: (error: any) =>
        Toast.show({
          type: "error",
          text1: "Failed to create profile",
          text2: error?.response?.data?.message
        })
    }
  );

  const route = useRoute();
  const onPress = async () => {
    if (profile) {
      await createProfileMutation.mutateAsync(profile);
    }
    return false;
  };
  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          How would you describe yourself?
        </Text>
      </SafeAreaView>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        style={styles.container}
        contentContainerStyle={{ alignItems: "center" }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.separator} />
        <Text preset="b" style={{ textAlign: "center", width: "60%" }}>
          Enter a brief bio about you, 150 characters max
        </Text>
        <View style={styles.separator} />
        <View style={styles.textBox}>
          <Text
            style={{
              alignSelf: "flex-end",
              fontSize: 14,
              paddingTop: 8,
              color: colors.greyText
            }}
          >{`${bio.length}/150`}</Text>
          <TextInput
            style={{
              width: "100%",
              height: 140,
              textAlignVertical: "top",
              paddingLeft: 0,
              paddingRight: 0
            }}
            placeholder="Start typing your bio"
            maxLength={150}
            multiline={true}
            value={bio}
            returnKeyType="default"
            onChangeText={changeBio}
          />
        </View>
        <View style={styles.separator} />
        <ContinueButton
          disabled={typeof bio == "string" && bio?.length < 5}
          onPress={onPress}
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
  textBox: {
    backgroundColor: colors.background,
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 10,
    borderRadius: 8
  }
});
