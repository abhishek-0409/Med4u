import { create } from "zustand";
import { authService } from "../services/auth.service";

interface AuthState {
  phone: string;
  sessionToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  setPhone: (phone: string) => void;
  requestOtp: (phone: string) => Promise<void>;
  verifyOtp: (otp: string) => Promise<void>;
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
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "Unable to send OTP.",
      });
      throw error;
    }
  },
  verifyOtp: async (otp) => {
    const phone = get().phone;
    set({ isLoading: true, error: null });
    try {
      const result = await authService.verifyOtp({ phone, otp });
      set({
        sessionToken: result.token,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "OTP verification failed.",
      });
      throw error;
    }
  },
  logout: () =>
    set({
      sessionToken: null,
      isAuthenticated: false,
      error: null,
    }),
}));
