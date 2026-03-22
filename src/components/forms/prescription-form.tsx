"use client";

import { useState } from "react";
import { Button, Input, Select, Textarea, Modal } from "@/components/ui";
import { createPrescription, type PrescriptionItemInput } from "@/lib/actions/prescriptions";
import { Plus, Trash2, FileText } from "lucide-react";

const FREQUENCY_OPTIONS = [
  { value: "OD", label: "OD — Once daily" },
  { value: "BD", label: "BD — Twice daily" },
  { value: "TDS", label: "TDS — Thrice daily" },
  { value: "QID", label: "QID — Four times daily" },
  { value: "SOS", label: "SOS — As needed" },
  { value: "HS", label: "HS — At bedtime" },
  { value: "STAT", label: "STAT — Immediately" },
  { value: "PRN", label: "PRN — When required" },
];

interface PrescriptionFormProps {
  patients: { id: string; name: string }[];
  appointments: { id: string; patientId: string; label: string }[];
}

const emptyItem: PrescriptionItemInput = {
  medicineName: "",
  dosage: "",
  frequency: "OD",
  duration: "",
};

export function PrescriptionForm({ patients, appointments }: PrescriptionFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<PrescriptionItemInput[]>([{ ...emptyItem }]);

  function addItem() {
    setItems([...items, { ...emptyItem }]);
  }

  function removeItem(index: number) {
    if (items.length === 1) return;
    setItems(items.filter((_, i) => i !== index));
  }

  function updateItem(index: number, field: keyof PrescriptionItemInput, value: string | number) {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const patientId = form.get("patientId") as string;
    const appointmentId = form.get("appointmentId") as string;
    const diagnosis = (form.get("diagnosis") as string).trim();

    const newErrors: Record<string, string> = {};
    if (!patientId) newErrors.patientId = "Select a patient";
    if (!appointmentId) newErrors.appointmentId = "Select an appointment";
    if (!diagnosis) newErrors.diagnosis = "Diagnosis is required";
    if (items.some((item) => !item.medicineName || !item.dosage || !item.duration)) {
      newErrors.items = "Fill in all medicine fields";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await createPrescription({
        patientId,
        appointmentId,
        diagnosis,
        notes: (form.get("notes") as string)?.trim() || undefined,
        advice: (form.get("advice") as string)?.trim() || undefined,
        followUpDate: (form.get("followUpDate") as string) || undefined,
        items,
      });
      setOpen(false);
      setItems([{ ...emptyItem }]);
    } catch {
      setErrors({ form: "Failed to create prescription. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="primary" className="gap-1.5" onClick={() => setOpen(true)}>
        <FileText className="h-4 w-4" />
        New Prescription
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="New Prescription" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-3 rounded-lg bg-[var(--color-rose-50)] text-sm text-[var(--color-rose-600)]">
              {errors.form}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select name="patientId" label="Patient" placeholder="Select patient" options={patients.map((p) => ({ value: p.id, label: p.name }))} defaultValue="" error={errors.patientId} />
            <Select name="appointmentId" label="Appointment" placeholder="Select appointment" options={appointments.map((a) => ({ value: a.id, label: a.label }))} defaultValue="" error={errors.appointmentId} />
          </div>

          <Textarea name="diagnosis" label="Diagnosis" placeholder="Primary diagnosis..." required error={errors.diagnosis} rows={2} />

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Medicines</label>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addItem}>
                <Plus className="h-3.5 w-3.5" />
                Add Medicine
              </Button>
            </div>

            {errors.items && <p className="text-xs text-[var(--color-rose-600)]">{errors.items}</p>}

            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_100px_140px_80px_32px] gap-2 items-end">
                <Input placeholder="Medicine name" value={item.medicineName} onChange={(e) => updateItem(index, "medicineName", e.target.value)} />
                <Input placeholder="Dosage" value={item.dosage} onChange={(e) => updateItem(index, "dosage", e.target.value)} />
                <Select options={FREQUENCY_OPTIONS} value={item.frequency} onChange={(e) => updateItem(index, "frequency", e.target.value)} />
                <Input placeholder="Duration" value={item.duration} onChange={(e) => updateItem(index, "duration", e.target.value)} />
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeItem(index)} disabled={items.length === 1}>
                  <Trash2 className="h-4 w-4 text-[var(--color-rose-500)]" />
                </Button>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Textarea name="advice" label="Advice" placeholder="Dietary advice, lifestyle..." rows={2} />
            <div className="space-y-4">
              <Input name="followUpDate" label="Follow-up Date" type="date" />
              <Textarea name="notes" label="Notes" placeholder="Internal notes..." rows={2} />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>Create Prescription</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
