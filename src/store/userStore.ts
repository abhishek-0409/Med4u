import { create } from "zustand";
import { Appointment } from "../types/doctor";
import { CartItem, Medicine, Prescription, UserProfile } from "../types/user";
import { APPOINTMENTS, DEFAULT_PROFILE, PRESCRIPTIONS } from "../utils/constants";

interface UserState {
  profile: UserProfile;
  cart: CartItem[];
  appointments: Appointment[];
  prescriptions: Prescription[];
  setProfile: (profile: Partial<UserProfile>) => void;
  addToCart: (medicine: Medicine) => void;
  incrementCartItem: (id: string) => void;
  decrementCartItem: (id: string) => void;
  clearCart: () => void;
  addAppointment: (appointment: Appointment) => void;
}

export const useUserStore = create<UserState>((set) => ({
  profile: DEFAULT_PROFILE,
  cart: [],
  appointments: APPOINTMENTS,
  prescriptions: PRESCRIPTIONS,
  setProfile: (profile) =>
    set((state) => ({
      profile: { ...state.profile, ...profile },
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
