import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { View } from "react-native";
import { useInfiniteQuery } from "react-query";
import { HomeSVG } from "../../../components/generics/Icons/HomeSvg";
import { Safety } from "../../../components/generics/Icons/Safety";
import { YakkaUser } from "../../../components/generics/Icons/YakkaUser";
import GreenHeader from "../../../components/specifics/TabScreens/TabHeader";
import { colors } from "../../../constants/Colors";
import { QueryKeys } from "../../../constants/queryKeys";
import HomeScreen from "../../../screens/LoggedIn/HomeScreen";
import ChatsScreen from "../../../screens/LoggedIn/Tabs/ChatsScreen";
import FindYakkasScreen from "../../../screens/LoggedIn/Tabs/FindYakkasScreen";
import FindGroupsScreen from "../../../screens/LoggedIn/Tabs/FindGroupsScreen";
import SafetyScreen from "../../../screens/LoggedIn/Tabs/SafetyScreen";
import { ChattingUsersResponse } from "../../../types/types";
import { goFetchLite } from "../../../utils/goFetchLite";
import {
  HomeDrawerScreenProps,
  HomeTabScreenProps,
  TabsParamList
} from "../../navigation.props";
import { YakkaGroup } from "../../../components/generics/Icons/YakkaGroup";
import ProfileScreen from "../../../screens/LoggedIn/ProfileFlow/ProfileScreen";
import MyProfileScreen from "../../../screens/LoggedIn/ProfileFlow/MyProfileScreen";
/**
 * A bottom tab navigator displays tab buttons on the bottom of the display to switch screens.
 * https://reactnavigation.org/docs/bottom-tab-navigator
 */

const BottomTab = createBottomTabNavigator<TabsParamList>();

export const HomeTabNavigator = ({
  navigation
}: HomeDrawerScreenProps<"HomeTabs">) => {
  const chatsQuery = useInfiniteQuery<ChattingUsersResponse>(
    [QueryKeys.CHATS],
    ({ pageParam }) => {
      return goFetchLite("chats", {
        method: "GET",
        params: { page: pageParam }
      });
    },
    {
      getNextPageParam: (lastPage, pages) => lastPage.nextPage ?? undefined,
      keepPreviousData: true,
      onSuccess: data => console.log("got data", data.pages[0].chats),
      onError: error => console.log("error getting chats", error)
    }
  );

  return (
    <BottomTab.Navigator
      initialRouteName="Home"
      screenOptions={{
        tabBarActiveTintColor: colors.greenYakka
      }}
    >
      <BottomTab.Screen
        name="Home"
        component={HomeScreen}
        options={({ navigation, route }: HomeTabScreenProps<"Home">) => ({
          title: "Home",
          headerShown: false,
          unmountOnBlur: true,
          gestureEnabled: false,
          tabBarIcon: ({ color }) => <HomeSVG color={color} />
          // header: () => (
          //   //@ts-expect-error react-navigation's header navigation prop type is wrong,
          //   // we can actually use props from the parent drawer nav which it doesn't know - e.g. open drawer. (not sure if there's a way to change this)
          //   <GreenHeader navigation={navigation} route={route} homeScreen />
          // )
        })}
      />
      <BottomTab.Screen
        name="FindYakkas"
        component={FindYakkasScreen}
        options={{
          tabBarLabel: "Find YAKKAs",
          header: ({ navigation, route }) => (
            //@ts-expect-error react-navigation's header navigation type is wrong,
            // we can actually use props from the parent nav which it doesn't know - e.g. open drawer. (not sure if there's a way to change this)
            <GreenHeader navigation={navigation} route={route} tabScreen />
          ),
          tabBarIcon: ({ color }) => <YakkaUser color={color} />
        }}
      />
      <BottomTab.Screen
        name="FindGroups"
        component={FindGroupsScreen}
        options={{
          tabBarLabel: "Find Groups",
          header: ({ navigation, route }) => (
            // we can actually use props from the parent nav which it doesn't know - e.g. open drawer. (not sure if there's a way to change this)
            <GreenHeader
              //@ts-expect-error react-navigation's header navigation type is wrong,
              navigation={navigation}
              route={route}
              tabScreen
              topRightText="Create Group"
              onTopRightPress={() => navigation.navigate("CreateGroup")}
            />
          ),
          tabBarIcon: ({ color }) => <YakkaGroup color={color} />
        }}
      />
      <BottomTab.Screen
        name="Profile"
        component={ProfileScreen}
        initialParams={{ settingsOpen: false, id: undefined }}
        options={{
          headerShown: false,
          tabBarItemStyle: { height: 0, width: 0 },
          tabBarButton: () => null
        }}
      />
      <BottomTab.Screen
        name="MyProfile"
        component={MyProfileScreen}
        options={{
          title: "Profile",
          unmountOnBlur: true,
          headerShown: false,
          tabBarButton: () => null
        }}
      />
      <BottomTab.Group
        screenOptions={{
          header: ({ navigation, route }) => (
            //@ts-expect-error react-navigation's header navigation type is wrong,
            // we can actually use props from the parent nav which it doesn't know - e.g. open drawer. (not sure if there's a way to change this)
            <GreenHeader navigation={navigation} route={route} tabScreen />
          )
        }}
      >
        <BottomTab.Screen
          name="Chats"
          component={ChatsScreen}
          options={{
            tabBarLabel: "Chat",
            tabBarIcon: ({ color }) => (
              <View>
                <Ionicons name="chatbubbles-outline" size={26} color={color} />
                {chatsQuery.data &&
                  chatsQuery.data.pages
                    .flatMap((val: any) => val.hasUnreadMessages)
                    .every(pageHasUnread => pageHasUnread === true) && (
                    <View className=" w-2 h-2 bg-red-500 rounded-full absolute top-0.5 -right-0.5" />
                  )}
              </View>
            )
          }}
        />
      </BottomTab.Group>
    </BottomTab.Navigator>
  );
};
