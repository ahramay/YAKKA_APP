import { RootLoggedInScreenProps } from "../../../navigation/navigation.props";
import { WebView } from "react-native-webview";

export default function SecurityScreen({
  navigation,
  route
}: RootLoggedInScreenProps<"Security">) {
  return <WebView source={{ uri: "https://www.yakkaworld.com/safety" }} />;
}
