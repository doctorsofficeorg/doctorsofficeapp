import { db } from "@/db";
import { clinics, doctors } from "@/db/schema";
import { eq } from "drizzle-orm";
import { createClient } from "@/lib/supabase/server";
import { isDemoMode, demoClinic, demoDoctor } from "@/lib/demo-data";

/**
 * Get the current clinic and doctor context from the authenticated user.
 * Auto-provisions a clinic and doctor profile on first login.
 */
export async function getSessionContext() {
  if (isDemoMode) {
    return { clinic: demoClinic, doctor: demoDoctor, user: null };
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Not authenticated");
  }

  // Try to find existing doctor by Supabase user ID
  let [doctor] = await db
    .select()
    .from(doctors)
    .where(eq(doctors.userId, user.id))
    .limit(1);

  if (doctor) {
    const [clinic] = await db
      .select()
      .from(clinics)
      .where(eq(clinics.id, doctor.clinicId));
    return { clinic: clinic!, doctor, user };
  }

  // First login — auto-provision clinic + doctor
  const fullName =
    user.user_metadata?.full_name || user.email?.split("@")[0] || "Doctor";
  const email = user.email || "";

  const [clinic] = await db
    .insert(clinics)
    .values({
      name: `${fullName}'s Clinic`,
      address: "Update your clinic address",
      city: "City",
      state: "State",
      pincode: "000000",
      phone: "",
      email,
      region: "india",
    })
    .returning();

  [doctor] = await db
    .insert(doctors)
    .values({
      clinicId: clinic.id,
      userId: user.id,
      fullName,
      qualification: "MBBS",
      registrationNumber: "UPDATE-REG-NO",
      specialization: "General Medicine",
      phone: "",
      email,
    })
    .returning();

  return { clinic, doctor, user };
}
