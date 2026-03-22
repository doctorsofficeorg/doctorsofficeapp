"use server";

import { db } from "@/db";
import { prescriptions, prescriptionItems, patients } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth/session";

export interface PrescriptionItemInput {
  medicineName: string;
  dosage: string;
  frequency: "OD" | "BD" | "TDS" | "QID" | "SOS" | "HS" | "STAT" | "PRN";
  duration: string;
  instructions?: string;
  quantity?: number;
}

export interface CreatePrescriptionInput {
  patientId: string;
  appointmentId: string;
  diagnosis: string;
  notes?: string;
  advice?: string;
  followUpDate?: string;
  items: PrescriptionItemInput[];
}

export async function createPrescription(input: CreatePrescriptionInput) {
  const { clinic, doctor } = await getSessionContext();

  const [prescription] = await db
    .insert(prescriptions)
    .values({
      clinicId: clinic.id,
      doctorId: doctor.id,
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

export async function getPrescriptions() {
  const { clinic } = await getSessionContext();

  return db
    .select({
      id: prescriptions.id,
      diagnosis: prescriptions.diagnosis,
      createdAt: prescriptions.createdAt,
      patientName: patients.fullName,
      patientPhone: patients.phone,
    })
    .from(prescriptions)
    .innerJoin(patients, eq(prescriptions.patientId, patients.id))
    .where(eq(prescriptions.clinicId, clinic.id))
    .orderBy(desc(prescriptions.createdAt));
}

export async function getPrescriptionWithItems(prescriptionId: string) {
  const [prescription] = await db
    .select()
    .from(prescriptions)
    .where(eq(prescriptions.id, prescriptionId));

  const items = await db
    .select()
    .from(prescriptionItems)
    .where(eq(prescriptionItems.prescriptionId, prescriptionId));

  return { prescription, items };
}
