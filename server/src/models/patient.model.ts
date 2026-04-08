import mongoose, { Schema, Document, Types } from "mongoose";

export interface IPatient extends Document {
  _id: Types.ObjectId;
  clinicId: Types.ObjectId;
  patientUid: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: Date;
  age?: number;
  gender?: "male" | "female" | "other" | "prefer_not_to_say";
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const patientSchema = new Schema<IPatient>(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true, index: true },
    patientUid: { type: String, required: true, unique: true },
    fullName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    dateOfBirth: { type: Date },
    age: { type: Number },
    gender: {
      type: String,
      enum: ["male", "female", "other", "prefer_not_to_say"],
    },
    bloodGroup: { type: String, trim: true },
    address: { type: String, trim: true },
    emergencyContact: { type: String, trim: true },
    medicalHistory: { type: String },
    allergies: { type: String },
    notes: { type: String },
  },
  { timestamps: true }
);

patientSchema.index({ clinicId: 1, phone: 1 });
patientSchema.index({ clinicId: 1, fullName: "text" });

/**
 * Auto-generate patientUid before saving (PT-XXXXX format).
 */
patientSchema.pre("validate", async function (next) {
  if (this.isNew && !this.patientUid) {
    const count = await mongoose.model("Patient").countDocuments({ clinicId: this.clinicId });
    this.patientUid = `PT-${String(count + 1).padStart(5, "0")}`;
  }
  next();
});

export const Patient = mongoose.model<IPatient>("Patient", patientSchema);
