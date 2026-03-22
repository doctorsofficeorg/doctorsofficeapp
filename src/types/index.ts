// ============================================
// CORE DOMAIN TYPES — Doctors Office
// ============================================

export type AppointmentStatus = "waiting" | "in_consultation" | "done" | "cancelled" | "no_show";
export type PaymentMode = "cash" | "upi" | "card" | "insurance" | "other";
export type Gender = "male" | "female" | "other";
export type PrescriptionFrequency = "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS" | "STAT" | "PRN";

export interface Clinic {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstin?: string;
  logo_url?: string;
  region: "india" | "us" | "eu";
  created_at: string;
  updated_at: string;
}

export interface Doctor {
  id: string;
  clinic_id: string;
  user_id: string;
  full_name: string;
  qualification: string;
  registration_number: string;
  specialization: string;
  phone: string;
  email: string;
  signature_url?: string;
  created_at: string;
}

export interface Patient {
  id: string;
  clinic_id: string;
  patient_uid: string;
  full_name: string;
  phone: string;
  email?: string;
  date_of_birth?: string;
  age?: number;
  gender: Gender;
  blood_group?: string;
  address?: string;
  emergency_contact?: string;
  medical_history?: string;
  allergies?: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  clinic_id: string;
  doctor_id: string;
  patient_id: string;
  appointment_date: string;
  token_number: number;
  status: AppointmentStatus;
  chief_complaint?: string;
  vitals?: Vitals;
  notes?: string;
  started_at?: string;
  completed_at?: string;
  created_at: string;
  // Joined fields
  patient?: Patient;
}

export interface Vitals {
  bp_systolic?: number;
  bp_diastolic?: number;
  pulse?: number;
  temperature?: number;
  weight?: number;
  height?: number;
  spo2?: number;
}

export interface Prescription {
  id: string;
  clinic_id: string;
  doctor_id: string;
  patient_id: string;
  appointment_id: string;
  diagnosis: string;
  notes?: string;
  advice?: string;
  follow_up_date?: string;
  items: PrescriptionItem[];
  created_at: string;
  // Joined fields
  patient?: Patient;
  doctor?: Doctor;
}

export interface PrescriptionItem {
  id: string;
  prescription_id: string;
  medicine_name: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  duration: string;
  instructions?: string;
  quantity?: number;
}

export interface Invoice {
  id: string;
  clinic_id: string;
  patient_id: string;
  appointment_id?: string;
  invoice_number: string;
  items: InvoiceItem[];
  subtotal: number;
  gst_percent: number;
  gst_amount: number;
  discount: number;
  total: number;
  payment_mode: PaymentMode;
  payment_status: "paid" | "pending" | "partial";
  notes?: string;
  created_at: string;
  // Joined fields
  patient?: Patient;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

// ============================================
// UI & COMPONENT TYPES
// ============================================

export interface NavItem {
  title: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: number;
}

export interface DashboardStat {
  label: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon: React.ComponentType<{ className?: string }>;
  color: "teal" | "indigo" | "emerald" | "amber" | "rose";
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
}
