import { Appointment, Doctor } from "../types/doctor";
import { LabReport, LabTest, Medicine, Prescription, UserProfile } from "../types/user";

export const DOCTOR_CATEGORIES = [
  "General",
  "Pediatrics",
  "Cardiology",
  "Dermatology",
  "Orthopedic",
  "Neurology",
];

export const DOCTORS: Doctor[] = [
  {
    id: "doc-1",
    name: "Dr. Sarah Johnson",
    specialization: "General Physician",
    category: "General",
    rating: 4.8,
    experienceYears: 8,
    patients: "3.4k+",
    fee: 499,
    location: "Indiranagar, Bengaluru",
    image:
      "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1200",
    about:
      "Focused on preventive care, long-term family medicine and digital-first consultation workflows.",
    reviews: [
      {
        id: "r-1",
        author: "Neha A.",
        rating: 5,
        comment: "Very clear diagnosis and practical treatment plan.",
        date: "2026-03-10",
      },
      {
        id: "r-2",
        author: "Suresh M.",
        rating: 4.7,
        comment: "Consultation was on time and very helpful.",
        date: "2026-02-22",
      },
    ],
    slots: [
      { id: "s1", label: "09:00 AM", period: "Morning", available: true },
      { id: "s2", label: "09:30 AM", period: "Morning", available: true },
      { id: "s3", label: "10:00 AM", period: "Morning", available: false },
      { id: "s4", label: "11:30 AM", period: "Morning", available: true },
      { id: "s5", label: "02:00 PM", period: "Afternoon", available: true },
      { id: "s6", label: "04:30 PM", period: "Afternoon", available: true },
      { id: "s7", label: "06:00 PM", period: "Evening", available: true },
    ],
  },
  {
    id: "doc-2",
    name: "Dr. Emily Carter",
    specialization: "Dermatologist",
    category: "Dermatology",
    rating: 4.7,
    experienceYears: 10,
    patients: "2.1k+",
    fee: 699,
    location: "Koramangala, Bengaluru",
    image:
      "https://images.pexels.com/photos/8460377/pexels-photo-8460377.jpeg?auto=compress&cs=tinysrgb&w=1200",
    about:
      "Skin, hair and acne specialist with an evidence-based approach and personalized care routines.",
    reviews: [
      {
        id: "r-3",
        author: "Rahul S.",
        rating: 4.8,
        comment: "Great treatment journey and very good follow-up.",
        date: "2026-03-03",
      },
      {
        id: "r-4",
        author: "Kriti P.",
        rating: 4.6,
        comment: "Calm consultation and easy to understand care plan.",
        date: "2026-01-30",
      },
    ],
    slots: [
      { id: "s8", label: "10:00 AM", period: "Morning", available: true },
      { id: "s9", label: "11:00 AM", period: "Morning", available: true },
      { id: "s10", label: "01:00 PM", period: "Afternoon", available: false },
      { id: "s11", label: "03:30 PM", period: "Afternoon", available: true },
      { id: "s12", label: "07:00 PM", period: "Evening", available: true },
    ],
  },
  {
    id: "doc-3",
    name: "Dr. Michael Tan",
    specialization: "Cardiologist",
    category: "Cardiology",
    rating: 4.9,
    experienceYears: 14,
    patients: "5.2k+",
    fee: 899,
    location: "HSR Layout, Bengaluru",
    image:
      "https://images.pexels.com/photos/5214958/pexels-photo-5214958.jpeg?auto=compress&cs=tinysrgb&w=1200",
    about:
      "Cardiac consultant with a focus on risk screening, lifestyle interventions and advanced diagnostics.",
    reviews: [
      {
        id: "r-5",
        author: "Anil V.",
        rating: 5,
        comment: "Detailed explanation and excellent bedside manner.",
        date: "2026-03-14",
      },
      {
        id: "r-6",
        author: "Pooja N.",
        rating: 4.8,
        comment: "Very reassuring and helped with follow-up planning.",
        date: "2026-02-28",
      },
    ],
    slots: [
      { id: "s13", label: "08:30 AM", period: "Morning", available: true },
      { id: "s14", label: "09:30 AM", period: "Morning", available: true },
      { id: "s15", label: "11:00 AM", period: "Morning", available: true },
      { id: "s16", label: "05:30 PM", period: "Evening", available: false },
      { id: "s17", label: "06:30 PM", period: "Evening", available: true },
    ],
  },
];

