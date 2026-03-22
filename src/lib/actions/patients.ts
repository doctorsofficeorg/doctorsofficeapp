"use server";

import { db } from "@/db";
import { patients } from "@/db/schema";
import { eq, and, ilike, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface CreatePatientInput {
  clinicId: string;
  fullName: string;
  phone: string;
  email?: string;
  dateOfBirth?: string;
  age?: number;
  gender: "male" | "female" | "other";
  bloodGroup?: string;
  address?: string;
  emergencyContact?: string;
  medicalHistory?: string;
  allergies?: string;
  notes?: string;
}

function generatePatientUid(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let uid = "PT-";
  for (let i = 0; i < 5; i++) {
    uid += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return uid;
}

export async function createPatient(input: CreatePatientInput) {
  const patientUid = generatePatientUid();

  const [patient] = await db
    .insert(patients)
    .values({
      clinicId: input.clinicId,
      patientUid,
      fullName: input.fullName,
      phone: input.phone,
      email: input.email || null,
      dateOfBirth: input.dateOfBirth || null,
      age: input.age || null,
      gender: input.gender,
      bloodGroup: input.bloodGroup || null,
      address: input.address || null,
      emergencyContact: input.emergencyContact || null,
      medicalHistory: input.medicalHistory || null,
      allergies: input.allergies || null,
      notes: input.notes || null,
    })
    .returning();

  revalidatePath("/patients");
  return patient;
}

export async function getPatients(clinicId: string, search?: string) {
  const conditions = [eq(patients.clinicId, clinicId)];

  if (search) {
    conditions.push(
      ilike(patients.fullName, `%${search}%`)
    );
  }

  return db
    .select()
    .from(patients)
    .where(and(...conditions))
    .orderBy(desc(patients.createdAt));
}
