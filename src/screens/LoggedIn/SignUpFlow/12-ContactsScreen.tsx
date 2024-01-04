import { useRoute } from "@react-navigation/native";
import parseNumber from "libphonenumber-js";
import { StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { useMutation } from "react-query";
import { Button, Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { AddContactsSVG } from "../../../svgs/AddContactsSvg";
import { YakkaContactsInput } from "../../../types/types";
import { getContacts } from "../../../utils/getContacts";
import { goFetchLite } from "../../../utils/goFetchLite";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function ContactsScreen({
  navigation
}: RootLoggedInScreenProps<"Contacts">) {
  const routeState = useRoute();

  const signup = () => {
    Toast.show({ text1: "Welcome to YAKKA!" });
    signupNextNav({
      routeName: routeState.name,
      navigation: navigation
    });
  };
  const contactMutation = useMutation(
    (input: YakkaContactsInput) => {
      return goFetchLite("users/contacts/find", {
        method: "POST",
        body: input
      });
    },
    {
      onMutate: variables => console.log("body here", { contacts: variables }),
      onSuccess: (data, variables) => {
        console.log(data);
        if (variables.skip) {
          signup();
        } else {
          navigation.navigate("AddContactsOnYakka", {
            contactsData: data
          });
        }
      },
      onError: error => console.log(error)
    }
  );

  const getAddContacts = async () => {
    const data = await getContacts();
    const numbersArray = data
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
    numbersArray &&
      contactMutation.mutate({ contacts: numbersArray, skip: false });
  };

  return (
    <MottledGreenBackground>
      <SafeAreaView style={styles.topContainer}>
        <SmartBackButton />
        <View style={styles.separator} />
        <Text preset="title" style={{ alignSelf: "center" }}>
          Add your contacts
        </Text>
        <View style={styles.separator} />
        <View style={styles.separator} />
        <Text
          preset="b"
          style={{ textAlign: "center", width: "80%", alignSelf: "center" }}
        >
          YAKKA works best when you meet up with existing friends as well as
          making new ones.
        </Text>
      </SafeAreaView>
      <View style={styles.container}>
        <AddContactsSVG />
        <ContinueButton style={{ marginTop: 30 }} onPress={getAddContacts} />
        <View style={styles.separator} />
        <Button
          preset="link"
          text="Not Now"
          textWeight="300"
          style={{ height: 30, paddingTop: 10 }}
          onPress={() => {
            contactMutation.mutate({ skip: true, contacts: [] });
          }}
        />
      </View>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    justifyContent: "center",
    alignItems: "center"
  },
  topContainer: {
    paddingBottom: 15,
    paddingHorizontal: 15
  },
  separator: {
    height: 10,
    width: "80%"
  }
});
