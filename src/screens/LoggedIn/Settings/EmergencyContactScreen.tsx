import { ActivityIndicator, Pressable, StyleSheet, View } from "react-native";
import React, { useEffect, useState } from "react";
import parseNumber from "libphonenumber-js";

import {
  Button,
  Text,
  TextInput,
  TextInputValidators
} from "../../../components";
import { colors } from "../../../constants";
import CountryPicker, {
  CallingCode,
  CountryCode
} from "react-native-country-picker-modal";
import { useMutation, useQuery } from "react-query";
import { QueryKeys } from "../../../constants/queryKeys";
import { goFetchLite } from "../../../utils/goFetchLite";
import useCustomToast from "../../../hooks/useCustomToast";
import { Contact } from "expo-contacts";
import { getContacts } from "../../../utils/getContacts";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { ContactsList } from "../../../components/specifics/AddContacts/ContactsList";
import { BottomModal } from "../../../components/defaults/BottomSheetModal";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import CurvedModal from "../../../components/generics/CurvedModal";
import { AreYouSure } from "../../../components/specifics/User/UserActions/AreYouSure";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";
import {
  sizeObj,
  weightObj
} from "../../../components/defaults/Text/Text.presets";
import { presets } from "../../../components/defaults/TextInput/TextInput.presets";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";

