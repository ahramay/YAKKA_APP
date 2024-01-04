import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput as DefaultTextInput,
  View
} from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Text, TextInput } from "../../../components";
import { BottomModal } from "../../../components/defaults/BottomSheetModal";
import { sizeObj } from "../../../components/defaults/Text/Text.presets";
import { SelectHashtags } from "../../../components/specifics/SelectHashtags";
import GenderPicker from "../../../components/specifics/GenderPicker";
import { InterestList } from "../../../components/specifics/Interests/InterestList";
import JobSearch from "../../../components/specifics/JobSearch";
import { colors } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import { useHashtagsMutation } from "../../../hooks/ReactQuery/useHashtagsMutation";
import { useInterestsMutation } from "../../../hooks/ReactQuery/useInterestsMutation";
import { useMyProfile } from "../../../hooks/ReactQuery/useMyProfile";
import { createUserProfileInput, interestSchema } from "../../../models";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { goFetchLite } from "../../../utils/goFetchLite";

interface ParentInfo {
  item: interestSchema;
  isChecked: boolean;
  parentInfo?: ParentInfo;
}

export default function EditProfileScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"EditProfile">) {
  //Different modals
  const [genderModalVisible, setGenderModalVisible] = useState<boolean>(false);

  const profile = useMyProfile();
  const [interestsModalVisible, setInterestsModalVisible] =
    useState<boolean>(false);
  const [hashtagsModalVisible, setHashtagsModalVisible] =
    useState<boolean>(false);

  const profileMutation = useMutation(
    MutationKeys.PROFILE,
    (props: {
      fieldName: keyof createUserProfileInput;
      string: string;
      stringFieldName?: string;
    }) =>
      goFetchLite(`users/me/profile`, {
        method: "PATCH",
        body: { [props.fieldName]: props.string }
      }),
    {
      onSuccess: (data, variables) => {
        profile.refetch();
        //@ts-ignore
        Toast.show({
          text1: `Successfully updated ${
            variables.stringFieldName || variables.fieldName
          }`
        });
      }
    }
  );

  const { data } = useMyProfile();

  //Traits  to the user
  const bioRef = useRef<DefaultTextInput>(null);
  const [gender, setGender] = useState<string>(data?.gender || "");
  const [jobTitle, setJobTitle] = useState<string>(data?.jobTitle || "");
  const [chosenInterests, setChosenInterests] = useState<number[]>(
    data?.interests.map(val => val.id) || []
  );
  const [bio, setBio] = useState<string>(data?.bio || "");
  const [hashtags, setHashtags] = useState<string[]>(
    data?.hashtags.map(val => val.name) || []
  );

  useEffect(() => {
    console.log(hashtags);
  }, [hashtags]);
  useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
        bioRef.current?.blur();
        // Prompt the user before leaving the screen
      }),
    [navigation]
  );

  //Entire list of interests in API

  useEffect(() => {
    console.log("chosen interests here", chosenInterests);
  }, [chosenInterests]);

  //prettier-ignore
  const [activeComponent, setActiveComponent] = useState<"gender" | "interests" | "hashtags"|"jobs">();

  //Puts interests in a string spaced with commas for the text box

  const updateHashtags = useHashtagsMutation({
    newHashtags: hashtags,
    originalHashtags: data?.hashtags || []
  });

  const updateInterests = useInterestsMutation({
    newInterests: chosenInterests,
    originalInterests: data?.interests.map(val => val.id) || []
  });

  return (
    <ScrollView
      style={{
        height: "100%",
        marginTop: -32,
        paddingHorizontal: 24,
        backgroundColor: colors.background
      }}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      <KeyboardAvoidingView
        style={{
          backgroundColor: colors.background,
          flexDirection: "column-reverse"
        }}
        // behavior={Platform.OS === "ios" ? "padding" : "position"}
        keyboardVerticalOffset={-100}
      >
        <Text
          style={styles.multilineInput}
          onPress={() => {
            setHashtagsModalVisible(true);
            setActiveComponent("hashtags");
          }}
        >
          {hashtags.map(val => `#${val}`).join(", ")}
        </Text>
        <Text className="mt-4 mb-2">Hashtags </Text>

        <Pressable
          onPress={() => {
            setInterestsModalVisible(true);
            setActiveComponent("interests");
          }}
        >
          <Text style={styles.multilineInput} color={colors.dim}>
            {data && data.interests.map(val => val.name).join(", ")}
          </Text>
        </Pressable>
        <Text className="mt-4 mb-2">My Interests</Text>

        <TextInput
          multiline={true}
          value={bio}
          onChangeText={setBio}
          innerRef={bioRef}
          style={[styles.multilineInput]}
          onEndEditing={() => {
            profileMutation.mutate({ fieldName: "bio", string: bio });
          }}
        />
        <Text className="mt-4 mb-2">My Bio</Text>
        <JobSearch
          jobTitle={jobTitle}
          setJobTitle={setJobTitle}
          onBlur={() =>
            profileMutation.mutate({
              fieldName: "jobTitle",
              stringFieldName: "job title",
              string: jobTitle
            })
          }
          onSelectItem={item =>
            profileMutation.mutate({
              fieldName: "jobTitle",
              stringFieldName: "job title",
              string: item.title
            })
          }
          options={{
            textInputProps: {
              allowFontScaling: false,
              style: {
                paddingHorizontal: 0,
                color: colors.dim,
                fontSize: sizeObj["md"]
              }
            }
          }}
        />
        <Text className="mt-4 mb-2">Occupation</Text>
        <Pressable
          style={styles.popupInput}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          className="flex-row items-center"
          onPress={() => {
            setGenderModalVisible(true);
            setActiveComponent("gender");
          }}
        >
          <TextInput
            editable={false}
            value={gender}
            textColor={colors.dim}
            className="flex-1 px-0"
          />
          <Ionicons name="chevron-down" size={22} />
        </Pressable>

        <Text className="mt-4 mb-2">Identifying As</Text>
        <View className="h-16" />
        <BottomModal
          isVisible={genderModalVisible}
          setIsVisible={setGenderModalVisible}
          onDismiss={() =>
            profileMutation.mutate({ fieldName: "gender", string: gender })
          }
        >
          <GenderPicker gender={gender} setGender={setGender} />
        </BottomModal>
        <BottomModal
          snapPoints={["70%", "80%"]}
          isVisible={interestsModalVisible}
          setIsVisible={setInterestsModalVisible}
          onDismiss={updateInterests}
        >
          <InterestList
            chosenInterests={chosenInterests}
            setChosenInterests={setChosenInterests}
          />
        </BottomModal>
        <BottomModal
          snapPoints={["70%", "80%"]}
          isVisible={hashtagsModalVisible}
          setIsVisible={setHashtagsModalVisible}
          onDismiss={updateHashtags}
        >
          <SelectHashtags
            chosenHashtags={hashtags}
            setChosenHashtags={setHashtags}
          />
        </BottomModal>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    color: colors.dim,
    paddingHorizontal: 0
  },

  popupInput: {
    borderBottomWidth: 1,
    paddingHorizontal: 0,
    color: colors.dim
  },
  multilineInput: {
    textAlignVertical: "top",
    paddingVertical: 8,
    paddingHorizontal: 12,
    color: colors.dim,
    borderWidth: 1,
    borderRadius: 0,
    minHeight: 70
  },
  multilinePopupInput: {
    textAlignVertical: "top",
    color: colors.dim,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 0,
    minHeight: 70
  }
});
