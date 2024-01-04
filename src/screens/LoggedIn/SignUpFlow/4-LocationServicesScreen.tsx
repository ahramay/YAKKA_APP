import { useRoute } from "@react-navigation/native";
import * as Location from "expo-location";
import { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { Toast } from "react-native-toast-message/lib/src/Toast";
import { Button, Text } from "../../../components";
import { ContinueButton } from "../../../components/generics/ContinueButton";
import { SmartBackButton } from "../../../components/generics/SmartBackButton";
import { MottledGreenBackground } from "../../../components/specifics/LoggedOut/MottledGreenBackground";
import { colors } from "../../../constants";
import useLocation from "../../../hooks/useLocation";
import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { storeData } from "../../../utils/localStorage";
import { signupNextNav } from "../../../utils/signupNextNav";

export default function LocationServicesScreen({
  navigation
}: RootLoggedInScreenProps<"LocationServices">) {
  const [location, setLocation] = useState<Location.LocationObject>();

  const { getLocation, isLoading } = useLocation();

  const route = useRoute();
  const allowServicesGetCoords = async () => {
    const location = await getLocation();
    if (location) setLocation(location);
    Toast.show({ text1: "Location services allowed" });
    return true;
  };

  useEffect(() => {
    const lat = location?.coords.latitude;
    const long = location?.coords.longitude;
    if (lat && long) {
      storeData("latitude", lat.toString());
      storeData("longitude", long.toString());
    }
  }, [location]);
  return (
    <MottledGreenBackground>
      <SafeAreaView
        style={{
          flex: 1,
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <View style={[styles.container, { height: 200 }]}>
          <SmartBackButton style={{ alignSelf: "flex-start" }} dumb logout />
          <Text preset="title" style={{ alignSelf: "center" }}>
            Set your location services
          </Text>
          <Text size="lg" style={{ textAlign: "center" }}>
            We use your location to show you potential YAKKAs in your area
          </Text>
        </View>
        {isLoading ? (
          <ActivityIndicator size={30} color={colors.black} />
        ) : (
          <>
            <Svg width={79.815} height={113.071} viewBox="0 0 79.815 113.071">
              <Path
                d="M778.385 1491.051a39.907 39.907 0 00-39.908 39.911c0 33.419 39.908 73.159 39.908 73.159s39.907-42.315 39.907-73.159a39.908 39.908 0 00-39.907-39.911zm0 70.821a30.018 30.018 0 1130.017-30.017 30.019 30.019 0 01-30.017 30.017z"
                transform="translate(-738.477 -1491.051)"
                fill="#fff"
              />
            </Svg>
            <View
              style={{
                height: 100,
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <ContinueButton
                signupNavigation={navigation}
                onPress={allowServicesGetCoords}
                text="Set Location Services"
                noArrow
              />
              <Button
                preset="link"
                text="Not Now"
                textWeight="500"
                style={{ height: 30, paddingTop: 10 }}
                onPress={() =>
                  signupNextNav({
                    routeName: route.name,
                    navigation: navigation
                  })
                }
              />
            </View>
          </>
        )}
        <View style={{ height: "10%" }} />
      </SafeAreaView>
    </MottledGreenBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingHorizontal: 15,
    justifyContent: "space-between",
    alignItems: "center"
  },
  title: {
    fontSize: 20,
    fontWeight: "bold"
  },
  modalText: {
    flex: 1,
    textAlign: "center",
    textAlignVertical: "center"
  },
  separator: {
    height: 10,
    width: "80%"
  }
});
