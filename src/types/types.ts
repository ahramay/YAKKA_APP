// Basic profile will come back from most routes which return info about

import { interestSchema } from "../models";

// another user.
export type BasicProfile = {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  status: UserStatus;
  isVerified: boolean;
};

export type FriendList = {
  friends: BasicProfile[];
};

export type InitiateChat = {
  chatId: string;
};

export type LinkedinLoginLinkResponse = {
  url: string;
  redirectUrl: string;
};

export type Image = {
  id: number;
  url: string;
};

export type Interest = {
  id: number;
  name: string;
  subInterests: Interest[];
};

export type UserStatus =
  | "AVAILABLE_TO_YAKKA"
  | "AVAILABLE_TO_CHAT"
  | "UNAVAILABLE";

// Array of all the possible user statuses
export type Gender = "Man" | "Woman" | "Other" | "Nonbinary";
export type GetProfileResponse = BasicProfile & {
  id: number;
  images: Image[];
  isVerified: boolean;
  verificationPending: boolean;
  gender: Gender;
  jobTitle: string;
  locationName: string;
  bio: string;
  reviews: {
    average: number;
    total: number;
  };
  totalYakkas: number;
  totalGroups: number;
  hashtags: {
    id: number;
    name: string;
  }[];
  interests: interestSchema["interests"][number]["interests"];
  friendStatus: "ACCEPTED" | "PENDING" | null;
  friendshipId: number;
  isOwnProfile: boolean;
  coverPhoto: string | null;
  notificationCount: number;
  status: UserStatus;
};

export type GroupType = {
  id: number;
  name: string;
  description: string;
  date: Date;
  endTime: Date;
  coverImage?: string | null;
  image?: Image;
  locationName:string[],
  categories:string[],
  profileImage?:string| null,
  reviews: {
    average: number;
    total: number;
  };
  groupGender:string;
  isOrganiser: boolean;
  hashtags: string[];
  isMember: boolean;
  isInvited: boolean;
  isPrivate: boolean;
  paymentAmount: number;
  paymentUrl: string;
};

export type GetGroupResponse = {
  groupYakka: GroupType;
};

export const yakkaListTypes = ["planned", "recent", null] as const;
export type YakkaListTypes = (typeof yakkaListTypes)[number];

export enum RequestStatus {
  ACCEPTED = "ACCEPTED",
  PENDING = "PENDING",
  DECLINED = "DECLINED"
}
export type YakkaBase = {
  id: number;
  startTimestamp: string;
  endTimestamp: string;
  attendee: BasicProfile;
  status: RequestStatus;
};

type Coordinates = {
  latitude: number;
  longitude: number;
};

export type YakkaRequest = {
  date: string;
  coordinates: Coordinates;
  time: { start: string; end: string };
  locationName: string;
  inviteeId: number;
  id: number;
  organiser: { id: number; firstName: string; lastName: string; image: string };
};

export type PlannedYakka = YakkaBase & {
  date: string;
  coordinates: Coordinates;
  locationName: string;
};

export type PlannedYakkasResponse = {
  planned: PlannedYakka[];
};

export type RecentYakka = YakkaBase & {
  yourReview: {
    rating: number;
  } | null;
};
export type RecentYakkasResponse = {
  recent: RecentYakka[];
} & LazyLoad;

type LazyLoad = {
  nextPage: number;
};

type FilterUsersList = (BasicProfile & {
  distanceMiles: number;
  yakkaCount: number;
  bio: string;
  averageRating: number;
})[];

export type NearbyUsersResponse = {
  nearby: FilterUsersList;
} & LazyLoad;

export type NearbyGroupsResponse = {
  nearby: FilterUsersList;
} & LazyLoad;

type ChattingUser = {
  id: number;
  recipient: BasicProfile;
  hasUnreadMessages: boolean;
  lastMessage: Message;
};

export type ChattingUsersResponse = {
  chats: ChattingUser[];
} & LazyLoad;

export type FindFriendsResponse = {
  friends: Omit<FilterUsersList, "distanceMiles">;
} & LazyLoad;

export type RecommendedUsersResponse = {
  recommended: FilterUsersList;
} & LazyLoad;

export type PersonalGroupsResponse = {
  recommended: FilterUsersList;
} & LazyLoad;

export type Review = {
  id: number;
  rating: number;
  comment: string;
  reviewer: BasicProfile;
  createdAt: string;
};

export type ReviewsListResponse = {
  reviews: Review[];
} & LazyLoad;

export type FindYakkaListType = "friends" | "nearby" | "recommended";
export type FindGroupsListType = "nearby" | "recommended" | "personal" | "filter";

export type Message = {
  id?: number;
  content: string;
  senderId: number | "me";
  sentAt: string;
  type: "TEXT" | "IMAGE" | "AUDIO";
  mediaUrl?: string;
};

export type ChatHistoryResponse = {
  messages: Message[];
  nextPage: number;
};

export type notificationTypes =
  | "GROUP_INVITE"
  | "GROUP_ACCEPTED"
  | "GROUP_DECLINED"
  | "GROUP_UPDATED"
  | "GROUP_CANCELLED"
  | "GROUP_REVIEWED"
  | "YAKKA_INVITE"
  | "YAKKA_ACCEPTED"
  | "YAKKA_DECLINED"
  | "YAKKA_UPDATED"
  | "YAKKA_CANCELLED"
  | "YAKKA_REVIEWED"
  | "FRIEND_REQUEST"
  | "ACCEPTED_FRIEND_REQUEST"
  | "MISC"
  | "VERIFICATION_REMINDER"
  | "VERIFICATION_FAILED"
  | "VERIFICATION_SUCCEEDED";

export type fullYakka = {
  id: number;
  startTimestamp: string;
  endTimestamp: string;
  attendee: {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    status: UserStatus;
    isVerified: boolean;
  };
  status: "ACCEPTED" | "PENDING" | "DECLINED";
  date: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
  locationName: string;
};

export type sender = {
  id: number;
  firstName: string;
  lastName: string;
  image: string;
  status: UserStatus;
  isVerified: boolean;
};

export type notification = {
  id: number;
  prepositionName: string;
  clause: string;
  timestamp: number;
  yakkaId: string;
  type: notificationTypes;
  friendRequestId: string;
  review: { id: number; rating: 0 | 1 | 2 | 3 | 4 | 5 };
  sender: sender;
  isRead: boolean;
};

export type getNotificationsResponse = {
  nextPage: string;
  notifications: notification[];
  unreadCount: number;
};

export type getFacebookPhotosResponse = {
  photos: {
    id: number;
    image: string;
  }[];
};

export type findYakkaContactsResponse = {
  yakkaContacts: {
    id: number;
    firstName: string;
    lastName: string;
    image: string;
    status: UserStatus;
    isVerified: boolean;
    phoneNumber: string;
    countryCode: string;
  }[];
  nonYakkaContacts: {
    phoneNumber: string;
    countryCode: string;
  }[];
};

export type YakkaContactsInput = {
  contacts: (
    | undefined
    | {
        phoneNumber: string;
        countryCode: string;
      }
  )[];
  skip?: boolean;
};
