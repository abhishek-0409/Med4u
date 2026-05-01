export interface UserProfile {
  id: string;
  name: string;
  phone: string;
  email: string;
  age: number;
  bloodGroup: string;
  avatar: string;
}

export interface Medicine {
  id: string;
  name: string;
  category: string;
  dosage: string;
  packSize: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: string;
  medicine: Medicine;
  quantity: number;
}

export interface LabTest {
  id: string;
  name: string;
  sampleType: string;
  reportTime: string;
  price: number;
}

export interface LabReport {
  id: string;
  testName: string;
  doctorName: string;
  date: string;
  status: "Ready" | "Processing";
}

export interface PrescriptionMedicine {
  name: string;
  dosage: string;
  duration: string;
}

export interface Prescription {
  id: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
}
