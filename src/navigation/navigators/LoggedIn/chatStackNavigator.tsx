import { CompositeScreenProps } from "@react-navigation/native";
import {
  createNativeStackNavigator,
  NativeStackScreenProps
} from "@react-navigation/native-stack";
import React from "react";
import ChatScreen from "../../../screens/LoggedIn/Chat/ChatScreen";
import TempFriendsScreen from "../../../screens/LoggedIn/Chat/TempFriendsScreen";
import { BasicProfile, InitiateChat } from "../../../types/types";
import { HomeTabScreenProps, TabsParamList } from "../../navigation.props";

//### CHAT STACK PROPS ###//
//Every screen within the chat stack navigator
export type ChatStackList = {
  TempFriends: undefined;
  Chat: InitiateChat & { friend: BasicProfile };
};

//Use this type to get the props of a screen in a screen with tabs at the bottom
export type ChatStackProps<Screen extends keyof ChatStackList> =
  CompositeScreenProps<
    NativeStackScreenProps<ChatStackList, Screen>,
    HomeTabScreenProps<keyof TabsParamList>
  >;

const ChatStack = createNativeStackNavigator<ChatStackList>();

export default function ChatStackNavigator() {
  return (
    <ChatStack.Navigator>
      <ChatStack.Screen
        name="TempFriends"
        component={TempFriendsScreen}
        options={{ headerShown: false }}
      />
      <ChatStack.Screen name="Chat" component={ChatScreen} />
    </ChatStack.Navigator>
  );
}
