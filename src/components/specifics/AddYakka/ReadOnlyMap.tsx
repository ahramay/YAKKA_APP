import { useActionSheet } from "@expo/react-native-action-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import React, { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Touchable,
  View,
  TouchableOpacity,
  Platform,
  Linking
} from "react-native";
import MapView, { PROVIDER_GOOGLE, Marker } from "react-native-maps";
import { colors } from "../../../constants";
import useLocation from "../../../hooks/useLocation";
import { Button, Text } from "../../defaults";

type Location = {
  latitude: number;
  longitude: number;
  name?: string;
};

export default function ReadOnlyMap(props: {
  location: Location;
  closeMap: () => void;
}) {
  const { location, closeMap } = props;
  const initialRegion = {
    longitude: location?.longitude,
    latitude: location?.latitude,
    longitudeDelta: 0.04,
    latitudeDelta: 0.05
  };

  const handleGetDirections = async () => {
    // Checking if the link is supported for links with custom URL scheme.

    // Open coordinates in google / apple maps

    const scheme = Platform.select({
      ios: "maps:0,0?q=",
      android: "geo:0,0?q="
    });
    const latLong = `${location.latitude},${location.longitude}`;
    const label = location.name;
    const url = Platform.select({
      ios: `${scheme}${label}@${latLong}`,
      android: `${scheme}${latLong}(${label})`
    });
    url && Linking.openURL(url);
  };

  return (
    <View className="absolute inset-0 h-screen w-screen">
      <MapView
        initialRegion={initialRegion}
        showsUserLocation={true}
        rotateEnabled={false}
        provider={PROVIDER_GOOGLE}
        className="absolute inset-0 flex-1"
      >
        <Marker
          onPress={handleGetDirections}
          coordinate={location}
          title={"Directions to YAKKA"}
        >
          <Ionicons name="location" size={38} color={colors.greenYakka} />
        </Marker>
      </MapView>
    </View>
  );
}
