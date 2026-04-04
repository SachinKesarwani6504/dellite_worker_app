export type AuthStackParamList = {
  PhoneLogin: undefined;
  OtpVerification: { phoneNumber: string };
};

export type OnboardingStackParamList = {
  OnboardingIdentity: undefined;
  OnboardingVehicle: undefined;
  OnboardingServiceSelection: undefined;
  OnboardingCertification: undefined;
  OnboardingWelcome: undefined;
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
