import { create } from "zustand";
import { Appointment } from "../types/doctor";
import { AppSettings, CartItem, Medicine, Prescription, UserProfile } from "../types/user";
import {
  APPOINTMENTS,
  DEFAULT_APP_SETTINGS,
  DEFAULT_PROFILE,
  PRESCRIPTIONS,
} from "../utils/constants";

interface UserState {
  profile: UserProfile;
  hasCompletedOnboarding: boolean;
  appSettings: AppSettings;
  cart: CartItem[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  setAppSettings: (settings: Partial<AppSettings>) => void;
  addToCart: (medicine: Medicine) => void;
  incrementCartItem: (id: string) => void;
  decrementCartItem: (id: string) => void;
  clearCart: () => void;
  addAppointment: (appointment: Appointment) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: DEFAULT_PROFILE,
  hasCompletedOnboarding: false,
  appSettings: DEFAULT_APP_SETTINGS,
  cart: [],
  appointments: APPOINTMENTS,
  prescriptions: PRESCRIPTIONS,
  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
    })),
  completeOnboarding: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
      hasCompletedOnboarding: true,
    })),
  setAppSettings: (settings) =>
    set((state) => ({
      appSettings: { ...state.appSettings, ...settings },
    })),
  addToCart: (medicine) =>
    set((state) => {
      const existing = state.cart.find((item) => item.medicine.id === medicine.id);
      if (existing) {
        return {
          cart: state.cart.map((item) =>
            item.medicine.id === medicine.id ? { ...item, quantity: item.quantity + 1 } : item,
          ),
        };
      }
      return {
        cart: [
          ...state.cart,
          {
            id: `cart_${medicine.id}`,
            medicine,
            quantity: 1,
          },
        ],
      };
    }),
  incrementCartItem: (id) =>
    set((state) => ({
      cart: state.cart.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item,
      ),
    })),
  decrementCartItem: (id) =>
    set((state) => ({
      cart: state.cart
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0),
    })),
  clearCart: () => set({ cart: [] }),
  addAppointment: (appointment) =>
    set((state) => ({
      appointments: [appointment, ...state.appointments],
    })),
}));
