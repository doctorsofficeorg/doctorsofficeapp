"use client";

import { Button } from "@/components/ui";
import { Download, Send } from "lucide-react";
import { downloadPrescriptionPdf } from "@/lib/pdf";
import { shareViaWhatsApp, buildPrescriptionMessage } from "@/lib/utils/whatsapp";
import type { Prescription, PrescriptionItem, Doctor, Patient, Clinic } from "@/types";

interface PrescriptionActionsProps {
  prescription: Prescription;
  items: PrescriptionItem[];
  doctor: Doctor;
  patient: Patient;
  clinic: Clinic;
}

export function PrescriptionActions({ prescription, items, doctor, patient, clinic }: PrescriptionActionsProps) {
  function handleDownload() {
    downloadPrescriptionPdf({ prescription, items, doctor, patient, clinic });
  }

  function handleWhatsApp() {
    const message = buildPrescriptionMessage(
      patient.full_name,
      doctor.full_name,
      clinic.name,
      prescription.diagnosis,
      items.map((item) => ({
        name: item.medicine_name,
        dosage: item.dosage,
        frequency: item.frequency,
        duration: item.duration,
      }))
    );
    shareViaWhatsApp(patient.phone, message);
  }

  return (
    <div className="flex items-center gap-1">
      <Button variant="ghost" size="icon-sm" title="Download PDF" onClick={handleDownload}>
        <Download className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon-sm" title="Send via WhatsApp" onClick={handleWhatsApp}>
        <Send className="h-4 w-4 text-[var(--color-emerald-600)]" />
      </Button>
    </div>
  );
}
