/**
 * Demo/mock data for running the app without a database connection.
 * Used when NEXT_PUBLIC_SUPABASE_URL or DATABASE_URL is not set.
 */

export const isDemoMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.DATABASE_URL;

const now = new Date();
const today = now.toISOString().split("T")[0];

// --- Clinic & Doctor ---

export const demoClinic = {
  id: "00000000-0000-0000-0000-000000000001",
  name: "City Health Clinic",
  address: "42, MG Road, Koramangala",
  city: "Bangalore",
  state: "Karnataka",
  pincode: "560034",
  phone: "+91 98765 43210",
  email: "clinic@cityhealth.in",
  gstin: null,
  logoUrl: null,
  region: "india" as const,
  createdAt: now,
  updatedAt: now,
};

export const demoDoctor = {
  id: "00000000-0000-0000-0000-000000000002",
  clinicId: demoClinic.id,
  userId: "00000000-0000-0000-0000-000000000099",
  fullName: "Dr. Rajiv Mehta",
  qualification: "MBBS, MD (General Medicine)",
  registrationNumber: "KMC-78543",
  specialization: "General Medicine",
  phone: "+91 99887 76655",
  email: "dr.rajiv@cityhealth.in",
  signatureUrl: null,
  createdAt: now,
};

// --- Patients ---

export const demoPatients = [
  {
    id: "00000000-0000-0000-0000-000000000010",
    clinicId: demoClinic.id,
    patientUid: "PT-A1B2C",
    fullName: "Ananya Sharma",
    phone: "+91 98765 00001",
    email: "ananya@email.com",
    dateOfBirth: "1990-05-14",
    age: 35,
    gender: "female" as const,
    bloodGroup: "B+",
    address: "12, Indiranagar, Bangalore",
    emergencyContact: "+91 98765 00099",
    medicalHistory: "No significant history",
    allergies: "Penicillin",
    notes: null,
    createdAt: new Date(Date.now() - 30 * 86400000),
    updatedAt: new Date(Date.now() - 30 * 86400000),
  },
  {
    id: "00000000-0000-0000-0000-000000000011",
    clinicId: demoClinic.id,
    patientUid: "PT-D3E4F",
    fullName: "Rahul Verma",
    phone: "+91 98765 00002",
    email: null,
    dateOfBirth: "1985-11-22",
    age: 40,
    gender: "male" as const,
    bloodGroup: "O+",
    address: "56, HSR Layout, Bangalore",
    emergencyContact: null,
    medicalHistory: "Hypertension (controlled)",
    allergies: null,
    notes: "Regular check-up patient",
    createdAt: new Date(Date.now() - 20 * 86400000),
    updatedAt: new Date(Date.now() - 20 * 86400000),
  },
  {
    id: "00000000-0000-0000-0000-000000000012",
    clinicId: demoClinic.id,
    patientUid: "PT-G5H6I",
    fullName: "Priya Nair",
    phone: "+91 98765 00003",
    email: "priya.nair@email.com",
    dateOfBirth: "1978-03-08",
    age: 48,
    gender: "female" as const,
    bloodGroup: "A+",
    address: "8, Jayanagar, Bangalore",
    emergencyContact: "+91 98765 00088",
    medicalHistory: "Type 2 Diabetes",
    allergies: "Sulfa drugs",
    notes: null,
    createdAt: new Date(Date.now() - 15 * 86400000),
    updatedAt: new Date(Date.now() - 15 * 86400000),
  },
  {
    id: "00000000-0000-0000-0000-000000000013",
    clinicId: demoClinic.id,
    patientUid: "PT-J7K8L",
    fullName: "Mohammed Ismail",
    phone: "+91 98765 00004",
    email: null,
    dateOfBirth: "1995-07-30",
    age: 30,
    gender: "male" as const,
    bloodGroup: "AB+",
    address: "23, Whitefield, Bangalore",
    emergencyContact: null,
    medicalHistory: null,
    allergies: null,
    notes: null,
    createdAt: new Date(Date.now() - 5 * 86400000),
    updatedAt: new Date(Date.now() - 5 * 86400000),
  },
  {
    id: "00000000-0000-0000-0000-000000000014",
    clinicId: demoClinic.id,
    patientUid: "PT-M9N0P",
    fullName: "Lakshmi Devi",
    phone: "+91 98765 00005",
    email: null,
    dateOfBirth: "1960-12-01",
    age: 65,
    gender: "female" as const,
    bloodGroup: "O-",
    address: "45, Malleshwaram, Bangalore",
    emergencyContact: "+91 98765 00077",
    medicalHistory: "Osteoarthritis, Hypertension",
    allergies: "Aspirin",
    notes: "Elderly, needs assistance",
    createdAt: new Date(Date.now() - 2 * 86400000),
    updatedAt: new Date(Date.now() - 2 * 86400000),
  },
];

// --- Today's Queue ---

