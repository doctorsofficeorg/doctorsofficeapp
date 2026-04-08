import mongoose, { Schema, Document, Types } from "mongoose";

export type ClinicRole = "owner" | "doctor" | "nurse" | "lab_tech" | "front_desk";

export const CLINIC_ROLES: ClinicRole[] = ["owner", "doctor", "nurse", "lab_tech", "front_desk"];

/**
 * Default permissions per role.
 * These can be overridden per membership for fine-grained control.
 */
export const DEFAULT_PERMISSIONS: Record<ClinicRole, string[]> = {
  owner: [
    "clinic:manage", "clinic:delete",
    "members:manage", "members:invite", "members:remove",
    "patients:read", "patients:write", "patients:delete",
    "appointments:read", "appointments:write", "appointments:delete",
    "prescriptions:read", "prescriptions:write", "prescriptions:delete",
    "invoices:read", "invoices:write", "invoices:delete",
    "settings:manage", "reports:read",
  ],
  doctor: [
    "patients:read", "patients:write",
    "appointments:read", "appointments:write",
    "prescriptions:read", "prescriptions:write",
    "invoices:read", "invoices:write",
    "reports:read",
  ],
  nurse: [
    "patients:read", "patients:write",
    "appointments:read", "appointments:write",
    "prescriptions:read",
    "invoices:read",
  ],
  lab_tech: [
    "patients:read",
    "appointments:read",
    "prescriptions:read",
  ],
  front_desk: [
    "patients:read", "patients:write",
    "appointments:read", "appointments:write",
    "invoices:read", "invoices:write",
  ],
};

export interface IClinicMembership extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  clinicId: Types.ObjectId;
  role: ClinicRole;
  permissions: string[];
  /** Professional details (for doctors/nurses) */
  qualification?: string;
  registrationNumber?: string;
  specialization?: string;
  signatureUrl?: string;
  isActive: boolean;
  invitedBy?: Types.ObjectId;
  joinedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const clinicMembershipSchema = new Schema<IClinicMembership>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true, index: true },
    role: {
      type: String,
      enum: CLINIC_ROLES,
      required: true,
      default: "doctor",
    },
    permissions: [{ type: String }],
    qualification: { type: String, trim: true },
    registrationNumber: { type: String, trim: true },
    specialization: { type: String, trim: true },
    signatureUrl: { type: String, trim: true },
    isActive: { type: Boolean, default: true },
    invitedBy: { type: Schema.Types.ObjectId, ref: "User" },
    joinedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// A user can only have one membership per clinic
clinicMembershipSchema.index({ userId: 1, clinicId: 1 }, { unique: true });
// Fast lookups: all members of a clinic, all clinics of a user
clinicMembershipSchema.index({ clinicId: 1, role: 1 });

export const ClinicMembership = mongoose.model<IClinicMembership>(
  "ClinicMembership",
  clinicMembershipSchema
);
