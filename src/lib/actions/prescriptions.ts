"use server";

import { db } from "@/db";
import { prescriptions, prescriptionItems } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface PrescriptionItemInput {
  medicineName: string;
  dosage: string;
  frequency: "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS" | "STAT" | "PRN";
  duration: string;
  instructions?: string;
  quantity?: number;
}

export interface CreatePrescriptionInput {
  clinicId: string;
  doctorId: string;
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  notes?: string;
  advice?: string;
  followUpDate?: string;
  items: PrescriptionItemInput[];
}

export async function createPrescription(input: CreatePrescriptionInput) {
  const [prescription] = await db
    .insert(prescriptions)
    .values({
      clinicId: input.clinicId,
      doctorId: input.doctorId,
      patientId: input.patientId,
      appointmentId: input.appointmentId,
      diagnosis: input.diagnosis,
      notes: input.notes || null,
      advice: input.advice || null,
      followUpDate: input.followUpDate || null,
    })
    .returning();

  if (input.items.length > 0) {
    await db.insert(prescriptionItems).values(
      input.items.map((item) => ({
        prescriptionId: prescription.id,
        medicineName: item.medicineName,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
        instructions: item.instructions || null,
        quantity: item.quantity || null,
      }))
    );
  }

  revalidatePath("/prescriptions");
  return prescription;
}

export async function getPrescriptions(clinicId: string) {
  return db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.clinicId, clinicId))
    .orderBy(desc(prescriptions.createdAt));
}
