"use client";

import { Button } from "@/components/ui";
import { Download, Send } from "lucide-react";
import { downloadPrescriptionPdf } from "@/lib/pdf";
import { shareViaWhatsApp, buildPrescriptionMessage } from "@/lib/utils/whatsapp";

// Demo data for preview — will be replaced with real data when Supabase is connected
const demoClinic = {
  id: "demo", name: "Pearl Clinic", address: "42 MG Road", city: "Chennai",
  state: "Tamil Nadu", pincode: "600001", phone: "044-28150000",
  email: "info@pearlclinic.in", gstin: "33AABCP1234Q1Z5",
  region: "india" as const, created_at: "", updated_at: "",
};

const demoDoctor = {
  id: "demo", clinic_id: "demo", user_id: "demo",
  full_name: "Arun Sharma", qualification: "MBBS, MD",
  registration_number: "TN-12345", specialization: "General Medicine",
  phone: "9876543210", email: "dr.sharma@pearlclinic.in", created_at: "",
};

interface Props {
  patientName: string;
  patientPhone: string;
  diagnosis: string;
  medicines: { name: string; dosage: string; frequency: string; duration: string }[];
}

export function DemoPrescriptionActions({ patientName, patientPhone, diagnosis, medicines }: Props) {
  const demoPatient = {
    id: "demo", clinic_id: "demo", patient_uid: "PT-DEMO",
    full_name: patientName, phone: patientPhone, gender: "male" as const,
    age: 45, created_at: "", updated_at: "",
  };

  const demoPrescription = {
    id: "demo", clinic_id: "demo", doctor_id: "demo", patient_id: "demo",
    appointment_id: "demo", diagnosis, items: [],
    created_at: new Date().toISOString(),
  };

  const demoItems = medicines.map((m, i) => ({
    id: `item-${i}`, prescription_id: "demo",
    medicine_name: m.name, dosage: m.dosage,
    frequency: m.frequency as "OD", duration: m.duration,
  }));

  function handleDownload() {
    downloadPrescriptionPdf({
      prescription: demoPrescription,
      items: demoItems,
      doctor: demoDoctor,
      patient: demoPatient,
      clinic: demoClinic,
    });
  }

  function handleWhatsApp() {
    const message = buildPrescriptionMessage(
      patientName, demoDoctor.full_name, demoClinic.name, diagnosis, medicines
    );
    shareViaWhatsApp(patientPhone, message);
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
