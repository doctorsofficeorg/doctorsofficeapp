"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea, Modal } from "@/components/ui";
import { createPatient, type CreatePatientInput } from "@/lib/actions/patients";
import { UserPlus } from "lucide-react";

const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "other", label: "Other" },
];

const BLOOD_GROUP_OPTIONS = [
  { value: "", label: "Unknown" },
  { value: "A+", label: "A+" },
  { value: "A-", label: "A-" },
  { value: "B+", label: "B+" },
  { value: "B-", label: "B-" },
  { value: "AB+", label: "AB+" },
  { value: "AB-", label: "AB-" },
  { value: "O+", label: "O+" },
  { value: "O-", label: "O-" },
];

export function PatientForm() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const fullName = (form.get("fullName") as string).trim();
    const phone = (form.get("phone") as string).trim();
    const gender = form.get("gender") as string;

    const newErrors: Record<string, string> = {};
    if (!fullName) newErrors.fullName = "Name is required";
    if (!phone) newErrors.phone = "Phone number is required";
    if (!gender) newErrors.gender = "Gender is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const input: CreatePatientInput = {
      fullName,
      phone,
      gender: gender as "male" | "female" | "other",
      email: (form.get("email") as string)?.trim() || undefined,
      dateOfBirth: (form.get("dateOfBirth") as string) || undefined,
      age: form.get("age") ? Number(form.get("age")) : undefined,
      bloodGroup: (form.get("bloodGroup") as string) || undefined,
      address: (form.get("address") as string)?.trim() || undefined,
      emergencyContact: (form.get("emergencyContact") as string)?.trim() || undefined,
      medicalHistory: (form.get("medicalHistory") as string)?.trim() || undefined,
      allergies: (form.get("allergies") as string)?.trim() || undefined,
      notes: (form.get("notes") as string)?.trim() || undefined,
    };

    setLoading(true);
    try {
      await createPatient(input);
      setOpen(false);
    } catch {
      setErrors({ form: "Failed to create patient. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="primary" className="gap-1.5" onClick={() => setOpen(true)}>
        <UserPlus className="h-4 w-4" />
        New Patient
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="New Patient" description="Register a new patient" size="lg">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-3 rounded-lg bg-[var(--color-rose-50)] text-sm text-[var(--color-rose-600)]">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="fullName" label="Full Name" placeholder="Patient's full name" required error={errors.fullName} />
            <Input name="phone" label="Phone Number" placeholder="9876543210" type="tel" required error={errors.phone} />
            <Select name="gender" label="Gender" options={GENDER_OPTIONS} placeholder="Select gender" defaultValue="" error={errors.gender} />
            <Input name="email" label="Email" placeholder="patient@example.com" type="email" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input name="dateOfBirth" label="Date of Birth" type="date" />
            <Input name="age" label="Age" type="number" placeholder="e.g. 45" min={0} max={150} />
            <Select name="bloodGroup" label="Blood Group" options={BLOOD_GROUP_OPTIONS} defaultValue="" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input name="emergencyContact" label="Emergency Contact" placeholder="Phone number" type="tel" />
            <Input name="address" label="Address" placeholder="Street, city" />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea name="medicalHistory" label="Medical History" placeholder="Known conditions, surgeries..." rows={3} />
            <Textarea name="allergies" label="Allergies" placeholder="Drug or food allergies..." rows={3} />
          </div>

          <Textarea name="notes" label="Notes" placeholder="Any additional notes..." rows={2} />

          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Register Patient
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
