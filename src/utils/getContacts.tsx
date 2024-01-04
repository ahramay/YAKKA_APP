import * as Contacts from "expo-contacts";

export const getContacts = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  console.log("[🍅] - getting contacts", status);
  if (status === "granted") {
    try {
      const { data } = await Contacts.getContactsAsync({
        fields: [
          Contacts.Fields.Image,
          Contacts.Fields.PhoneNumbers,
          Contacts.Fields.Name
        ]
      });
      if (data.length > 0) {
        return data.filter(val => val.name);
      }
    } catch (error) {
      console.log("Error getting contacts", error);
    }
  }
};
