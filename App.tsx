import { ActionSheetProvider } from "@expo/react-native-action-sheet";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import * as NavigationBar from "expo-navigation-bar";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useEffect } from "react";
import { AppState, AppStateStatus, LogBox, Platform } from "react-native";
import "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { focusManager, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import RecoilNexus from "recoil-nexus";
import { colors } from "./src/constants";
import { useCachedResources, useGoogleFonts } from "./src/hooks";
import Navigation from "./src/navigation";
import { queryClient } from "./src/reactQuery/queryClient";
import toastConfig from "./src/utils/toastConfig";
import * as Notifications from "expo-notifications";
import useNotifications from "./src/hooks/usePushNotifications";
// import * as Sentry from 'sentry-expo';

// Sentry.init({
//   dsn: 'YOUR DSN HERE',
//   enableInExpoDevelopment: true,
//   debug: true, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
// });

SplashScreen.preventAutoHideAsync();

export default function App() {
  LogBox.ignoreLogs([
    "Error: Sound object not loaded. Did you unload it using Audio.unloadAsync?"
  ]);

  const cachedResourceLoaded = useCachedResources();
  const fontsLoaded = useGoogleFonts();
  // const [loggedIn, setLoggedIn] = useState(false);
  if (Platform.OS === "android") {
    NavigationBar.setBackgroundColorAsync(colors.greenYakka);
  }

  // Refect React Queries on app refocus
  function onAppStateChange(status: AppStateStatus) {
    focusManager.setFocused(status === "active");
  }

  useEffect(() => {
    const subscription = AppState.addEventListener("change", onAppStateChange);

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (cachedResourceLoaded && fontsLoaded) {
      //Loading functions
    }
  }, [cachedResourceLoaded, fontsLoaded]); //loggedIn

  if (!cachedResourceLoaded || !fontsLoaded) {
    // || !loggedIn
    return null;
  }
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <BottomSheetModalProvider>
          <ActionSheetProvider>
            <RecoilRoot>
              <RecoilNexus />
              <Navigation />
              <Toast config={toastConfig} />
              <StatusBar />
            </RecoilRoot>
          </ActionSheetProvider>
        </BottomSheetModalProvider>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
