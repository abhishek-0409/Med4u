import { delay } from "../utils/helpers";

interface VerifyOtpPayload {
  phone: string;
  otp: string;
}

export const authService = {
  async requestOtp(phone: string): Promise<{ requestId: string; phone: string }> {
    await delay(900);
    return {
      requestId: `req_${Date.now()}`,
      phone,
    };
  },
  async verifyOtp(payload: VerifyOtpPayload): Promise<{ token: string; phone: string }> {
    await delay(900);
    if (payload.otp.trim().length !== 6) {
      throw new Error("Invalid OTP. Please enter the 6-digit OTP.");
    }
    return {
      token: `session_${Date.now()}`,
      phone: payload.phone,
    };
  },
};
