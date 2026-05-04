import { api } from "./api";

interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  isNewUser: boolean;
  isProfileComplete: boolean;
  user: {
    id: string;
    phone: string;
    name: string;
    role: string;
  };
}

export interface VerifyOtpResult {
  token: string;
  phone: string;
  isNewUser: boolean;
  isProfileComplete: boolean;
  user: LoginResponse["user"];
}

function toE164(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return phone;
  if (digits.length === 10) return `+91${digits}`;
  return `+${digits}`;
}

export const authService = {
  async requestOtp(phone: string): Promise<{ message: string }> {
    const { data } = await api.post<{ message: string }>("/v1/auth/send-otp", {
      phone: toE164(phone),
    });
    return data;
  },

  async verifyOtp(payload: VerifyOtpPayload): Promise<VerifyOtpResult> {
    const { data } = await api.post<LoginResponse>("/v1/auth/verify-otp", {
      ...payload,
      phone: toE164(payload.phone),
    });
    return {
      token: data.accessToken,
      phone: payload.phone,
      isNewUser: data.isNewUser,
      isProfileComplete: data.isProfileComplete,
      user: data.user,
    };
  },
};
