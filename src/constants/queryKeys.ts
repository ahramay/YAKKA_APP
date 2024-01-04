// Centralise query keys here to avoid typos and duplication
// This is important for the global cache, and deduping requests

export const QueryKeys = {
  FRIENDS: "friends",
  CHAT: "chat",
  JOBS: "jobs",
  MY_PROFILE: "myProfile",
  userProfile: (userId: number) => ["userProfile", userId.toString()],
  getYakka: (yakkaId: number) => ["getYakka", yakkaId.toString()],
  getGroup: (groupId: number) => ["getGroup", groupId.toString()],
  PLANNED_YAKKAS: "plannedYakkas",
  RECENT_YAKKAS: "recentYakkas",
  NEARBY_USERS: "nearbyUsers",
  RECOMMENDED_USERS: "recommendedUsers",
  PERSONAL_GROUPS: "personalGroups",
  NEARBY_GROUPS: "nearbyGroups",
  FILTER_GROUPS: "filterGroups",
  RECOMMENDED_GROUPS: "recommendedGroups",
  CHATS: "chats",
  GET_BLOCKED_USERS: "getBlockedUsers",
  VERIFICATION_IMAGES: "verificationImages",
  INTERESTS: "interests",
  CATEGORIES :"categories",
  SAFETY_INFO: "safetyInfo",
  reviews: (userId: number | "me") => ["reviews", userId.toString()],
  initiateChat: (userId: number) => ["initiateChat", userId.toString()],
  chat: (chatId: string) => ["chat", chatId],
  NOTIFICATIONS: "notifications",
  SIGNUP_PROGRESS: "signupProgress",
  INTERESTS_HASHTAGS: "interestsHashtags",
  GET_EMERGENCY_CONTACT: "getEmergencyContact"
} as const;

export enum MutationKeys {
  CREDENTIALS_SIGNUP = "credentialsSignup",
  CREDENTIALS_LOGIN = "credentialsLogin",
  VERIFICATION_IMAGE = "verificationImage",
  PASSWORD_RESET = "passwordReset",
  FORGOT_PASSWORD = "forgotPassword",
  GOOGLE = "google",
  DELETE_ACCOUNT = "deleteAccount",
  FACEBOOK = "facebook",
  FACEBOOK_PHOTOS = "facebookPhotos",
  APPLE = "apple",
  LINKEDIN = "linkedIn",
  PHONE_NUMBER = "phoneNumber",
  PHONE_NUMBER_OTP = "phoneNumberOTP",
  IMAGES = "images",
  INTERESTS = "interests",
  CATEGORIES = "categories",
  INTERESTS_HASHTAGS = "interestsHashtags",
  PROFILE = "profile",
  UPDATE_PROFILE = "updateProfile",
  AVAILABILITY = "availability",
  BLOCK = "block",
  REPORT = "report",
  ADD_YAKKA = "addYakka",
  DELETE_YAKKA = "deleteYakka",
  INVITE_TO_YAKKA = "inviteToYakka",
  RESPOND_YAKKA = "responseYakka",
  ADD_FRIEND = "addFriend",
  RESPOND_FRIEND_REQUEST = "respondFriendRequest",
  DELETE_FRIEND = "deleteFriend",
  ALLOW_NOTIFICATIONS = "allowNotifications",
  NOTIFICATION_READ = "notificationRead",
  NEW_PROFILE_PIC = "newProfilePic",
  NEW_GROUP_PIC = "newGroupPic",
  DELETE_PROFILE_PIC = "deleteProfilePic",
  DELETE_GROUP_PIC = "deleteGroupPic",
  COVER_PHOTO = "coverPhoto",
  GROUP_COVER_PHOTO = "groupCoverPhoto",
  DELETE_COVER_PHOTO = "deleteCoverPhoto",
  DELETE_GROUP_COVER_PHOTO = "deleteGroupCoverPhoto",
  LOGOUT = "logout",
  JOIN_GROUP = "joinGroup",
  CREATE_GROUP = "createGroup"
}
