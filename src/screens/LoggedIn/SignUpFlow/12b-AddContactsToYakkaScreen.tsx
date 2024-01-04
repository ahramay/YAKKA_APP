import { Contact } from "expo-contacts";
import parseNumber from "libphonenumber-js";
import { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { Button, Text } from "../../../components";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { ContactsList } from "../../../components/specifics/AddContacts/ContactsList";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import { MutationKeys } from "../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { YakkaContactsInput } from "../../../types/types";
import { getContacts } from "../../../utils/getContacts";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function AddContactsToYakkaScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"AddContactsToYakka">) {
  const { contactsData } = route.params;
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [chosenContacts, setChosenContacts] = useState<Contact[]>([]);

  //Takes the chosen  and returns them as a list of numbers

  const findMutation = useMutation(
    MutationKeys.INVITE_TO_YAKKA,
    (contactNumbers: YakkaContactsInput) =>
      goFetchLite(`users/contacts/find`, {
        method: "POST",
        body: contactNumbers
      })
  );

  const inviteMutation = useMutation(
    MutationKeys.INVITE_TO_YAKKA,
    (contactNumbers: YakkaContactsInput) =>
      goFetchLite(`users/contacts/invite`, {
        method: "POST",
        body: contactNumbers
      }),
    {
      onSuccess: (data, variables) => {
        console.log("Success sending request");
        Toast.show({
          text1: "Welcome to YAKKA!",
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
  const getNumbersList = async () => {
    const contactsList = await getContacts();
    if (contactsList) {
      const fullNumbersArray = contactsList.map(val => {
        return {
          contact: val,
          phoneNumbers:
            val.phoneNumbers &&
            val.phoneNumbers
              .map(val => val?.number)
              .filter(
                val =>
                  val !== undefined &&
                  typeof val === "string" &&
                  val.length >= 9
              )
        };
      });
      // console.log("🍩 - number list here", fullNumbersArray);
      // console.log("🍕 - nonYakkaContacts here", contactsData.nonYakkaContacts);
      const finalContacts = contactsData.nonYakkaContacts
        .flatMap(val => {
          return fullNumbersArray.filter(
            filteredVal =>
              filteredVal.phoneNumbers?.includes(`0${val.phoneNumber}`) ||
              filteredVal.phoneNumbers?.includes(
                `+${val.countryCode}${val.phoneNumber}`
              ) ||
              filteredVal.phoneNumbers?.includes(
                `+${val.countryCode}0${val.phoneNumber}`
              ) ||
              filteredVal.phoneNumbers?.includes(
                `+${val.countryCode} ${val.phoneNumber}`
              ) ||
              filteredVal.phoneNumbers?.includes(
                `+${val.countryCode} 0${val.phoneNumber}`
              )
          );
        })
        .map(val => val.contact);
      // console.log("🍔- final page here", finalContacts);
      return finalContacts;
    }
    return [];
  };
  const setContactList = async () => {
    setLoading(true);
    const contactList = await getNumbersList();
    setContacts(contactList);
    setLoading(false);
  };

  //See what numbers are sent off, will send off multiple numbers of the same format depending on how phone has stored it
  useEffect(() => {
    setContactList();
  }, []);

  const onPressDone = async () => {
    const numbersArray = chosenContacts
      ?.flatMap(val =>
        val.phoneNumbers?.map(val => {
          const parsedNumber = val.number && parseNumber(val.number);
          if (parsedNumber) {
            return {
              phoneNumber: parsedNumber.nationalNumber.toString(),
              countryCode: parsedNumber.countryCallingCode.toString()
            };
          }
        })
      )
      .filter(val => val !== undefined);

    if (numbersArray.length > 0) {
      await inviteMutation.mutateAsync({ contacts: numbersArray, skip: true });
      await findMutation.mutateAsync({ contacts: [], skip: true });
    } else {
      await inviteMutation.mutateAsync({ contacts: [], skip: true });
      await findMutation.mutateAsync({ contacts: [], skip: true });
    }
  };

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", paddingVertical: 15 }}>
          <SmartBackButton />
          <View style={{ flex: 1 }} />
          <Button preset="link" text="Done" onPress={onPressDone} />
        </View>
        <Text preset="title">Bring friends with you</Text>
        <View style={styles.separator} />
        <View style={styles.separator} />
        <Text preset="b" style={{ textAlign: "center" }}>
          Text your friends to join YAKKA too
        </Text>
        <View style={styles.separator} />
        <View style={styles.separator} />
        <ContactsList
          contacts={contacts}
          chosenContacts={chosenContacts}
          filterDuplicates={true}
          loading={loading}
          setChosenContacts={setChosenContacts}
        />
      </SafeAreaView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 15,
    flex: 1,
    paddingHorizontal: 15
  },
  separator: {
    height: 10,
    width: "80%"
  }
});
