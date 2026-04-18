// ────────────────────────────────────────────
// SaaS / Multi-tenant models
// ────────────────────────────────────────────

export type ClinicRole = 'owner' | 'doctor' | 'nurse' | 'lab_tech' | 'front_desk';

export interface User {
  _id: string;
  phone: string;
  fullName: string;
  email?: string;
  avatarUrl?: string;
  isActive: boolean;
}

export interface ClinicBranding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: 'light' | 'dark';
  headerText?: string;
  footerText?: string;
}

export interface ClinicMembership {
  _id: string;
  userId: string;
  clinicId: string;
  role: ClinicRole;
  permissions: string[];
  qualification?: string;
  registrationNumber?: string;
  specialization?: string;
  fullName?: string;
  phone?: string;
  email?: string;
  avatarUrl?: string;
  invitedBy?: string;
  joinedAt: string;
  isActive: boolean;
}

export interface ClinicListItem {
  clinicId: string;
  clinicName: string;
  role: ClinicRole;
  branding?: ClinicBranding;
}

// ────────────────────────────────────────────
// Domain models (aligned with server schemas)
// ────────────────────────────────────────────

export type AppointmentStatus = 'waiting' | 'in_consultation' | 'done' | 'cancelled' | 'no_show';
export type PrescriptionFrequency = 'OD' | 'BD' | 'TDS' | 'QID' | 'SOS' | 'HS' | 'STAT' | 'PRN';
export type PaymentMode = 'cash' | 'upi' | 'card' | 'insurance' | 'other';
export type PaymentStatus = 'paid' | 'pending' | 'partial';

export interface Clinic {
  _id: string;
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  gstin?: string;
  region?: 'india' | 'us' | 'eu';
  branding?: ClinicBranding;
  ownerId?: string;
  isActive?: boolean;
  createdAt: string;
  updatedAt: string;
}

/** Derived from User + ClinicMembership for display purposes */
export interface Doctor {
  _id: string;
  clinicId: string;
  fullName: string;
  phone: string;
  email?: string;
  specialization?: string;
  qualification?: string;
  registrationNumber?: string;
  gender?: 'male' | 'female' | 'other';
  avatarUrl?: string;
  role: ClinicRole;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient {
  _id: string;
  clinicId: string;
  patientUid: string;
  fullName: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  age?: number;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  emergencyContact?: string;
  allergies?: string;
  medicalHistory?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  clinicId: string;
  patientId: string | { _id: string; fullName: string; phone: string; patientUid?: string };
  doctorId: string | { _id: string; fullName: string };
  appointmentDate: string;
  tokenNumber: number;
  status: AppointmentStatus;
  chiefComplaint?: string;
  vitals?: Record<string, unknown>;
  notes?: string;
  startedAt?: string;
  completedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface QueueItem {
  _id: string;
  tokenNo: number;
  patientId: string;
  patientName: string;
  patientUid: string;
  appointmentId: string;
  doctorId: string;
  doctorName: string;
  status: AppointmentStatus;
  type: string;
  scheduledTime: string;
  checkInTime?: string;
}

export interface Vitals {
  bloodPressureSystolic?: number | null;
  bloodPressureDiastolic?: number | null;
  heartRate?: number | null;
  temperature?: number | null;
  temperatureUnit: 'F' | 'C';
  spo2?: number | null;
  respiratoryRate?: number | null;
  weight?: number | null;
  height?: number | null;
  bmi?: number | null;
}

export interface PrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  duration: string;
  instructions?: string;
  quantity?: number;
}

export interface Prescription {
  _id: string;
  clinicId: string;
  patientId: string | { _id: string; fullName: string; patientUid?: string };
  doctorId: string | { _id: string; fullName: string };
  appointmentId?: string;
  diagnosis: string;
  notes?: string;
  advice?: string;
  followUpDate?: string;
  items: PrescriptionItem[];
  tiptapContent?: Record<string, unknown>;
  createdAt: string;
  updatedAt: string;
}

export interface PrescriptionListItem {
  _id: string;
  patientName: string;
  patientUid: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  itemCount: number;
}

export interface Invoice {
  _id: string;
  clinicId: string;
  patientId: string | { _id: string; fullName: string; patientUid?: string };
  appointmentId?: string;
  invoiceNumber: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    amount: number;
  }[];
  subtotal: number;
  gstPercent: number;
  gstAmount: number;
  discount: number;
  total: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListItem {
  _id: string;
  invoiceNumber: string;
  patientName: string;
  patientUid: string;
  date: string;
  total: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
}

export interface PatientListItem {
  _id: string;
  patientUid: string;
  fullName: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth?: string;
  lastVisit?: string;
}

// ────────────────────────────────────────────
// API response wrappers
// ────────────────────────────────────────────

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface QueueResponse {
  queue: Appointment[];
  stats: {
    waiting: number;
    inConsultation: number;
    done: number;
    cancelled: number;
    noShow: number;
    total: number;
  };
}

// Auth response from server
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    fullName: string;
    phone: string;
    email?: string;
    avatarUrl?: string;
  };
  clinics: ClinicListItem[];
  activeClinicId: string;
  isNewUser: boolean;
}
