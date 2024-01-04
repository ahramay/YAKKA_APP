import { Contact } from "expo-contacts";
import React, { useState } from "react";
import {
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrayKeys } from "zod";
import { colors } from "../../../constants";
import {
  BasicProfile,
  findYakkaContactsResponse,
  UserStatus
} from "../../../types/types";
import { Text } from "../../defaults";
import { Checkbox } from "../../generics/Checkbox";
import { SearchBox } from "../../generics/SearchBox";

type ContactListType = {
  contacts: findYakkaContactsResponse["yakkaContacts"];
  chosenContacts: findYakkaContactsResponse["yakkaContacts"];
  setChosenContacts: (
    contacts: findYakkaContactsResponse["yakkaContacts"]
  ) => void;
};
const contactsAlphebetSort = (
  contacts: findYakkaContactsResponse["yakkaContacts"]
) => {
  return contacts.sort((a, b) =>
    a.firstName.toLowerCase() > b.firstName.toLowerCase()
      ? 1
      : b.firstName.toLowerCase() > a.firstName.toLowerCase()
      ? -1
      : 0
  );
};

export const YakkaContactsList = ({
  chosenContacts,
  setChosenContacts,
  contacts: entireContacts
}: ContactListType) => {
  const sortedContacts = contactsAlphebetSort(entireContacts);
  const [contacts, setContacts] =
    useState<findYakkaContactsResponse["yakkaContacts"]>(sortedContacts);
  const [contactsCopy, setContactsCopy] =
    useState<findYakkaContactsResponse["yakkaContacts"]>(sortedContacts);

  const RenderItem = ({
    item,
    index
  }: ListRenderItemInfo<{
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    status: UserStatus;
    isVerified: boolean;
    phoneNumber: string;
    countryCode: string;
  }>) => {
    return (
      <View style={{ flexDirection: "row", width: "100%" }}>
        <Checkbox
          variant="circle"
          onPress={isChecked => {
            if (!isChecked) {
              const reducedContacts = chosenContacts.filter(
                val => val.id !== item.id
              );
              setChosenContacts(reducedContacts);
            } else {
              setChosenContacts([...chosenContacts, item]);
            }
          }}
        />
        {item.image ? (
          <Image source={{ uri: item.image }} style={styles.circle} />
        ) : (
          <View style={styles.circle}>
            <Text size="sm" weight="500" style={{ color: colors.background }}>
              {item.firstName.toString().charAt(0)}
            </Text>
          </View>
        )}
        <Text>
          {item.firstName.toString()} {item.lastName.toString()}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.whiteContainer}>
      <SearchBox
        listCopy={contactsCopy}
        setList={setContacts}
        textProp={"firstName"}
        style={styles.textInput}
      />
      <FlatList
        showsVerticalScrollIndicator={false}
        data={contacts}
        renderItem={RenderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
        ListEmptyComponent={
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              paddingTop: 40
            }}
          >
            <Text
              style={{
                textAlign: "center",
                width: 200
              }}
              color={colors.dim}
            >
              Looks like you're the first of your contacts on Yakka!
            </Text>
          </View>
        }
        style={{ width: "100%" }}
      />
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  whiteContainer: {
    paddingHorizontal: 15,
    backgroundColor: colors.background,
    flex: 1,
    borderRadius: 8,
    justifyContent: "flex-start",
    alignItems: "center"
  },
  container: {
    paddingBottom: 15,
    flex: 1,
    paddingHorizontal: 15
  },
  textInput: { top: -20, backgroundColor: colors.lightGreyBorder },
  circle: {
    borderWidth: 1,
    borderColor: colors.lightGreyBorder,
    justifyContent: "center",
    alignItems: "center",
    height: 25,
    width: 25,
    borderRadius: 100,
    backgroundColor: colors.black,
    marginRight: 15
  }
});
