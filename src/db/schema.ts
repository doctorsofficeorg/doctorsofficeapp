import {
  pgTable,
  uuid,
  text,
  varchar,
  timestamp,
  integer,
  numeric,
  date,
  jsonb,
  pgEnum,
  serial,
} from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================

export const genderEnum = pgEnum("gender", ["male", "female", "other"]);

export const appointmentStatusEnum = pgEnum("appointment_status", [
  "waiting",
  "in_consultation",
  "done",
  "cancelled",
  "no_show",
]);

export const paymentModeEnum = pgEnum("payment_mode", [
  "cash",
  "upi",
  "card",
  "insurance",
  "other",
]);

export const paymentStatusEnum = pgEnum("payment_status", [
  "paid",
  "pending",
  "partial",
]);

export const regionEnum = pgEnum("region", ["india", "us", "eu"]);

export const prescriptionFrequencyEnum = pgEnum("prescription_frequency", [
  "OD",
  "BD",
  "TDS",
  "QID",
  "SOS",
  "HS",
  "STAT",
  "PRN",
]);

// ============================================
// TABLES
// ============================================

export const clinics = pgTable("clinics", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: varchar("name", { length: 255 }).notNull(),
  address: text("address").notNull(),
  city: varchar("city", { length: 100 }).notNull(),
  state: varchar("state", { length: 100 }).notNull(),
  pincode: varchar("pincode", { length: 10 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  gstin: varchar("gstin", { length: 20 }),
  logoUrl: text("logo_url"),
  region: regionEnum("region").notNull().default("india"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(), // Supabase auth.users id
  fullName: varchar("full_name", { length: 255 }).notNull(),
  qualification: varchar("qualification", { length: 255 }).notNull(),
  registrationNumber: varchar("registration_number", { length: 100 }).notNull(),
  specialization: varchar("specialization", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }).notNull(),
  signatureUrl: text("signature_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const patients = pgTable("patients", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  patientUid: varchar("patient_uid", { length: 20 }).notNull(),
  fullName: varchar("full_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }).notNull(),
  email: varchar("email", { length: 255 }),
  dateOfBirth: date("date_of_birth"),
  age: integer("age"),
  gender: genderEnum("gender").notNull(),
  bloodGroup: varchar("blood_group", { length: 5 }),
  address: text("address"),
  emergencyContact: varchar("emergency_contact", { length: 20 }),
  medicalHistory: text("medical_history"),
  allergies: text("allergies"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  appointmentDate: date("appointment_date").notNull(),
  tokenNumber: integer("token_number").notNull(),
  status: appointmentStatusEnum("status").notNull().default("waiting"),
  chiefComplaint: text("chief_complaint"),
  vitals: jsonb("vitals"),
  notes: text("notes"),
  startedAt: timestamp("started_at", { withTimezone: true }),
  completedAt: timestamp("completed_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const prescriptions = pgTable("prescriptions", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  doctorId: uuid("doctor_id").notNull().references(() => doctors.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  appointmentId: uuid("appointment_id").notNull().references(() => appointments.id, { onDelete: "cascade" }),
  diagnosis: text("diagnosis").notNull(),
  notes: text("notes"),
  advice: text("advice"),
  followUpDate: date("follow_up_date"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const prescriptionItems = pgTable("prescription_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  prescriptionId: uuid("prescription_id").notNull().references(() => prescriptions.id, { onDelete: "cascade" }),
  medicineName: varchar("medicine_name", { length: 255 }).notNull(),
  dosage: varchar("dosage", { length: 100 }).notNull(),
  frequency: prescriptionFrequencyEnum("frequency").notNull(),
  duration: varchar("duration", { length: 50 }).notNull(),
  instructions: text("instructions"),
  quantity: integer("quantity"),
});

export const invoices = pgTable("invoices", {
  id: uuid("id").primaryKey().defaultRandom(),
  clinicId: uuid("clinic_id").notNull().references(() => clinics.id, { onDelete: "cascade" }),
  patientId: uuid("patient_id").notNull().references(() => patients.id, { onDelete: "cascade" }),
  appointmentId: uuid("appointment_id").references(() => appointments.id, { onDelete: "set null" }),
  invoiceNumber: varchar("invoice_number", { length: 50 }).notNull(),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  gstPercent: numeric("gst_percent", { precision: 5, scale: 2 }).notNull().default("0"),
  gstAmount: numeric("gst_amount", { precision: 10, scale: 2 }).notNull().default("0"),
  discount: numeric("discount", { precision: 10, scale: 2 }).notNull().default("0"),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  paymentMode: paymentModeEnum("payment_mode").notNull(),
  paymentStatus: paymentStatusEnum("payment_status").notNull().default("pending"),
  notes: text("notes"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const invoiceItems = pgTable("invoice_items", {
  id: uuid("id").primaryKey().defaultRandom(),
  invoiceId: uuid("invoice_id").notNull().references(() => invoices.id, { onDelete: "cascade" }),
  description: varchar("description", { length: 255 }).notNull(),
  quantity: integer("quantity").notNull(),
  unitPrice: numeric("unit_price", { precision: 10, scale: 2 }).notNull(),
  amount: numeric("amount", { precision: 10, scale: 2 }).notNull(),
});
