export type AuthStackParamList = {
  Login: undefined;
  OTP: { phone: string };
};

export type MainStackParamList = {
  Home: undefined;
  DoctorList: { category?: string } | undefined;
  DoctorDetail: { doctorId: string };
  BookDoctor: { doctorId: string };
  VideoConsult: { doctorId: string; appointmentId: string; role: 'patient' | 'doctor' };
  OrderMedicine: undefined;
  Cart: undefined;
  BookTest: undefined;
  Reports: undefined;
  Prescription: undefined;
  Appointments: undefined;
  Profile: undefined;
  ProfileSettings: undefined;
  AppSettings: undefined;
};

export type RootStackParamList = {
  AuthFlow: undefined;
  Onboarding: undefined;
  MainFlow: undefined;
};
