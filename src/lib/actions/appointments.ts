"use server";

import { db } from "@/db";
import { appointments } from "@/db/schema";
import { eq, and, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface CreateAppointmentInput {
  clinicId: string;
  doctorId: string;
  patientId: string;
  appointmentDate: string;
  chiefComplaint?: string;
}

export async function createAppointment(input: CreateAppointmentInput) {
  // Get the next token number for this clinic + date
  const [result] = await db
    .select({ maxToken: sql<number>`COALESCE(MAX(${appointments.tokenNumber}), 0)` })
    .from(appointments)
    .where(
      and(
        eq(appointments.clinicId, input.clinicId),
        eq(appointments.appointmentDate, input.appointmentDate)
      )
    );

  const tokenNumber = (result?.maxToken ?? 0) + 1;

  const [appointment] = await db
    .insert(appointments)
    .values({
      clinicId: input.clinicId,
      doctorId: input.doctorId,
      patientId: input.patientId,
      appointmentDate: input.appointmentDate,
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

export async function getTodayQueue(clinicId: string) {
  const today = new Date().toISOString().split("T")[0];

  return db
    .select()
    .from(appointments)
    .where(
      and(
        eq(appointments.clinicId, clinicId),
        eq(appointments.appointmentDate, today)
      )
    )
    .orderBy(appointments.tokenNumber);
}
