import mongoose, { Schema, Document, Types } from "mongoose";

export type PrescriptionFrequency = "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS" | "STAT" | "PRN";

export interface IPrescriptionItem {
  medicineName: string;
  dosage: string;
  frequency: PrescriptionFrequency;
  duration: string;
  instructions?: string;
  quantity?: number;
}

export interface IPrescription extends Document {
  _id: Types.ObjectId;
  clinicId: Types.ObjectId;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  appointmentId: Types.ObjectId;
  diagnosis: string;
  notes?: string;
  advice?: string;
  followUpDate?: Date;
  items: IPrescriptionItem[];
  tiptapContent?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const prescriptionItemSchema = new Schema<IPrescriptionItem>(
  {
    medicineName: { type: String, required: true, trim: true },
    dosage: { type: String, required: true, trim: true },
    frequency: {
      type: String,
      enum: ["OD", "BD", "TDS", "QID", "SOS", "HS", "STAT", "PRN"],
      required: true,
    },
    duration: { type: String, required: true, trim: true },
    instructions: { type: String, trim: true },
    quantity: { type: Number },
  },
  { _id: false }
);

const prescriptionSchema = new Schema<IPrescription>(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true, index: true },
    doctorId: { type: Schema.Types.ObjectId, ref: "Doctor", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    appointmentId: { type: Schema.Types.ObjectId, ref: "Appointment", required: true, index: true },
    diagnosis: { type: String, required: true, trim: true },
    notes: { type: String },
    advice: { type: String },
    followUpDate: { type: Date },
    items: { type: [prescriptionItemSchema], default: [] },
    tiptapContent: { type: Schema.Types.Mixed },
  },
  { timestamps: true }
);

export const Prescription = mongoose.model<IPrescription>("Prescription", prescriptionSchema);
