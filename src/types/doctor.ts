export type TimePeriod = "Morning" | "Afternoon" | "Evening";

export interface TimeSlot {
  id: string;
  label: string;
  period: TimePeriod;
  available: boolean;
}

export interface DoctorReview {
  id: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Doctor {
  id: string;
  name: string;
  specialization: string;
  category: string;
  rating: number;
  experienceYears: number;
  patients: string;
  fee: number;
  location: string;
  image: string;
  about: string;
  reviews: DoctorReview[];
  slots: TimeSlot[];
}

export interface Appointment {
  id: string;
  doctorId: string;
  doctorName: string;
  doctorImage: string;
  date: string;
  time: string;
  mode: "Video" | "Clinic";
  status: "Upcoming" | "Completed" | "Cancelled";
}
