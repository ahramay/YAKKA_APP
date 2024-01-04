import {
  View,
  Text,
  Platform,
  StyleSheet,
  TouchableOpacity
} from "react-native";
import React, { useEffect, useRef } from "react";
import {
  GooglePlacesAutocomplete,
  GooglePlacesAutocompleteRef
} from "react-native-google-places-autocomplete";
import env from "../../../../env";
import { colors } from "../../../constants";
import useLocation from "../../../hooks/useLocation";
import { TextInput } from "../../defaults";
import { Ionicons } from "@expo/vector-icons";

type Props = {
  onLocationChange: (location: {
    lat: number;
    lng: number;
    name: string;
  }) => void;

  disableAutocomplete: boolean;
  value: string;
  setValue: (value: string) => void;
};

const Input = React.forwardRef(
  (
    { onLocationChange, value, setValue, disableAutocomplete }: Props,
    ref: React.Ref<GooglePlacesAutocompleteRef>
  ) => {
    const paddingRight = value ? 40 : 0;
    // If a value has been passed in, use a normal text input
    if (disableAutocomplete) {
      console.log("[😭] -auto complete disabled");
      return (
        <TextInput
          onChangeText={text => {
            setValue(text);
          }}
          value={value}
          style={[styles.input, { paddingRight }]}
        />
      );
    }
    console.log("[😁] - google places displaying");
    return (
      <GooglePlacesAutocomplete
        ref={ref}
        textInputProps={{
          allowFontScaling: false
        }}
        enablePoweredByContainer={false}
        styles={{
          textInput: [styles.input, { paddingRight }],
          predefinedPlacesDescription: {
            color: "#1faadb"
          },
          textInputContainer: {
            backgroundColor: "rgba(0,0,0,0)",
            borderTopWidth: 0,
            borderBottomWidth: 0
          },
          listView: {
            backgroundColor: "white",
            position: "absolute",
            top: 40,
            left: 0,
            right: 0,
            zIndex: 1
          },
          description: {
            fontWeight: "bold"
          },
          row: {
            padding: 13,
            minHeight: 44,
            height: "auto"
          }
        }}
        placeholder="Search"
        fetchDetails
        onTimeout={() => console.log("timed out getting google location list")}
        onFail={error =>
          console.log("failed getting google location list", error)
        }
        onNotFound={() =>
          console.log("found nothing getting google location list")
        }
        onPress={(data, details = null) => {
          // 'details' is provided when fetchDetails = true

          if (
            !details?.name ||
            !details.geometry?.location?.lat ||
            !details.geometry.location.lng
          )
            return;
          onLocationChange({
            lat: details.geometry.location.lat,
            lng: details.geometry.location.lng,
            name: details.name
          });
        }}
        query={{
          key: env.PLACES_AUTO_COMPLETE_API_KEY,
          language: "en"
        }}
      />
    );
  }
);

export default function PlacesAutoComplete(props: Props) {
  const { location } = useLocation();
  const ref = useRef<GooglePlacesAutocompleteRef>(null);
  return (
    <View className="relative ">
      <Input {...props} ref={ref} />
      {props.value && (
        <TouchableOpacity
          onPress={() => {
            props.setValue("");
            ref?.current?.clear?.();
          }}
          hitSlop={{
            top: 25,
            left: 25,
            bottom: 25,
            right: 25
          }}
          className="absolute right-1 top-[18%]"
        >
          <Ionicons name="close-circle" size={22} color={colors.red} />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 38,
    fontSize: 16,
    borderWidth: 1,
    borderColor: colors.lightGreyBorder
  }
});
