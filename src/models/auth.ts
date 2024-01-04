// =========AUTH ROUTES=============

// Request email sign in link

// Body
export type GenerateEmailLinkInput = {
  email: string;
  resend?: boolean;
};
// Response
// BasicResponse

// ---------------------------------

// Sign Up with email

// Body
export type EmailLinkInput = {
  token: string;
};

// Response

export type SignInResponse = {
  accessToken: string;
  refreshToken: string;
};

// ---------------------------------

// Sign Up with Google

// Body

export type GoogleSignInInput = {
  idToken: string;
  accessToken: string;
};

// Response
// SignInResponse

// ---------------------------------

// Sign Up with Apple

// Body

export type AppleSignInInput = {
  idToken: string;
  authToken: string;
  firstName: string | null;
  lastName: string | null;
};

// Response
// SignInResponse

// ---------------------------------

// Refresh Access Token

// Body

export type RefreshTokenInput = {
  refreshToken: string;
};

// Response
// SignInResponse
export type RequestOTPInput = {
  phoneNumber: string;
  phoneCountryCode: string;
};

export type VerifyOTPInput = {
  otp: string;
};

export type verifyImageResponseSchema = {
  imageUrl: string;
  id: number;
  description: string;
};

export type verifyImageInput = {
  base64: string;
  gestureId: number;
};
