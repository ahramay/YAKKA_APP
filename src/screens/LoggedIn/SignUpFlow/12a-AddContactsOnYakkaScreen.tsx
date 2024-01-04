import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMutation } from "react-query";
import { Button, Text } from "../../../components";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { YakkaContactsList } from "../../../components/specifics/AddContacts/YakkaContactsList";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { MutationKeys } from "../../../constants/queryKeys";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import {
  findYakkaContactsResponse,
  YakkaContactsInput
} from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
interface contacts {
  contactType: "person" | "organization";
  firstName: "Leah";
  id: number;
  imageAvailable: boolean;
  lookupKey: string;
  name: string;
  phoneNumbers: {
    id: string;
    isPrimary: number;
    label: string;
    number: string;
    type: string;
  };
}

export default function AddContactsOnYakkaScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"AddContactsOnYakka">) {
  const { contactsData } = route.params;
  const [chosenContacts, setChosenContacts] = useState<
    findYakkaContactsResponse["yakkaContacts"]
  >([]);

  //Takes the chosen contacts and returns them as a list of numbers
  //See what numbers are sent off, will send off multiple numbers of the same format depending on how phone has stored it
  const inviteMutation = useMutation(
    MutationKeys.INVITE_TO_YAKKA,
    (contactNumbers: YakkaContactsInput) =>
      goFetchLite(`users/contacts/invite`, {
        method: "POST",
        body: contactNumbers
      }),
    {
      onSuccess: () => {
        console.log("sent da request");
      },
      onError: error => console.log(error)
    }
  );

  const sendFriendRequests = async () => {
    const contactNumbers = chosenContacts.map(val => {
      return { phoneNumber: val.phoneNumber, countryCode: val.countryCode };
    });
    await inviteMutation.mutateAsync({ contacts: contactNumbers, skip: false });
  };

  const onPressNext = () => {
    sendFriendRequests();
    navigation.navigate("AddContactsToYakka", { contactsData });
  };

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.container}>
        <View style={{ flexDirection: "row", paddingVertical: 15 }}>
          <SmartBackButton />
          <View style={{ flex: 1 }} />
          <Button preset="link" text="Next" onPress={onPressNext} />
        </View>
        <Text preset="title">Connect with your friends</Text>
        <View style={styles.separator} />
        <View style={styles.separator} />
        <Text preset="b" style={{ textAlign: "center" }}>
          Add other YAKKAs you know as friends.
        </Text>
        <View style={styles.separator} />
        <View style={styles.separator} />
        <YakkaContactsList
          contacts={contactsData.yakkaContacts}
          setChosenContacts={setChosenContacts}
          chosenContacts={chosenContacts}
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
