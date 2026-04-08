import mongoose, { Schema, Document, Types } from "mongoose";

export interface IClinicBranding {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  theme: "light" | "dark";
  headerText?: string;
  footerText?: string;
}

export interface IClinic extends Document {
  _id: Types.ObjectId;
  name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  phone: string;
  email: string;
  gstin?: string;
  region: "india" | "us" | "eu";
  branding: IClinicBranding;
  /** Owner user ID — the user who created this clinic */
  ownerId: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const brandingSchema = new Schema<IClinicBranding>(
  {
    logoUrl: { type: String, trim: true },
    primaryColor: { type: String, default: "#0d9488" },
    secondaryColor: { type: String, default: "#6366f1" },
    accentColor: { type: String, default: "#f59e0b" },
    theme: { type: String, enum: ["light", "dark"], default: "light" },
    headerText: { type: String, trim: true },
    footerText: { type: String, trim: true },
  },
  { _id: false }
);

const clinicSchema = new Schema<IClinic>(
  {
    name: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    gstin: { type: String, trim: true },
    region: {
      type: String,
      enum: ["india", "us", "eu"],
      default: "india",
      required: true,
    },
    branding: { type: brandingSchema, default: () => ({}) },
    ownerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const Clinic = mongoose.model<IClinic>("Clinic", clinicSchema);
