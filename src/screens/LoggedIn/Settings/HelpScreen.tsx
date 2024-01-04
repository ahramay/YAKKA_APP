import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { WebView } from "react-native-webview";

export default function HelpScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"Help">) {
  return <WebView source={{ uri: "https://www.yakkaworld.com/contact-us/" }} />;
}
