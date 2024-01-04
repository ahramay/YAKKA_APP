import { Contact } from "expo-contacts";
import parseNumber from "libphonenumber-js";
import { useEffect, useState } from "react";
import { View } from "react-native";
import Toast from "react-native-toast-message";
import { useMutation } from "react-query";
import { Button } from "../../../components";
import { ContactsList } from "../../../components/specifics/AddContacts/ContactsList";
import { MutationKeys } from "../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { YakkaContactsInput } from "../../../types/types";
import { getContacts } from "../../../utils/getContacts";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";
export default function ContactsSyncingScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"ContactsSyncing">) {
  const [chosenContacts, setChosenContacts] = useState<Contact[]>([]);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const numbersArray =
    Array.isArray(chosenContacts) &&
    chosenContacts
      .map(val => val.phoneNumbers)
      .flat()
      .map(val => val?.number)
      .filter(
        val => val !== undefined && typeof val === "string" && val.length >= 9
      );

  const getAddContacts = async () => {
    setLoading(true);
    const data = await getContacts();
    if (data) {
      setContacts(data);
    }
    setLoading(false);
  };
  const inviteMutation = useMutation(
    MutationKeys.INVITE_TO_YAKKA,
    (contactNumbers: YakkaContactsInput) =>
      goFetchLite(`users/contacts/invite`, {
        method: "POST",
        body: contactNumbers
      }),
    {
      onSuccess: (data, variables) => {
        setChosenContacts([]);
        Toast.show({
          text1: "Contacts Added to Yakka!",
          text2:
            variables.contacts.length > 0
              ? `You invited ${
                  (chosenContacts.length,
                  chosenContacts.length > 1 ? "friend" : "friends")
                } to YAKKA`
              : undefined
        });
        signupNextNav({ navigation: navigation, routeName: "Contacts" });
      },
      onError: error => console.log(error)
    }
  );

  const onPress = async () => {
    if (Array.isArray(numbersArray) && numbersArray.length > 0) {
      const formattedNumbers = numbersArray.flatMap(val => {
        if (val === undefined) return [];
        const parsed = parseNumber(val);
        if (parsed) {
          return {
            phoneNumber: parsed.nationalNumber,
            countryCode: parsed.countryCallingCode
          };
        }

        return [];
      });
      //@ts-ignore, believes it can be undefined which it cannot because of filter !== undefined is []
      const response = await inviteMutation.mutateAsync({
        contacts: formattedNumbers
      });

      if (response) {
        Toast.show({ text1: "Contacts found and added" });
      }
    }
  };
  useEffect(() => {
    getAddContacts();
  }, []);

  return (
    <View
      style={{
        flex: 1,
        height: "100%",
        paddingVertical: 15,
        paddingHorizontal: 15
      }}
    >
      {!loading && (
        <ContactsList
          chosenContacts={chosenContacts}
          setChosenContacts={setChosenContacts}
          contacts={contacts}
        />
      )}
      <Button
        style={{ marginVertical: 20 }}
        text="Add Marked Friends"
        preset="wide"
        onPress={onPress}
        disabled={chosenContacts.length < 1}
      />
    </View>
  );
}