export const QUICK_ACTIONS = [
  { id: "qa-1", label: "Consult", subtitle: "Book doctor", route: "DoctorList" as const },
  { id: "qa-2", label: "Medicine", subtitle: "Order meds", route: "OrderMedicine" as const },
  { id: "qa-3", label: "Lab Tests", subtitle: "Book test", route: "BookTest" as const },
];

export const MEDICINES: Medicine[] = [
  {
    id: "med-1",
    name: "Paracetamol 650",
    category: "Fever",
    dosage: "1 tablet after food",
    packSize: "15 tablets",
    price: 95,
    image:
      "https://images.pexels.com/photos/3683074/pexels-photo-3683074.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "med-2",
    name: "Vitamin D3",
    category: "Supplements",
    dosage: "1 capsule daily",
    packSize: "10 capsules",
    price: 210,
    image:
      "https://images.pexels.com/photos/139398/human-medicine-doses-medical-139398.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
  {
    id: "med-3",
    name: "Cough Syrup",
    category: "Cold & Cough",
    dosage: "10ml twice daily",
    packSize: "100ml bottle",
    price: 140,
    image:
      "https://images.pexels.com/photos/5938353/pexels-photo-5938353.jpeg?auto=compress&cs=tinysrgb&w=1200",
  },
];

export const LAB_TESTS: LabTest[] = [
  {
    id: "lab-1",
    name: "Complete Blood Count (CBC)",
    sampleType: "Blood",
    reportTime: "6 hrs",
    price: 499,
  },
  {
    id: "lab-2",
    name: "Thyroid Profile (T3, T4, TSH)",
    sampleType: "Blood",
    reportTime: "12 hrs",
    price: 799,
  },
  {
    id: "lab-3",
    name: "Liver Function Test (LFT)",
    sampleType: "Blood",
    reportTime: "8 hrs",
    price: 899,
  },
];

export const LAB_REPORTS: LabReport[] = [
  {
    id: "rep-1",
    testName: "CBC",
    doctorName: "Dr. Sarah Johnson",
    date: "2026-04-10",
    status: "Ready",
  },
  {
    id: "rep-2",
    testName: "Thyroid Profile",
    doctorName: "Dr. Michael Tan",
    date: "2026-04-22",
    status: "Processing",
  },
];

export const DEFAULT_PROFILE: UserProfile = {
  id: "u-1",
  name: "Abhishek Kumar",
  phone: "+91 9876543210",
  email: "abhishek@med4u.app",
  age: 29,
  bloodGroup: "B+",
  avatar:
    "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

export const PRESCRIPTIONS: Prescription[] = [
  {
    id: "pr-1",
    doctorName: "Dr. Sarah Johnson",
    date: "2026-04-11",
    diagnosis: "Viral Fever",
    medicines: [
      { name: "Paracetamol 650", dosage: "1-0-1", duration: "3 days" },
      { name: "ORS", dosage: "As needed", duration: "3 days" },
    ],
  },
  {
    id: "pr-2",
    doctorName: "Dr. Emily Carter",
    date: "2026-03-25",
    diagnosis: "Seasonal Allergy",
    medicines: [{ name: "Cetirizine", dosage: "0-0-1", duration: "5 days" }],
  },
];

export const APPOINTMENTS: Appointment[] = [
  {
    id: "ap-1",
    doctorId: "doc-1",
    doctorName: "Dr. Sarah Johnson",
    doctorImage:
      "https://images.pexels.com/photos/7089020/pexels-photo-7089020.jpeg?auto=compress&cs=tinysrgb&w=1200",
    date: "May 05, 2026",
    time: "09:30 AM",
    mode: "Video",
    status: "Upcoming",
  },
];
