import { Doctor, TimePeriod, TimeSlot } from "../types/doctor";
import { api } from "./api";

interface BackendSlot {
  id: string;
  date: string;
  startTime: string;
  endTime: string;
  isBooked: boolean;
}

interface BackendDoctor {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  bio: string | null;
  consultationFee: number;
  rating: number;
  reviewCount: number;
  city: string | null;
  isAvailableToday: boolean;
}

function mapSlot(s: BackendSlot): TimeSlot {
  const [hStr, mStr] = s.startTime.split(":");
  const hour = parseInt(hStr, 10);
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  const ampm = hour >= 12 ? "PM" : "AM";
  const label = `${String(h12).padStart(2, "0")}:${mStr} ${ampm}`;
  const period: TimePeriod =
    hour < 12 ? "Morning" : hour < 17 ? "Afternoon" : "Evening";
  return { id: s.id, label, period, available: !s.isBooked };
}

function mapDoctor(d: BackendDoctor, slots: TimeSlot[] = []): Doctor {
  return {
    id: d.id,
    name: d.name,
    specialization: d.specialization,
    category: d.specialization,
    rating: Number(d.rating),
    experienceYears: Number(d.experienceYears),
    patients: d.reviewCount > 0 ? `${d.reviewCount}+` : "New",
    fee: Number(d.consultationFee),
    location: d.city ?? "India",
    image: "",
    about: d.bio ?? "",
    reviews: [],
    slots,
  };
}

const today = (): string => new Date().toISOString().split("T")[0];

function extractDoctorList(responseData: unknown): BackendDoctor[] {
  if (Array.isArray(responseData)) return responseData as BackendDoctor[];
  const d = responseData as Record<string, unknown> | null;
  if (d && Array.isArray(d.data)) return d.data as BackendDoctor[];
  if (d && Array.isArray(d.items)) return d.items as BackendDoctor[];
  return [];
}

export const doctorService = {
  async getDoctors(category?: string): Promise<Doctor[]> {
    try {
      const params: Record<string, string | number> = { limit: 50 };
      if (category) params.specialization = category;
      const res = await api.get("/v1/doctors", { params });
      return extractDoctorList(res.data).map((d) => mapDoctor(d));
    } catch (err) {
      console.error("[doctorService.getDoctors]", err);
      return [];
    }
  },

  async getFeaturedDoctors(): Promise<Doctor[]> {
    try {
      const res = await api.get("/v1/doctors", {
        params: { sortBy: "rating", limit: 3 },
      });
      return extractDoctorList(res.data).map((d) => mapDoctor(d));
    } catch (err) {
      console.error("[doctorService.getFeaturedDoctors]", err);
      return [];
    }
  },

  async getDoctorById(doctorId: string): Promise<Doctor | undefined> {
    try {
      const res = await api.get(`/v1/doctors/${doctorId}`);
      const d: BackendDoctor = res.data;
      return mapDoctor(d);
    } catch (err) {
      console.error("[doctorService.getDoctorById]", err);
      return undefined;
    }
  },

  async getSlots(doctorId: string): Promise<TimeSlot[]> {
    try {
      const res = await api.get(`/v1/doctors/${doctorId}/availability`, {
        params: { date: today() },
      });
      const slots: BackendSlot[] = Array.isArray(res.data) ? res.data : [];
      return slots.map(mapSlot);
    } catch (err) {
      console.error("[doctorService.getSlots]", err);
      return [];
    }
  },
};