export const demoQueue = [
  {
    id: "00000000-0000-0000-0000-000000000020",
    tokenNumber: 1,
    status: "done" as const,
    chiefComplaint: "Fever and headache for 2 days",
    startedAt: new Date(Date.now() - 3600000),
    completedAt: new Date(Date.now() - 1800000),
    createdAt: new Date(Date.now() - 7200000),
    patientName: "Ananya Sharma",
    patientPhone: "+91 98765 00001",
    patientId: demoPatients[0].id,
  },
  {
    id: "00000000-0000-0000-0000-000000000021",
    tokenNumber: 2,
    status: "in_consultation" as const,
    chiefComplaint: "Follow-up for blood pressure",
    startedAt: new Date(Date.now() - 600000),
    completedAt: null,
    createdAt: new Date(Date.now() - 5400000),
    patientName: "Rahul Verma",
    patientPhone: "+91 98765 00002",
    patientId: demoPatients[1].id,
  },
  {
    id: "00000000-0000-0000-0000-000000000022",
    tokenNumber: 3,
    status: "waiting" as const,
    chiefComplaint: "Diabetes routine check-up",
    startedAt: null,
    completedAt: null,
    createdAt: new Date(Date.now() - 3600000),
    patientName: "Priya Nair",
    patientPhone: "+91 98765 00003",
    patientId: demoPatients[2].id,
  },
  {
    id: "00000000-0000-0000-0000-000000000023",
    tokenNumber: 4,
    status: "waiting" as const,
    chiefComplaint: "Sore throat and cough",
    startedAt: null,
    completedAt: null,
    createdAt: new Date(Date.now() - 1800000),
    patientName: "Mohammed Ismail",
    patientPhone: "+91 98765 00004",
    patientId: demoPatients[3].id,
  },
  {
    id: "00000000-0000-0000-0000-000000000024",
    tokenNumber: 5,
    status: "waiting" as const,
    chiefComplaint: "Knee pain, difficulty walking",
    startedAt: null,
    completedAt: null,
    createdAt: new Date(Date.now() - 900000),
    patientName: "Lakshmi Devi",
    patientPhone: "+91 98765 00005",
    patientId: demoPatients[4].id,
  },
];

// --- Prescriptions ---

export const demoPrescriptions = [
  {
    id: "00000000-0000-0000-0000-000000000030",
    diagnosis: "Acute viral fever with tension headache",
    createdAt: new Date(Date.now() - 1800000),
    patientName: "Ananya Sharma",
    patientPhone: "+91 98765 00001",
  },
  {
    id: "00000000-0000-0000-0000-000000000031",
    diagnosis: "Essential hypertension - controlled",
    createdAt: new Date(Date.now() - 86400000),
    patientName: "Rahul Verma",
    patientPhone: "+91 98765 00002",
  },
  {
    id: "00000000-0000-0000-0000-000000000032",
    diagnosis: "Type 2 Diabetes Mellitus - routine follow-up",
    createdAt: new Date(Date.now() - 3 * 86400000),
    patientName: "Priya Nair",
    patientPhone: "+91 98765 00003",
  },
  {
    id: "00000000-0000-0000-0000-000000000033",
    diagnosis: "Osteoarthritis of bilateral knees",
    createdAt: new Date(Date.now() - 5 * 86400000),
    patientName: "Lakshmi Devi",
    patientPhone: "+91 98765 00005",
  },
];

// --- Invoices ---

export const demoInvoices = [
  {
    id: "00000000-0000-0000-0000-000000000040",
    invoiceNumber: "INV-0001",
    subtotal: "500.00",
    gstPercent: "18.00",
    gstAmount: "90.00",
    discount: "0.00",
    total: "590.00",
    paymentMode: "upi" as const,
    paymentStatus: "paid" as const,
    createdAt: new Date(),
    patientName: "Ananya Sharma",
    patientPhone: "+91 98765 00001",
  },
  {
    id: "00000000-0000-0000-0000-000000000041",
    invoiceNumber: "INV-0002",
    subtotal: "800.00",
    gstPercent: "18.00",
    gstAmount: "144.00",
    discount: "50.00",
    total: "894.00",
    paymentMode: "cash" as const,
    paymentStatus: "paid" as const,
    createdAt: new Date(),
    patientName: "Rahul Verma",
    patientPhone: "+91 98765 00002",
  },
  {
    id: "00000000-0000-0000-0000-000000000042",
    invoiceNumber: "INV-0003",
    subtotal: "1200.00",
    gstPercent: "18.00",
    gstAmount: "216.00",
    discount: "0.00",
    total: "1416.00",
    paymentMode: "card" as const,
    paymentStatus: "pending" as const,
    createdAt: new Date(Date.now() - 86400000),
    patientName: "Priya Nair",
    patientPhone: "+91 98765 00003",
  },
  {
    id: "00000000-0000-0000-0000-000000000043",
    invoiceNumber: "INV-0004",
    subtotal: "350.00",
    gstPercent: "18.00",
    gstAmount: "63.00",
    discount: "0.00",
    total: "413.00",
    paymentMode: "upi" as const,
    paymentStatus: "paid" as const,
    createdAt: new Date(Date.now() - 3 * 86400000),
    patientName: "Mohammed Ismail",
    patientPhone: "+91 98765 00004",
  },
];

// --- Patients list (for dropdowns) ---

export const demoPatientsList = demoPatients.map((p) => ({
  id: p.id,
  name: p.fullName,
}));
