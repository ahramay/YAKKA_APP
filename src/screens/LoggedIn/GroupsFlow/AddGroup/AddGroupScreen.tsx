import React, { useEffect, useRef, useState } from "react";
import {
  TextInput as DefaultTextInput,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Platform,
  Image,
  Switch,
  ActivityIndicator
} from "react-native";
import Toast from "react-native-toast-message";
import { useMutation, useQuery } from "react-query";
import { Button, Text, TextInput } from "../../../../components";
import { colors } from "../../../../constants";
import { MutationKeys, QueryKeys } from "../../../../constants/queryKeys";
import { categoriesSchema, interestSchema } from "../../../../models";
import { RootLoggedInScreenProps } from "../../../../navigation/navigation.props";
import { goFetchLite } from "../../../../utils/goFetchLite";
import DatePicker from "../../../../components/defaults/DateTimePicker";
import type { Time } from "../../../../components/defaults/DateTimePicker";
import { z } from "zod";
import { BottomModal } from "../../../../components/defaults/BottomSheetModal";
import { SelectHashtags } from "../../../../components/specifics/SelectHashtags";
import * as ImagePicker from "expo-image-picker";
import axios from "axios";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Map from "../../../../components/specifics/AddYakka/Map";
import CustomDropdown from "../../../../components/generics/CustomDropDown";
import PlacesAutoComplete from "../../../../components/specifics/AddYakka/PlacesAutoComplete";
import GroupCustomDropDown from "../GroupCustomDropDown/groupCustomDropDown";
import { GroupCoverImage } from "../../../../components/specifics/ViewGroup/GroupCoverImage";
import { GroupProfileImageUploader } from "../../../../components/specifics/ViewGroup/GroupProfileImage";

