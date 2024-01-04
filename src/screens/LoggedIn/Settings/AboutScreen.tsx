import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { WebView } from "react-native-webview";
import { ScrollView } from "react-native";

export default function AboutScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"About">) {
  return (
    <ScrollView
      style={{ marginTop: -220 }}
      contentContainerStyle={{ height: "100%" }}
    >
      <WebView
        scrollEnabled={false}
        source={{ uri: "https://www.yakkaworld.com/about-us/" }}
      />
    </ScrollView>
  );
}
