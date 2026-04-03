export type AuthStackParamList = {
  PhoneLogin: undefined;
  OtpVerification: { phoneNumber: string };
};

export type OnboardingStackParamList = {
  OnboardingWelcome: undefined;
  OnboardingIdentity: undefined;
  OnboardingVehicle: {
    firstName: string;
    lastName?: string;
    email?: string;
  };
};

export type ProfileStackParamList = {
  ProfileHome: undefined;
  EditProfile: undefined;
  PayoutDetails: undefined;
  HelpSupport: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Ongoing: undefined;
  Earnings: undefined;
  Profile: undefined;
};