interface emergencyContactInput {
  name: string;
  phoneNumber: string;
  phoneCountryCode: string;
  countryCode: string;
}
export default function EmergencyContactScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"EmergencyContact">) {
  const [chosenContact, setChosenContact] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [numberModalVisible, setNumberModalVisible] = useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);

  const [showEmergencyContact, setShowEmergencyContact] =
    useState<boolean>(false);

  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [countryCode, setCountryCode] = useState<string>("GB");
  const [callingCode, setCallingCode] = useState<string>("44");
  const { errorToast, toast } = useCustomToast();

  const {
    data: emergencyContactData,
    isLoading,
    isError,
    refetch
  } = useQuery<{
    id: number;
    name: string;
    phoneNumber: string;
    phoneCountryCode: string;
  }>(
    QueryKeys.GET_EMERGENCY_CONTACT,
    () =>
      goFetchLite("users/me/emergencyContact", {
        method: "GET"
      }),
    {
      onSuccess: data => {
        setName(data.name);
        setPhoneNumber(data.phoneNumber);
        setCallingCode(data.phoneCountryCode);
        // setCountryCode(data.countryCode);
      },
      retry: 0,
      onError: (error: any) => {
        // if status 404
        if (error?.request?.status !== 404) {
          // do something
          errorToast("Error fetching emergency contact");
        }
      }
    }
  );

  const bloatedNumbersArray =
    chosenContact[0] &&
    chosenContact[0].phoneNumbers &&
    chosenContact[0].phoneNumbers
      .map(
        val =>
          val?.number &&
          val?.number
            .replace(/\s/g, "")
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
      )
      .filter(
        val => val !== undefined && typeof val === "string" && val.length >= 9
      );

  const numbersArray = [...new Set(bloatedNumbersArray)];

  const contactMutation = useMutation(
    (data: emergencyContactInput) => {
      return goFetchLite("users/me/emergencyContact", {
        method: "PUT",
        body: JSON.stringify(data)
      });
    },
    {
      onSuccess: () => {
        refetch();
        setNumberModalVisible(false);
        toast("Emergency contact updated");
      }
    }
  );

  const deleteContactMutation = useMutation(
    () => {
      return goFetchLite("users/me/emergencyContact", {
        method: "DELETE"
      });
    },
    {
      onMutate: () => {
        setLoading(true);
      },
      onSuccess: () => {
        refetch();
        toast("Emergency contact deleted");
        setLoading(false);
      },
      onError: () => {
        setLoading(false);
      }
    }
  );

  const onPressInModal = async () => {
    if (numbersArray[0]) {
      await contactMutation.mutateAsync({
        name: name,
        countryCode: countryCode,
        phoneCountryCode: callingCode,
        phoneNumber: phoneNumber
      });
    }
  };
  const getAddContacts = async () => {
    setLoading(true);
    const data = await getContacts();
    if (data) {
      setContacts(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    getAddContacts();
  }, []);

  const getName = (contact: Contact) => {
    return contact && contact.firstName
      ? contact.lastName
        ? `${contact.firstName} ${contact.lastName}`
        : contact.firstName
      : "";
  };
  const setNewEmergencyContact = () => {
    const name = getName(chosenContact[0]);

    setName(name);
    if (numbersArray[0]) {
      const parsedNumber = parseNumber(numbersArray[0]);

      if (parsedNumber) {
        setPhoneNumber(parsedNumber?.nationalNumber);
        //@ts-ignore
        setCallingCode(parsedNumber?.countryCallingCode);
        //@ts-ignore
        setCountryCode(parsedNumber?.country);
      } else {
        setPhoneNumber(numbersArray[0]);
      }
    }
  };
  const onPress = () => {
    if (numbersArray[0]) {
      setNewEmergencyContact();
      setNumberModalVisible(true);
    }
  };
  const onPressEllipse = () => {
    if (emergencyContactData) {
      setPhoneNumber(emergencyContactData?.phoneNumber);
      setCallingCode(emergencyContactData?.phoneCountryCode);
      setName(emergencyContactData?.name);
      setNumberModalVisible(true);
    }
  };
  useEffect(() => {
    setNewEmergencyContact();
  }, [chosenContact]);

  return (
    <>
      {loading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size={25} color={colors.greenYakka} />
        </View>
      ) : (
        <View className="flex-1 h-full py-4 px-4">
          {!isError && emergencyContactData && (
            <>
              <View className="flex-row bg-white p-3 rounded-lg">
                <View className="flex-1 gap-y-3">
                  <Text>{emergencyContactData?.name}</Text>
                  <View className="flex-row">
                    <Text>+{emergencyContactData?.phoneCountryCode}</Text>
                    <Text>{emergencyContactData?.phoneNumber}</Text>
                  </View>
                </View>
                <TouchableOpacity onPress={onPressEllipse}>
                  <Ionicons
                    name="ellipsis-horizontal"
                    size={24}
                    color={colors.dim}
                    style={{ marginRight: 16 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setDeleteModalVisible(true);
                  }}
                >
                  <Ionicons name="close" size={24} color={colors.dim} />
                </TouchableOpacity>
              </View>
              <View style={{ height: 20 }} />
            </>
          )}
          {!loading && (
            <ContactsList
              chosenContacts={chosenContact}
              setChosenContacts={setChosenContact}
              singleContactSelect
              contacts={contacts}
            />
          )}
          <Button
            style={{ marginVertical: 20 }}
            text={
              isError ? "Add as emergency contact" : "Set new emergency contact"
            }
            preset="wide"
            disabled={chosenContact[0] === undefined}
            onPress={onPress}
          />
          <BottomModal
            snapPoints={["50%", "60%"]}
            isVisible={numberModalVisible}
            android_keyboardInputMode="adjustResize"
            setIsVisible={setNumberModalVisible}
          >
            <>
              {contactMutation.isLoading ? (
                <View className="flex-1 justify-center items-center">
                  <ActivityIndicator size={25} color={colors.greenYakka} />
                </View>
              ) : (
                <>
                  <Text style={{ alignSelf: "center" }} preset="strong">
                    Emergency Contact
                  </Text>
                  <View className="mt-2">
                    <Text weight="500" className="mt-4 mb-2">
                      Name
                    </Text>
                    <BottomSheetTextInput
                      style={[
                        styles.input,
                        presets.base,
                        {
                          paddingHorizontal: 12,
                          borderRadius: 8,
                          backgroundColor: colors.background
                        }
                      ]}
                      value={name}
                      onChangeText={setName}
                    />
                  </View>
                  <View>
                    <Text weight="500" className="mt-4 mb-2">
                      Phone Number
                    </Text>
                    <View style={[{ flexDirection: "row" }, styles.input]}>
                      <Pressable style={styles.callingCode}>
                        <CountryPicker
                          //@ts-ignore
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
                      <BottomSheetTextInput
                        style={[
                          presets.base && {
                            width: "auto",
                            flex: 1,
                            paddingHorizontal: 12,
                            borderRadius: 8,
                            backgroundColor: colors.background
                          }
                        ]}
                        placeholder="e.g. 07118118118"
                        maxLength={12}
                        keyboardType="phone-pad"
                        value={phoneNumber}
                        onChangeText={setPhoneNumber}
                      />
                    </View>
                    <Button
                      style={{ marginVertical: 20 }}
                      text="Confirm emergency contact details"
                      preset="wide"
                      disabled={
                        (name && !TextInputValidators.nameValidator(name)) ||
                        !TextInputValidators.phoneValidator(phoneNumber)
                      }
                      onPress={onPressInModal}
                    />
                  </View>
                </>
              )}
            </>
          </BottomModal>
          <CurvedModal
            title="Delete Emergency Contact"
            isOpen={deleteModalVisible}
            setIsOpen={setDeleteModalVisible}
          >
            <AreYouSure
              submitText="Delete"
              content="Are you sure you want to delete your emergency contact?"
              onPressCancel={() => setDeleteModalVisible(false)}
              onPressSubmit={() => {
                setDeleteModalVisible(false);
                deleteContactMutation.mutate();
              }}
            />
          </CurvedModal>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  callingCode: {
    height: 40,
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    textAlign: "left",
    paddingHorizontal: 10,
    backgroundColor: colors.background,
    borderRadius: 8
  },
  input: {
    flexDirection: "row"
  }
});
