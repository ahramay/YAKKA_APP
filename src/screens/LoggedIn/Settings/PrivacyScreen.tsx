import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { WebView } from "react-native-webview";

export default function PrivacyScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"Privacy">) {
  return (
    <WebView
      style={{ marginTop: -20 }}
      source={{ uri: "https://www.yakkaworld.com/privacy-policy" }}
    />
  );
}