export default function AddGroupScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"EditProfile">) {
  //Different modals

  const [time, setTime] = useState<Time>({
    date: new Date(new Date().getTime() + 20 * 60000),
    startTime: new Date(new Date().getTime() + 20 * 60000),
    endTime: new Date(new Date().getTime() + 40 * 60000)
  });

  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [description, setDescription] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [chosenHashtags, setChosenHashtags] = useState<string[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<number>(0);
  const [paymentUrl, setPaymentUrl] = useState<string>("");
  const [groupCoverImage, setGroupCoverImage] = useState<string | null>(null);
  const [groupProfileImage, setGroupProfileImage] = useState<string | null>(
    null
  );
  const [inputFeeWidth, setInputFeeWidth] = useState(80);
  const [isCreated, setIsCreated] = useState(false);
  const [mapOpen, setMapOpen] = useState(false);
  const [selectedCategoryOption, setSelectedCategoryOption] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedFrequencyOption, setSelectedFrequencyOption] = useState("");
  const [selectedRepeatOption, setSelectedRepeatOption] = useState("");
  const [selectedGenderOption, setSelectedGenderOption] = useState("");
  const [errors, setErrors] = useState({});

  console.log()
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    // Trigger form validation when name,
    // email, or password changes
    validateForm();
  }, [
    name,
    isPrivate,
    selectedCategoryOption,
    selectedFrequencyOption,
    selectedRepeatOption,
    selectedGenderOption,
  ]);

  const validateForm = () => {
    let errors = {};

    // Validate name field
    if (!name) {
      errors.name = "Name is required.";
    }
      if (!time) {
        errors.time = 'time Image is required.';
    }
    if (!selectedLocation) {
      errors.selectedLocation = 'Location Image is required.';
    }
    if (!selectedCategoryOption) {
      errors.selectedCategoryOption = "Category is required.";
    }
    if (!selectedFrequencyOption) {
      errors.selectedFrequencyOption = "Frequency is required.";
    }
    if (!selectedRepeatOption) {
      errors.selectedRepeatOption = "Repeat is required.";
    }
    if (!selectedGenderOption) {
      errors.selectedGenderOption = "Gender is required.";
    }

    // Set the errors and update form validity
    setErrors(errors);
    setIsFormValid(Object.keys(errors).length === 0);
  };
  let option = [];
  const optionsFrequency = ["None","Weekly", "Biweekly", "Monthly",];
  const optionsRepeat = [
    "0",
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    "10",
    "11",
    "12"
  ];
  const optionsGender = ["Man", "Women", "Non-Binary", "All"];
  const [activeComponent, setActiveComponent] = useState<
    "gender" | "interests" | "hashtags" | "jobs"
  >();

  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    name?: string;
    selectedWith: "map" | "search";
  } | null>();
  console.log("dv", selectedLocation);
  const toggleSwitch = () => setIsPrivate(previousState => !previousState);
  const createGroupMutation = useMutation(
    MutationKeys.CREATE_GROUP,
    () =>
      goFetchLite(`groups`, {
        method: "POST",
        body: {
          name,
          description,
          isPrivate,
          profileImage: groupProfileImage,
          coverImage: groupCoverImage,
          date: new Date(time.startTime.getTime()),
          endTime: new Date(time.endTime.getTime()),
          coordinates: {
            latitude: selectedLocation?.lat,
            longitude: selectedLocation?.lng
          },
          categories: selectedCategoryOption,
          locationName: selectedLocation?.name,
          frequency: selectedFrequencyOption,
          repeatFor: selectedRepeatOption,
          paymentAmount,
          groupGender: selectedGenderOption,
          paymentUrl,
          hashtags: chosenHashtags
        }
      }),
    {
      onMutate: variables => setIsCreated(true),
      onSuccess: (data, variables) => {
        console.log("grp", data);
        Toast.show({
          text1: `Successfully created group`
        });
        navigation.navigate("ViewGroup", {
          id: data.id
        });
      }
    }
  );
  const handleSubmit = () => {
    if (isFormValid) {
      createGroupMutation.mutate();
    } else {
      console.log("Form has errors. Please correct them.");
    }
  };

  const coverImageBase64 = (base64: string): void => {
    setGroupCoverImage(base64);
  };

  const profileImageBase64 = (base64: string): void => {
    setGroupProfileImage(base64);
  };
  useQuery<categoriesSchema>(
    QueryKeys.CATEGORIES,
    () =>
      goFetchLite("groups/categories", {
        method: "GET"
      }),
    {
      onSuccess: (data: any) => {
        const categoryData = data?.categories.map(
          (cat: { id: any; name: any }) => {
            return {
              id: cat.id,
              name: cat.name
            };
          }
        );
        setCategoryOptions(categoryData);
      },
      onError: (error: any) => {
        Toast.show({
          text1: `Something Went Wrong Try Again`,
          type: "error"
        });
      }
    }
  );
  console.log("cetg", categoryOptions);
  const handleFrequencyDropdownSelect = (options: string) => {
    setSelectedFrequencyOption(options);
    console.log("Frequeny", typeof options.toString());
  };

  const handlePaymentUrl = (e: string) => {
    setPaymentUrl(e);
  };
  const handleRepeatDropdownSelect = (options: string) => {
    setSelectedRepeatOption(options);
  };

  const handleGenderDropdownSelect = (option: string) => {
    setSelectedGenderOption(option);
  };

  //Traits  to the user
  const descriptionRef = useRef<DefaultTextInput>(null);
  const nameRef = useRef<DefaultTextInput>(null);

  useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
        descriptionRef.current?.blur();
        // Prompt the user before leaving the screen
      }),
    [navigation]
  );

  useEffect(
    () =>
      navigation.addListener("beforeRemove", e => {
        descriptionRef.current?.blur();
        // Prompt the user before leaving the screen
      }),
    [navigation]
  );

  const handlePaymentAmount = (e: string) => {
    console.log(Number(e.split("£ ")[1]));
    if (isNaN(Number(e.split("£ ")[1]))) return setPaymentAmount(0);
    if ([undefined, "", NaN, null].includes(e)) return setPaymentAmount(0);
    setPaymentAmount(Number(e.split("£ ")[1]));
    const newWidth = paymentAmount.toString().length * 15 + 20; // Adjust the multiplier and padding as needed
    if (paymentAmount.toString().length > 1) {
      setInputFeeWidth(newWidth);
    } else {
      setInputFeeWidth(60);
    }
  };

  const handMinusFee = (e: string) => {
    const minusAmount = Number(e.split("£ ")[1]);
    setPaymentAmount(minusAmount - 1);
  };

  const [hashtagsModalVisible, setHashtagsModalVisible] =
    useState<boolean>(false);
  console.log(selectedCategoryOption);
  return (
    <>
      {isCreated ? (
        <View
          style={[
            {
              // position:"absolute",
              backgroundColor: "transparent",
              justifyContent: "center",
              alignItems: "center"
            }
          ]}
        >
          <ActivityIndicator size={100} color={colors.greenYakka} />
        </View>
      ) : (
        <ScrollView
          style={{
            // height: "100%",
            backgroundColor: colors.background,
            paddingBottom: 20,
            marginTop: -40
          }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
        >
          {mapOpen && (
            <View className="w-screen h-screen bg-white">
              <Map
                closeMap={() => {
                  setMapOpen(false);
                }}
                onLocationSelected={location => {
                  if (location.name) {
                    setSelectedLocation({
                      ...location,
                      selectedWith: "map"
                    });
                  } else {
                    setSelectedLocation({
                      ...location,
                      name: "",
                      selectedWith: "map"
                    });
                  }
                  setMapOpen(false);
                }}
              />
            </View>
          )}
          <View style={{ backgroundColor: colors.background }}>
            <View>
              <TouchableOpacity style={{ borderBottomLeftRadius: 100 }}>
                <GroupCoverImage base64={coverImageBase64} />
              </TouchableOpacity>
              <View className="items-center">
                <GroupProfileImageUploader base64={profileImageBase64} />
              </View>
            </View>

            <KeyboardAvoidingView
              style={{
                backgroundColor: colors.background,
                flexDirection: "column-reverse",
                paddingHorizontal: 20
              }}
              keyboardVerticalOffset={-100}
            >
              <View style={styles.buttonContainer} className="mt-4 mb-2">
                <TouchableOpacity
                  style={[styles.button, { opacity: isFormValid ? 1 : 0.5 }]}
                  disabled={!isFormValid}
                  onPress={handleSubmit}
                >
                  <Text style={styles.buttonText}>Save</Text>
                  <AntDesign
                    name={"right"}
                    color={"#FFF"}
                    size={13}
                    style={styles.arrow}
                  />
                </TouchableOpacity>
              </View>

              {chosenHashtags.length > 1 && (
                <View style={{ borderWidth: 1, borderColor: "#000" }}>
                  <Text
                    onPress={() => {
                      // setModalVisible(true);
                      setActiveComponent("hashtags");
                    }}
                    style={{ paddingBottom: 4 }}
                  >
                    {chosenHashtags.map(val => `#${val}`).join("\n")}
                  </Text>
                </View>
              )}
              <BottomModal
                snapPoints={["70%", "80%"]}
                isVisible={hashtagsModalVisible}
                setIsVisible={setHashtagsModalVisible}
              ></BottomModal>

              <View style={{ borderBottomWidth: 1 }}>
                <Text className="mt-4">Hashtags </Text>
                <SelectHashtags
                  chosenHashtags={chosenHashtags}
                  placeholder="Start typing hashtag..."
                  setChosenHashtags={setChosenHashtags}
                  left={0}
                  paddingHorizontal={30}
                />
              </View>
              <View style={{ flex: 1 }}>
                <GroupCustomDropDown
                  options={optionsGender}
                  onSelect={values => handleGenderDropdownSelect(values)}
                  placeHolder={"Select Gender"}
                />
                {/* {Object.values(errors).map((errors, index) => ( 
                <Text key={index} style={styles.error}> 
                    {errors}
                </Text> 
            ))} */}
              </View>
              <View className="mt-4 mb-2">
                <Text>Gender</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <GroupCustomDropDown
                  options={optionsFrequency}
                  onSelect={values => handleFrequencyDropdownSelect(values)}
                  height={130}
                  width={"44%"}
                  placeHolder={"Frequency"}
                />
                <Text>{"  "}</Text>
                <GroupCustomDropDown
                  options={optionsRepeat}
                  onSelect={values => handleRepeatDropdownSelect(values)}
                  height={130}
                  width={"44%"}
                  placeHolder={"Repeat For"}
                />
              </View>
              <View className="mt-4 mb-2">
                <Text>Reoccurring</Text>
              </View>
              <View style={{ flex: 1 }}>
                <CustomDropdown
                  options={categoryOptions}
                  onSelect={value => setSelectedCategoryOption(value)}
                  maximumSelect={3}
                  placeHolder={"Select Categories"}
                />
              </View>

              <View className="mt-4 mb-2">
                <Text>Category</Text>
              </View>
              <View className="mt-4 mb-2">
                <Text>Payment url</Text>
                <TextInput
                  value={paymentUrl}
                  onChangeText={handlePaymentUrl}
                  placeholder={"Payment Link"}
                  style={[styles.input, { marginTop: 0 }]}
                  keyboardType="url"
                />
              </View>

              <View className="mt-4 mb-2">
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text>Fee</Text>
                  <TextInput
                    value={` ${Number(paymentAmount).toLocaleString("en-GB", {
                      style: "currency",
                      currency: "GBP"
                    })}`}
                    onChangeText={handlePaymentAmount}
                    keyboardType="numeric"
                    style={{
                      borderWidth: 1,
                      width: inputFeeWidth,
                      marginLeft: 10,
                      height: 25,
                      justifyContent:"center",
                      textAlign:"center",
                      color: "#00000080",
                      borderColor: "#00000080",
                      borderRadius: 5,
                      backgroundColor: "#F9F9F9EF"
                    }}
                  />
                  <View
                    style={{
                      backgroundColor: "#7676801F",
                      marginLeft: 5,
                      borderRadius: 5,
                      flexDirection: "row"
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        if (paymentAmount > 0) {
                          setPaymentAmount(paymentAmount - 1);
                        }
                      }}
                    >
                      <AntDesign
                        name={"minus"}
                        size={15}
                        style={{ paddingHorizontal: 15, paddingVertical: 4 }}
                        color={"#000"}
                      />
                    </TouchableOpacity>
                    <Text style={{ color: "#3C3C432E", fontSize: 14 }}>|</Text>
                    <TouchableOpacity
                      onPress={() => setPaymentAmount(paymentAmount + 1)}
                    >
                      <AntDesign
                        name={"plus"}
                        size={15}
                        style={{ paddingHorizontal: 15, paddingVertical: 4 }}
                        color={"#000"}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {!mapOpen && (
                <>
                  <PlacesAutoComplete
                    disableAutocomplete={
                      selectedLocation?.selectedWith === "map"
                    }
                    setValue={(value: string) => {
                      if (!selectedLocation) return;

                      setSelectedLocation(
                        value.length > 0
                          ? {
                              ...selectedLocation,
                              name: value
                            }
                          : null
                      );
                    }}
                    value={
                      selectedLocation?.lat
                        ? selectedLocation?.name || "Unnamed location"
                        : ""
                    }
                    onLocationChange={location => {
                      setSelectedLocation({
                        ...location,
                        selectedWith: "search"
                      });
                    }}
                  />
                  <View className="mt-4 mb-2">
                    <View style={{ flexDirection: "row" }}>
                      <Text>Location</Text>
                      <Ionicons
                        name={"location-sharp"}
                        size={20}
                        color={"#00000080"}
                        style={{ marginLeft: 10 }}
                      />
                      <TouchableOpacity onPress={() => setMapOpen(true)}>
                        <Text style={{ color: "#007AFF", marginLeft: 10 }}>
                          Locate on Map
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>
              )}

              <View className="mt-8 mb-2">
                <Text className="mb-2">Date/Time</Text>
                <DatePicker time={time} setTime={setTime} />
              </View>
              <TextInput
                multiline={true}
                value={name}
                onChangeText={setName}
                maxLength={100}
                innerRef={nameRef}
                style={[styles.input]}
                placeholder={"Business"}
              />
              {/* {errors.name && <Text style={styles.errorText}>{errors.name}</Text>} */}
              <View style={{ flexDirection: "row" }}>
                <Text className="mt-8 mb-2">
                  Group Name
                </Text>
                <View style={{ alignItems: "flex-end", flex: 1 }}>
                  <View
                    className="mt-8 mb-2 flex-row gap-x-2"
                    style={{ alignItems: "center" }}
                  >
                    <Image
                      source={require("../../../../../assets/images/private_icon.png")}
                      style={{
                        backgroundColor: "#E9E9EB",
                        width: 25,
                        height: 25,
                        borderRadius: 12.5
                      }}
                    />
                    <Text style={{ marginBottom: 5 }}>Private</Text>
                    <Switch
                      trackColor={{ false: "#767577", true: "#03C04A" }}
                      thumbColor={isPrivate ? "#03C04A" : "#f4f3f4"}
                      ios_backgroundColor="#3e3e3e"
                      onValueChange={toggleSwitch}
                      value={isPrivate}
                    />
                  </View>
                </View>
              </View>
            </KeyboardAvoidingView>
          </View>
        </ScrollView>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1,
    color: colors.dim,
    paddingHorizontal: 0,
    marginTop: -15
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
  },
  pillBox: {
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 10,
    paddingRight: 5,
    backgroundColor: colors.background
  },
  coverImage: {
    backgroundColor: "#808080",
    height: 140,
    marginTop: 0,
    borderBottomLeftRadius: 50,
    overflow: "hidden"
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20
  },
  button: {
    width: "30%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 30,
    padding: 10,
    backgroundColor: "#000"
  },
  buttonText: {
    flex: 1,
    textAlign: "center",
    color: "#FFF",
    fontWeight: "bold",
    fontSize: 20
  },
  arrow: {
    fontSize: 18,
    color: "#FFF"
  },
  error: {
    color: "red",
    fontSize: 20,
    marginBottom: 12
  }
});
