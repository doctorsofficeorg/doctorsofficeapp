import { db } from "@/db";
import { clinics, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Get the current clinic and doctor context.
 * TODO: Once auth is wired, this will use the Supabase user session
 * to look up the doctor's clinic. For now, returns the first clinic/doctor.
 */
export async function getSessionContext() {
  const [doctor] = await db.select().from(doctors).limit(1);

  if (!doctor) {
    throw new Error("No doctor found. Run the seed script first.");
  }

  const [clinic] = await db
    .select()
    .from(clinics)
    .where(eq(clinics.id, doctor.clinicId));

  if (!clinic) {
    throw new Error("No clinic found for doctor.");
  }

  return { clinic, doctor };
}
