import { Contact } from "expo-contacts";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ListRenderItemInfo,
  StyleSheet,
  View
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../../constants";
import { Text } from "../../defaults";
import { Checkbox } from "../../generics/Checkbox";
import { SearchBox } from "../../generics/SearchBox";

type ContactListType = {
  contacts: readonly Contact[];
  chosenContacts: Contact[];
  setChosenContacts: (contacts: Contact[]) => void;
  loading?: boolean;
  filterDuplicates?: boolean;
  singleContactSelect?: boolean;
};

const contactsAlphebetSort = (contacts: Contact[]) => {
  return contacts.sort((a, b) =>
    a.name.toLowerCase() > b.name.toLowerCase()
      ? 1
      : b.name.toLowerCase() > a.name.toLowerCase()
      ? -1
      : 0
  );
};

export const ContactsList = ({
  chosenContacts,
  setChosenContacts,
  contacts: entireContacts,
  filterDuplicates,
  loading = false,
  singleContactSelect = false
}: ContactListType) => {
  const peopleFilter = filterDuplicates
    ? [...new Map(entireContacts.map(item => [item.id, item])).values()]
    : contactsAlphebetSort(
        entireContacts.filter(val => {
          return (
            val.contactType === "person" &&
            val.name?.length > 0 &&
            val.phoneNumbers
              ?.flat()
              .some(val => val.number && val.number?.length > 8)
          );
        })
      );
  const [contacts, setContacts] = useState<Contact[]>(peopleFilter);
  const [contactsCopy, setContactsCopy] = useState<Contact[]>(peopleFilter);
  useEffect(() => {
    setContacts(peopleFilter);
    setContactsCopy(peopleFilter);
  }, [entireContacts]);

  const RenderItem = ({ item, index }: ListRenderItemInfo<Contact>) => {
    // console.log("item here", item);
    return (
      <View style={{ flexDirection: "row", width: "100%" }}>
        <Checkbox
          variant="circle"
          noneChecked={singleContactSelect}
          isChecked={
            singleContactSelect
              ? chosenContacts[0] && item.id === chosenContacts[0].id
              : undefined
          }
          onPress={isChecked => {
            if (
              !isChecked
              // Array.isArray(chosenContacts) &&
              // chosenContacts.some(val => val.id === item.id)
            ) {
              const reducedContacts = chosenContacts.filter(
                val => val.id !== item.id
              );
              singleContactSelect
                ? setChosenContacts([])
                : setChosenContacts(reducedContacts);
            } else {
              singleContactSelect
                ? setChosenContacts([item])
                : setChosenContacts([...chosenContacts, item]);
            }
          }}
        />
        {item.imageAvailable && item.image ? (
          <Image source={{ uri: item.image.uri }} style={styles.circle} />
        ) : (
          <View style={styles.circle}>
            <Text size="sm" weight="500" style={{ color: colors.background }}>
              {item.name?.toString().charAt(0)}
            </Text>
          </View>
        )}
        <Text>{item.name?.toString()}</Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.whiteContainer}>
      <SearchBox
        listCopy={contactsCopy}
        setList={setContacts}
        textProp={"name"}
        style={styles.textInput}
      />
      {loading ? (
        <View className="flex-1 items-center pt-20">
          <ActivityIndicator size={30} color={colors.svgUserGrey} />
        </View>
      ) : (
        <FlatList
          showsVerticalScrollIndicator={false}
          data={contacts}
          renderItem={RenderItem}
          contentContainerStyle={{ paddingBottom: 20 }}
          ItemSeparatorComponent={() => <View style={{ height: 5 }} />}
          style={{ width: "100%" }}
        />
      )}
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
