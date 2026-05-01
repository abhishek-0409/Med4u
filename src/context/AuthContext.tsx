import React, { createContext, useContext, useMemo } from "react";
import { useAuthStore } from "../store/authStore";

interface AuthContextValue {
  phone: string;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setPhone: (phone: string) => void;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const phone = useAuthStore((state) => state.phone);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const isLoading = useAuthStore((state) => state.isLoading);
  const error = useAuthStore((state) => state.error);
  const setPhone = useAuthStore((state) => state.setPhone);
  const requestOtp = useAuthStore((state) => state.requestOtp);
  const verifyOtp = useAuthStore((state) => state.verifyOtp);
  const logout = useAuthStore((state) => state.logout);

  const value = useMemo(
    () => ({
      phone,
      isAuthenticated,
      isLoading,
      error,
      setPhone,
      requestOtp,
      verifyOtp,
      logout,
    }),
    [phone, isAuthenticated, isLoading, error, setPhone, requestOtp, verifyOtp, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used inside AuthProvider.");
  }
  return context;
}
