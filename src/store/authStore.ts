import { create } from "zustand";
import { isAxiosError } from "axios";
import { authService } from "../services/auth.service";
import { useUserStore } from "./userStore";

interface AuthState {
  phone: string;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setPhone: (phone: string) => void;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
  devLogin: (token: string, phone: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  phone: "",
  sessionToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  setPhone: (phone) => set({ phone, error: null }),
  requestOtp: async (phone) => {
    set({ isLoading: true, error: null });
    try {
      await authService.requestOtp(phone);
      set({ phone, isLoading: false });
    } catch (error) {
      const msg = isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "Unable to send OTP.";
      set({ isLoading: false, error: msg });
      throw error;
    }
  },
  verifyOtp: async (otp) => {
    const phone = get().phone;
    set({ isLoading: true, error: null });
    try {
      const result = await authService.verifyOtp({ phone, otp });

      const userStore = useUserStore.getState();
      if (result.isProfileComplete) {
        userStore.completeOnboarding({ name: result.user.name, phone: result.user.phone });
      } else {
        userStore.setProfile({ phone: result.user.phone });
      }

      set({
        sessionToken: result.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      const msg = isAxiosError(error)
        ? (error.response?.data?.message ?? error.message)
        : "OTP verification failed.";
      set({ isLoading: false, error: msg });
      throw error;
    }
  },
  devLogin: (token, phone) =>
    set({ sessionToken: token, phone, isAuthenticated: true, error: null }),
  logout: () =>
    set({
      sessionToken: null,
      isAuthenticated: false,
      error: null,
    }),
}));
