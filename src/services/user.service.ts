import { api } from "./api";

interface UpdateProfilePayload {
  name?: string;
  dob?: string;
  gender?: "male" | "female" | "other";
  bloodGroup?: string;
}

export const userService = {
  async updateProfile(payload: UpdateProfilePayload): Promise<void> {
    await api.patch("/v1/users/me", payload);
  },
};
