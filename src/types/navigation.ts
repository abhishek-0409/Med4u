export type AuthStackParamList = {
  Login: undefined;
  OTP: { phone: string };
};

export type MainStackParamList = {
  Home: undefined;
  DoctorList: { category?: string } | undefined;
  DoctorDetail: { doctorId: string };
  BookDoctor: { doctorId: string };
  VideoConsult: { doctorId: string };
  OrderMedicine: undefined;
  Cart: undefined;
  BookTest: undefined;
  Reports: undefined;
  Prescription: undefined;
  Profile: undefined;
  ProfileSettings: undefined;
  AppSettings: undefined;
};

export type RootStackParamList = {
  AuthFlow: undefined;
  Onboarding: undefined;
  MainFlow: undefined;
};
