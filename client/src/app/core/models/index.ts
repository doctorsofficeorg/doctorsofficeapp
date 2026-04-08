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
  name: string;
  city?: string;
  role: ClinicRole;
  branding?: ClinicBranding;
}

// ────────────────────────────────────────────
// Domain models
// ────────────────────────────────────────────

// Type aliases
export type AppointmentStatus = 'scheduled' | 'waiting' | 'in-progress' | 'completed' | 'cancelled' | 'no-show';
export type PrescriptionFrequency = 'OD' | 'BD' | 'TDS' | 'QID' | 'SOS' | 'HS' | 'stat' | 'weekly';
export type PaymentMode = 'cash' | 'upi' | 'card' | 'netbanking' | 'insurance';
export type PaymentStatus = 'pending' | 'paid' | 'partial' | 'refunded' | 'cancelled';

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

export interface Doctor {
  _id: string;
  clinicId: string;
  name: string;
  phone: string;
  email?: string;
  specialization: string;
  qualification: string;
  registrationNo: string;
  gender: 'male' | 'female' | 'other';
  avatarUrl?: string;
  isOwner: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Patient {
  _id: string;
  clinicId: string;
  patientUid: string;
  name: string;
  phone: string;
  email?: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  emergencyContact?: string;
  allergies?: string[];
  medicalHistory?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Appointment {
  _id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  patientName: string;
  doctorName: string;
  date: string;
  time: string;
  status: AppointmentStatus;
  type: string;
  notes?: string;
  tokenNo?: number;
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

export interface PrescriptionItem {
  drugName: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  duration: string;
  route: string;
  instructions?: string;
}

export interface Prescription {
  _id: string;
  clinicId: string;
  patientId: string;
  doctorId: string;
  appointmentId?: string;
  patientName: string;
  doctorName: string;
  date: string;
  diagnosis: string;
  complaints: string;
  vitals?: {
    bp?: string;
    pulse?: string;
    temp?: string;
    weight?: string;
    spo2?: string;
  };
  items: PrescriptionItem[];
  advice?: string;
  followUpDate?: string;
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
  patientId: string;
  doctorId: string;
  prescriptionId?: string;
  invoiceNo: string;
  patientName: string;
  doctorName: string;
  date: string;
  items: {
    description: string;
    quantity: number;
    rate: number;
    amount: number;
    hsnCode?: string;
  }[];
  subtotal: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalTax: number;
  discount: number;
  grandTotal: number;
  paymentMode: PaymentMode;
  paymentStatus: PaymentStatus;
  gstin?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceListItem {
  _id: string;
  invoiceNo: string;
  patientName: string;
  patientUid: string;
  date: string;
  grandTotal: number;
  paymentStatus: PaymentStatus;
  paymentMode: PaymentMode;
}

export interface PatientListItem {
  _id: string;
  patientUid: string;
  name: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: string;
  lastVisit?: string;
}
