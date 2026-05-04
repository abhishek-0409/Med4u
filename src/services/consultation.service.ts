import { api } from "./api";

export interface StunServer {
  urls: string;
}

export interface TurnServer {
  urls: string;
  username: string;
  credential: string;
}

export interface JoinConsultationResponse {
  roomId: string;
  token: string;
  stunServers: StunServer[];
  turnServers: TurnServer[];
}

export const consultationService = {
  join: async (appointmentId: string): Promise<JoinConsultationResponse> => {
    const { data } = await api.post<JoinConsultationResponse>(
      `/v1/consultations/${appointmentId}/join`,
    );
    return data;
  },
};
