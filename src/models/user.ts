export type createUserProfileInput = {
  firstName?: string;
  lastName?: string;
  gender?: string;
  jobTitle?: string;
  bio?: string;
  pushNotificationToken?: string;
  // DOB on signup has been removed.
  // dateOfBirth?: string;
};
export type checkSignupProgressSchema = {
  progress: {
    phoneVerified: boolean;
    profileImagesUploaded: boolean;
    profileCompleted: boolean;
    interestsCompleted: boolean;
    hashtagsCompleted: boolean;
    contactsScreenCompleted: boolean;
    verificationImageUploaded: boolean;
  };
  autoFill: {
    firstName: string;
    lastName: string;
  };
  authType: "CREDENTIALS" | "FACEBOOK" | "GOOGLE" | "APPLE" | "LINKEDIN" | null;
};

export type interestSchema = {
  interests: {
    id: number;
    name: string;
    interests: { id: number; name: string }[];
  }[];
};

export type categoriesSchema = {
  categories: {
    id: number;
    name: string;
    categories: { id: number; name: string }[];
  }[];
};

export type hashtagSchema = {
  id: number;
  name: string;
};

export type hashtagsSchema = {
  hashtags: hashtagSchema[];
};
