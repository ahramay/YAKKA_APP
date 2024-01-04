import { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import { DrawerScreenProps } from "@react-navigation/drawer";
// import {DrawerScreenProps} from '@react-navigation/drawer';

import {
  CompositeScreenProps,
  NavigatorScreenParams
} from "@react-navigation/native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { StackScreenProps } from "@react-navigation/stack";
import { Contact } from "expo-contacts";
import { photo } from "../models";
import {
  BasicProfile,
  FindGroupsListType,
  findYakkaContactsResponse,
  FindYakkaListType,
  GetProfileResponse,
  InitiateChat,
  YakkaListTypes
} from "../types/types";

//Wagwan Euan,
//So basically this is how to do types for navigation, it was a little fucked before
//which it made it a lot harder to explain haha.
//I've tidied it all up now so every screen is where it should go.

/*Here's everything to know:
  1.    Each navigator has a type based on its screens and its parent (these types ends with "Props").

  2.    To define a navigators type, import its ScreenProps and pass its screens* as a generic

  3.    * 'Its screens' are where you define the names of screens & set the route.params' type
        pass undefined if nothing is passed. (these types end with "List")

  4.    To add it's parent to the definition (important for navving to higher screens/opening drawer actions etc.)
        Use the CompositeScreenProps type

See examples below
*/

/**
 * Link for using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

//###INITIAL NAVIGATOR###//
export type RootStackList = {
  LoggedIn: NavigatorScreenParams<RootLoggedInStackList> | undefined;
  LoggedOut: NavigatorScreenParams<RootLoggedOutStackList> | undefined;
};

export type RootStackScreenProps<Screen extends keyof RootStackList> =
  NativeStackScreenProps<RootStackList, Screen>;

//###LOGGED OUT###//
export type RootLoggedOutStackList = {
  Landing: undefined;
  SigninSignupTabs: undefined;
  //
  Signin: undefined;
  Signup: undefined;
  ForgotPassword: undefined;
  ResetPassword: { newPassword: string; userId: number; token: string };
};

export type signUpErrorProps = {
  message: string;
  errorCode?: string;
}[];

//Use this type on the sign in and sign up page
export type SigninSignupTabScreenProps<
  Screen extends keyof RootLoggedOutStackList
> = CompositeScreenProps<
  BottomTabScreenProps<RootLoggedOutStackList, Screen>,
  RootStackScreenProps<keyof RootStackList>
>;

//Use this type on the landing page and forgot password page
export type RootLoggedOutStackProps<
  Screen extends keyof RootLoggedOutStackList
> = CompositeScreenProps<
  StackScreenProps<RootLoggedOutStackList, Screen>,
  RootStackScreenProps<keyof RootStackList>
>;

//###INITIAL LOGGED IN###//
//Every screen before the drawer is reached goes here.
export type RootLoggedInStackList = {
  Loading: undefined;
  //Navigators
  HomeDrawer: NavigatorScreenParams<DrawerList> | undefined; //HomeTabs: NavigatorScreenParams<HomeDrawerList> | undefined;
  //User Details Screens
  SafetyScreen: undefined;
  Profile: undefined;
  PhoneNumber: undefined;
  VerifyPhoneNumber: undefined;
  LocationServices: undefined;
  AllowNotifications: undefined;
  NameSetup: signUpErrorProps | undefined;
  Photos: undefined;
  Birthday: signUpErrorProps | undefined;
  Gender: signUpErrorProps | undefined;
  Interests: undefined;
  InterestHashtags: undefined;
  Job: signUpErrorProps | undefined;
  Contacts: undefined;
  AddContactsOnYakka: { contactsData: findYakkaContactsResponse };
  AddContactsToYakka: { contactsData: findYakkaContactsResponse };
  DescribeYourself: signUpErrorProps | undefined;
  RecommendedGroups: undefined;
  ViewGroup: undefined;
  ConnectWithFriends: undefined;
  //Settings Screens
  Account: undefined;
  Notifications: undefined;
  BlockedContacts: undefined;
  ContactsSyncing: undefined;
  Privacy: undefined;
  EmergencyContact: undefined;
  Security: undefined;
  Help: undefined;
  About: undefined;
  VerifyAccount: undefined;
  CreateGroup: undefined;
  FindGroupsScreen:undefined,
  CheckPose: { posePic: { gestureiId: number; picture: string }; photo: photo };
  //Profile Screens
  EditProfile: NavigatorScreenParams<DrawerList> | undefined;
  ReviewList: { userId: number | "me" };
  Chat: InitiateChat & { friend: Omit<BasicProfile, "isVerified" | "status"> };
};

//Use this type in the signup flow and for the drawer
export type RootLoggedInScreenProps<
  Screen extends keyof RootLoggedInStackList
> = CompositeScreenProps<
  DrawerScreenProps<RootLoggedInStackList, Screen>,
  RootStackScreenProps<keyof RootStackList>
>;

//### DRAWER PROPS ###//
//Every screen within the drawer space
export type DrawerList = {
  //Navigatior to tabs from drawer navigator
  HomeTabs: NavigatorScreenParams<TabsParamList>;
  Settings: undefined;
};

export type HomeDrawerScreenProps<Screen extends keyof DrawerList> =
  CompositeScreenProps<
    DrawerScreenProps<DrawerList, Screen>,
    RootLoggedInScreenProps<keyof RootLoggedInStackList>
  >;

//### TABS PROPS ###//
//Every screen within the logged in space, navigate to any screen in rootLoggedInParams
export type TabsParamList = {
  //Navigatior to tabs from drawer navigator
  Home:
    | { openNotifications?: boolean; openRecent?: YakkaListTypes }
    | undefined;
  FindYakkas: { tab: FindYakkaListType; openAddYakkaModal?: boolean };
  FindGroups: { tab: FindGroupsListType; openAddGroupModal?: boolean};
  Safety: undefined;
  MyProfile: undefined;
  Profile:
    | { id: number; settingsOpen: boolean; openAddYakkaModal: boolean }
    | undefined;
  //TabScreen1: undefined
  //TabScreen2 :undefined
  //TabScreen3: undefined
  //TabScreen4: undefined
  Chats: undefined;
  Chat: InitiateChat & { friend: BasicProfile }; //DELETE THIS
};

//Use this type to get the props of a screen in a screen with tabs at the bottom
export type HomeTabScreenProps<Screen extends keyof TabsParamList> =
  CompositeScreenProps<
    BottomTabScreenProps<TabsParamList, Screen>,
    HomeDrawerScreenProps<keyof DrawerList>
  >;
