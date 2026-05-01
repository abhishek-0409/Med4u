import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuthStore } from "../store/authStore";
import { RootStackParamList } from "../types/navigation";
import { AuthNavigator } from "./AuthNavigator";
import { MainNavigator } from "./MainNavigator";

const Stack = createNativeStackNavigator<RootStackParamList>();

export function AppNavigator() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <Stack.Screen name="MainFlow" component={MainNavigator} />
      ) : (
        <Stack.Screen name="AuthFlow" component={AuthNavigator} />
      )}
    </Stack.Navigator>
  );
}
