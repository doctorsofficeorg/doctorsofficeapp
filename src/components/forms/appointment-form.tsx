"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea, Modal } from "@/components/ui";
import { createAppointment } from "@/lib/actions/appointments";
import { Plus } from "lucide-react";

interface AppointmentFormProps {
  clinicId: string;
  doctorId: string;
  patients: { id: string; name: string }[];
}

export function AppointmentForm({ clinicId, doctorId, patients }: AppointmentFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const patientId = form.get("patientId") as string;
    const chiefComplaint = (form.get("chiefComplaint") as string)?.trim();

    const newErrors: Record<string, string> = {};
    if (!patientId) newErrors.patientId = "Select a patient";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const today = new Date().toISOString().split("T")[0];

    setLoading(true);
    try {
      await createAppointment({
        clinicId,
        doctorId,
        patientId,
        appointmentDate: today,
        chiefComplaint: chiefComplaint || undefined,
      });
      setOpen(false);
    } catch {
      setErrors({ form: "Failed to add to queue. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="primary" className="gap-1.5" onClick={() => setOpen(true)}>
        <Plus className="h-4 w-4" />
        Add Walk-in
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="Add Walk-in Patient" description="Add a patient to today's queue">
        <form onSubmit={handleSubmit} className="space-y-4">
          {errors.form && (
            <div className="p-3 rounded-lg bg-[var(--color-rose-50)] text-sm text-[var(--color-rose-600)]">
              {errors.form}
            </div>
          )}

          <Select
            name="patientId"
            label="Patient"
            placeholder="Select patient"
            options={patients.map((p) => ({ value: p.id, label: p.name }))}
            defaultValue=""
            error={errors.patientId}
          />

          <Textarea
            name="chiefComplaint"
            label="Chief Complaint"
            placeholder="Reason for visit..."
            rows={3}
          />

          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary" loading={loading}>
              Add to Queue
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
