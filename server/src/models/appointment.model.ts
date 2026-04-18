import mongoose, { Schema, Document, Types } from "mongoose";

export type AppointmentStatus = "waiting" | "in_consultation" | "done" | "cancelled" | "no_show";

export interface IAppointment extends Document {
  _id: Types.ObjectId;
  clinicId: Types.ObjectId;
  doctorId: Types.ObjectId;
  patientId: Types.ObjectId;
  appointmentDate: Date;
  tokenNumber: number;
  status: AppointmentStatus;
  chiefComplaint?: string;
  vitals?: Record<string, unknown>;
  notes?: string;
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const appointmentSchema = new Schema<IAppointment>(
  {
    clinicId: { type: Schema.Types.ObjectId, ref: "Clinic", required: true, index: true },
    // Doctor identity is derived from User + ClinicMembership; there's no
    // dedicated `Doctor` Mongoose model in this multi-tenant setup, so we
    // reference `User` for populate() compatibility.
    doctorId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    patientId: { type: Schema.Types.ObjectId, ref: "Patient", required: true, index: true },
    appointmentDate: { type: Date, required: true, index: true },
    tokenNumber: { type: Number, required: true },
    status: {
      type: String,
      enum: ["waiting", "in_consultation", "done", "cancelled", "no_show"],
      default: "waiting",
      required: true,
    },
    chiefComplaint: { type: String, trim: true },
    vitals: { type: Schema.Types.Mixed },
    notes: { type: String },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

appointmentSchema.index({ clinicId: 1, appointmentDate: 1 });
appointmentSchema.index({ doctorId: 1, appointmentDate: 1 });

export const Appointment = mongoose.model<IAppointment>("Appointment", appointmentSchema);
