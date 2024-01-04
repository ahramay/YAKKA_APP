import { Image, ImageBackground, StyleSheet, View } from "react-native";
import { useSetRecoilState } from "recoil";
import { Button } from "../../components";
import { colors } from "../../constants";
import { ShadowStyle } from "../../constants/CommonStyles";
import { RootLoggedOutStackProps } from "../../navigation/navigation.props";
import { landingScreenAtom } from "../../recoil/landingScreenAtom";
const YakkaLogo = require("../../../assets/images/Title.png");

export default function LandingScreen({
  navigation
}: RootLoggedOutStackProps<"Landing">) {
  const setLandingScreenSeen = useSetRecoilState(landingScreenAtom);
  const screenImg = require("../../../assets/images/HomeImage.png");
  return (
    <ImageBackground style={{ flex: 1 }} resizeMode="cover" source={screenImg}>
      <View style={styles.container}>
        <Image
          source={YakkaLogo}
          resizeMode="contain"
          style={{ width: "80%", height: 150, position: "absolute", top: 150 }}
        />
        <Button
          style={[ShadowStyle, { top: 40, backgroundColor: colors.greenYakka }]}
          text="Start Connecting"
          textWeight="300"
          textStyle={{ color: colors.background, fontSize: 20 }}
          onPress={() => {
            setLandingScreenSeen(true);
            navigation.navigate("SigninSignupTabs");
          }}
        />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    paddingHorizontal: 15,
    zIndex: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.landingScreenTint
    // opacity: 0.48,
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
