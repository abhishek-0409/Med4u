import { Doctor, TimeSlot } from "../types/doctor";
import { DOCTORS } from "../utils/constants";
import { delay } from "../utils/helpers";

export const doctorService = {
  async getDoctors(category?: string): Promise<Doctor[]> {
    await delay(550);
    if (!category) {
      return DOCTORS;
    }
    return DOCTORS.filter(
      (doctor) => doctor.category.toLowerCase() === category.toLowerCase(),
    );
  },
  async getFeaturedDoctors(): Promise<Doctor[]> {
    await delay(400);
    return [...DOCTORS].sort((a, b) => b.rating - a.rating).slice(0, 3);
  },
  async getDoctorById(doctorId: string): Promise<Doctor | undefined> {
    await delay(250);
    return DOCTORS.find((doctor) => doctor.id === doctorId);
  },
  async getSlots(doctorId: string): Promise<TimeSlot[]> {
    await delay(350);
    const doctor = DOCTORS.find((item) => item.id === doctorId);
    return doctor?.slots ?? [];
  },
};
