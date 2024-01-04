import React from "react";
import { checkSignupProgressSchema } from "../models";
import { RootLoggedInStackList } from "../navigation/navigation.props";
import PhoneNumberScreen from "../screens/LoggedIn/SignUpFlow/2-PhoneNumberScreen";
import VerifyPhoneNumberScreen from "../screens/LoggedIn/SignUpFlow/3-VerifyPhoneNumberScreen";
import LocationServicesScreen from "../screens/LoggedIn/SignUpFlow/4-LocationServicesScreen";
import AllowNotificationsScreen from "../screens/LoggedIn/SignUpFlow/5-AllowNotificationsScreen";
import NameSetupScreen from "../screens/LoggedIn/SignUpFlow/6-NameSetupScreen";
import PhotosScreen from "../screens/LoggedIn/SignUpFlow/7-PhotosScreen";
import GenderScreen from "../screens/LoggedIn/SignUpFlow/8-GenderScreen";
import InterestsScreen from "../screens/LoggedIn/SignUpFlow/9-InterestsScreen";
import InterestsHashtagScreen from "../screens/LoggedIn/SignUpFlow/10-InterestsHashtagScreen";
import JobScreen from "../screens/LoggedIn/SignUpFlow/11-JobScreen";
import ContactsScreen from "../screens/LoggedIn/SignUpFlow/12-ContactsScreen";
import DescribeYourselfScreen from "../screens/LoggedIn/SignUpFlow/13-DescribeYourselfScreen";
import BirthdayScreen from "../screens/LoggedIn/SignUpFlow/BirthdayScreen";

export interface SignUpScreenProps {
  id: number;
  name: keyof RootLoggedInStackList;
  component: React.ComponentType<any>;
  route: keyof checkSignupProgressSchema["progress"];

  finished: boolean;
  fields?: {
    name: string;
    type: "text" | "image" | "list" | "permissions" | "search" | "contacts";
  }[];
}

export default [
  {
    id: 2,
    name: "PhoneNumber",
    route: "phoneVerified",
    fields: [{ name: "phoneNumber", type: "text" }],
    component: PhoneNumberScreen,
    finished: false
  },
  {
    id: 3,
    name: "VerifyPhoneNumber",
    route: "phoneVerified",
    fields: [{ name: "otpInput", type: "text" }],
    component: VerifyPhoneNumberScreen,
    finished: false
  },
  {
    id: 4,
    name: "LocationServices",
    route: "profileCompleted",
    fields: [{ name: "coordinates", type: "permissions" }],
    component: LocationServicesScreen,
    finished: false
  },
  {
    id: 5,
    name: "AllowNotifications",
    route: "profileCompleted",
    fields: [{ name: "notificationID", type: "permissions" }],
    component: AllowNotificationsScreen,
    finished: false
  },
  {
    id: 6,
    name: "NameSetup",
    route: "profileCompleted",
    component: NameSetupScreen,
    fields: [{ name: "name", type: "text" }]
  },
  {
    id: 7,
    name: "Photos",
    route: "profileImagesUploaded",
    component: PhotosScreen,
    fields: [{ name: "name", type: "text" }]
  },

  // BIRTHDAY currently removed from the flow
  // check signUpFlow/BirdthdayScreen.tsx
  // {
  //   id: 8,
  //   name: "Birthday",
  //   route: "profileCompleted",
  //   component: BirthdayScreen,
  //   fields: [{ name: "birthday", type: "text" }],
  //   finished: false
  // },
  {
    id: 8,
    name: "Gender",
    route: "profileCompleted",
    component: GenderScreen,
    fields: [{ name: "gender", type: "list" }],
    finished: false
  },
  {
    id: 9,
    name: "Interests",
    route: "interestsCompleted",
    component: InterestsScreen,
    fields: [{ name: "interests", type: "list" }],
    finished: false
  },
  {
    id: 10,
    name: "InterestHashtags",
    route: "hashtagsCompleted",
    fields: [{ name: "hashtags", type: "search" }],
    component: InterestsHashtagScreen,
    finished: false
  },
  {
    id: 11,
    name: "Job",
    route: "profileCompleted",
    fields: [{ name: "job", type: "text" }],
    component: JobScreen,
    finished: false
  },
  {
    id: 12,
    name: "DescribeYourself",
    route: "profileCompleted",
    fields: [{ name: "bio", type: "image" }],
    component: DescribeYourselfScreen,
    finished: false
  },
  {
    id: 13,
    name: "Contacts",
    route: "contactsScreenCompleted",
    fields: [{ name: "contacts", type: "list" }],
    component: ContactsScreen,
    finished: false
  }
] as SignUpScreenProps[];
