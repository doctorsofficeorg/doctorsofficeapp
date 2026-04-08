"use server";

import { db } from "@/db";
import { appointments, patients } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth/session";
import { isDemoMode, demoQueue } from "@/lib/demo-data";

export interface CreateAppointmentInput {
  patientId: string;
  chiefComplaint?: string;
}

export async function createAppointment(input: CreateAppointmentInput) {
  const { clinic, doctor } = await getSessionContext();
  const today = new Date().toISOString().split("T")[0];

  const [result] = await db
    .select({ maxToken: sql<number>`COALESCE(MAX(${appointments.tokenNumber}), 0)` })
    .from(appointments)
    .where(
      and(
        eq(appointments.clinicId, clinic.id),
        eq(appointments.appointmentDate, today)
      )
    );

  const tokenNumber = (result?.maxToken ?? 0) + 1;

  const [appointment] = await db
    .insert(appointments)
    .values({
      clinicId: clinic.id,
      doctorId: doctor.id,
      patientId: input.patientId,
      appointmentDate: today,
      tokenNumber,
      status: "waiting",
      chiefComplaint: input.chiefComplaint || null,
    })
    .returning();

  revalidatePath("/appointments");
  return appointment;
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: "waiting" | "in_consultation" | "done" | "cancelled" | "no_show"
) {
  const updates: Record<string, unknown> = { status };

  if (status === "in_consultation") {
    updates.startedAt = new Date();
  } else if (status === "done") {
    updates.completedAt = new Date();
  }

  const [updated] = await db
    .update(appointments)
    .set(updates)
    .where(eq(appointments.id, appointmentId))
    .returning();

  revalidatePath("/appointments");
  return updated;
}

export async function getTodayQueue() {
  if (isDemoMode) return demoQueue;

  const { clinic } = await getSessionContext();
  const today = new Date().toISOString().split("T")[0];

  return db
    .select({
      id: appointments.id,
      tokenNumber: appointments.tokenNumber,
      status: appointments.status,
      chiefComplaint: appointments.chiefComplaint,
      startedAt: appointments.startedAt,
      completedAt: appointments.completedAt,
      createdAt: appointments.createdAt,
      patientName: patients.fullName,
      patientPhone: patients.phone,
      patientId: patients.id,
    })
    .from(appointments)
    .innerJoin(patients, eq(appointments.patientId, patients.id))
    .where(
      and(
        eq(appointments.clinicId, clinic.id),
        eq(appointments.appointmentDate, today)
      )
    )
    .orderBy(appointments.tokenNumber);
}
