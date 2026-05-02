import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../screens/home/HomeScreen";
import { DoctorListScreen } from "../screens/doctor/DoctorListScreen";
import { DoctorDetailScreen } from "../screens/doctor/DoctorDetailScreen";
import { BookDoctorScreen } from "../screens/doctor/BookDoctorScreen";
import { VideoConsultScreen } from "../screens/doctor/VideoConsultScreen";
import { OrderMedicineScreen } from "../screens/medicine/OrderMedicineScreen";
import { CartScreen } from "../screens/medicine/CartScreen";
import { BookTestScreen } from "../screens/lab/BookTestScreen";
import { ReportsScreen } from "../screens/lab/ReportsScreen";
import { PrescriptionScreen } from "../screens/prescription/PrescriptionScreen";
import { AppSettingsScreen } from "../screens/profile/AppSettingsScreen";
import { ProfileScreen } from "../screens/profile/ProfileScreen";
import { ProfileSettingsScreen } from "../screens/profile/ProfileSettingsScreen";
import { colors } from "../theme/colors";
import { MainStackParamList } from "../types/navigation";

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainNavigator() {
  return (
    <Stack.Navigator
      initialRouteName="Home"
      screenOptions={{
        headerTitleStyle: { fontWeight: "700", color: colors.text },
        headerTintColor: colors.text,
        headerShadowVisible: false,
        headerStyle: { backgroundColor: colors.background },
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen
        name="DoctorList"
        component={DoctorListScreen}
        options={{ title: "Doctors" }}
      />
      <Stack.Screen
        name="DoctorDetail"
        component={DoctorDetailScreen}
        options={{ title: "Doctor Profile" }}
      />
      <Stack.Screen
        name="BookDoctor"
        component={BookDoctorScreen}
        options={{ title: "Book Appointment" }}
      />
      <Stack.Screen
        name="VideoConsult"
        component={VideoConsultScreen}
        options={{ title: "Video Consult", headerShown: false }}
      />
      <Stack.Screen
        name="OrderMedicine"
        component={OrderMedicineScreen}
        options={{ title: "Order Medicines" }}
      />
      <Stack.Screen name="Cart" component={CartScreen} options={{ title: "Your Cart" }} />
      <Stack.Screen name="BookTest" component={BookTestScreen} options={{ title: "Book Test" }} />
      <Stack.Screen name="Reports" component={ReportsScreen} options={{ title: "Lab Reports" }} />
      <Stack.Screen
        name="Prescription"
        component={PrescriptionScreen}
        options={{ title: "Prescriptions" }}
      />
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: "My Profile" }} />
      <Stack.Screen
        name="ProfileSettings"
        component={ProfileSettingsScreen}
        options={{ title: "Profile Settings" }}
      />
      <Stack.Screen
        name="AppSettings"
        component={AppSettingsScreen}
        options={{ title: "App Settings" }}
      />
    </Stack.Navigator>
  );
}
