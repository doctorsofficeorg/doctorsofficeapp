import { jsPDF } from "jspdf";
import type { Prescription, PrescriptionItem, Doctor, Patient, Clinic } from "@/types";

interface PrescriptionPdfData {
  prescription: Prescription;
  items: PrescriptionItem[];
  doctor: Doctor;
  patient: Patient;
  clinic: Clinic;
}

const FREQ_LABELS: Record<string, string> = {
  OD: "Once daily",
  BD: "Twice daily",
  TDS: "Thrice daily",
  QID: "Four times daily",
  SOS: "As needed",
  HS: "At bedtime",
  STAT: "Immediately",
  PRN: "When required",
};

export function generatePrescriptionPdf(data: PrescriptionPdfData): jsPDF {
  const { prescription, items, doctor, patient, clinic } = data;
  const doc = new jsPDF({ unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 16;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // ── Header ──
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text(clinic.name, margin, y);
  y += 6;

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${clinic.address}, ${clinic.city} - ${clinic.pincode}`, margin, y);
  y += 4;
  doc.text(`Phone: ${clinic.phone} | Email: ${clinic.email}`, margin, y);
  if (clinic.gstin) {
    y += 4;
    doc.text(`GSTIN: ${clinic.gstin}`, margin, y);
  }
  y += 3;

  // Divider
  doc.setDrawColor(200);
  doc.line(margin, y, pageWidth - margin, y);
  y += 6;

  // ── Rx Header ──
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(0, 128, 128);
  doc.text("Rx", margin, y);

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Date: ${new Date(prescription.created_at).toLocaleDateString("en-IN")}`, pageWidth - margin, y - 6, { align: "right" });
  y += 4;

  // ── Doctor Info ──
  doc.setFontSize(11);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text(`Dr. ${doctor.full_name}`, margin, y);
  y += 5;
  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`${doctor.specialization} | Reg No: ${doctor.registration_number}`, margin, y);
  y += 8;

  // ── Patient Info ──
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(margin, y - 4, contentWidth, 18, 2, 2, "F");

  doc.setFontSize(9);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(60);
  doc.text("Patient:", margin + 4, y + 1);
  doc.setFont("helvetica", "normal");
  doc.text(patient.full_name, margin + 24, y + 1);

  doc.setFont("helvetica", "bold");
  doc.text("Age/Gender:", margin + 4, y + 6);
  doc.setFont("helvetica", "normal");
  const ageGender = `${patient.age || "—"}y / ${patient.gender.charAt(0).toUpperCase()}`;
  doc.text(ageGender, margin + 32, y + 6);

  doc.setFont("helvetica", "bold");
  doc.text("Phone:", contentWidth / 2 + margin, y + 1);
  doc.setFont("helvetica", "normal");
  doc.text(patient.phone, contentWidth / 2 + margin + 18, y + 1);

  doc.setFont("helvetica", "bold");
  doc.text("ID:", contentWidth / 2 + margin, y + 6);
  doc.setFont("helvetica", "normal");
  doc.text(patient.patient_uid, contentWidth / 2 + margin + 10, y + 6);

  y += 20;

  // ── Diagnosis ──
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(30);
  doc.text("Diagnosis:", margin, y);
  doc.setFont("helvetica", "normal");
  doc.text(prescription.diagnosis, margin + 26, y);
  y += 8;

  // ── Medicines Table ──
  doc.setFillColor(0, 128, 128);
  doc.roundedRect(margin, y, contentWidth, 7, 1, 1, "F");

  doc.setFontSize(8);
  doc.setFont("helvetica", "bold");
  doc.setTextColor(255);
  const cols = [margin + 3, margin + 8, margin + 68, margin + 98, margin + 128, margin + 150];
  doc.text("#", cols[0], y + 5);
  doc.text("Medicine", cols[1], y + 5);
  doc.text("Dosage", cols[2], y + 5);
  doc.text("Frequency", cols[3], y + 5);
  doc.text("Duration", cols[4], y + 5);
  doc.text("Qty", cols[5], y + 5);
  y += 10;

  doc.setTextColor(40);
  doc.setFont("helvetica", "normal");
  items.forEach((item, i) => {
    if (i % 2 === 0) {
      doc.setFillColor(250, 251, 252);
      doc.rect(margin, y - 4, contentWidth, 8, "F");
    }

    doc.setFontSize(8);
    doc.text(String(i + 1), cols[0], y);
    doc.setFont("helvetica", "bold");
    doc.text(item.medicine_name, cols[1], y);
    doc.setFont("helvetica", "normal");
    doc.text(item.dosage, cols[2], y);
    doc.text(FREQ_LABELS[item.frequency] || item.frequency, cols[3], y);
    doc.text(item.duration, cols[4], y);
    doc.text(item.quantity ? String(item.quantity) : "—", cols[5], y);

    if (item.instructions) {
      y += 4;
      doc.setFontSize(7);
      doc.setTextColor(100);
      doc.text(`↳ ${item.instructions}`, cols[1], y);
      doc.setTextColor(40);
    }
    y += 7;
  });

  y += 4;

  // ── Advice ──
  if (prescription.advice) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(30);
    doc.text("Advice:", margin, y);
    doc.setFont("helvetica", "normal");
    const adviceLines = doc.splitTextToSize(prescription.advice, contentWidth - 20);
    doc.text(adviceLines, margin + 18, y);
    y += adviceLines.length * 4 + 4;
  }

  // ── Follow-up ──
  if (prescription.follow_up_date) {
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.text("Follow-up:", margin, y);
    doc.setFont("helvetica", "normal");
    doc.text(new Date(prescription.follow_up_date).toLocaleDateString("en-IN"), margin + 26, y);
    y += 8;
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 20;
  doc.setDrawColor(200);
  doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);

  doc.setFontSize(8);
  doc.setTextColor(150);
  doc.text("This is a computer-generated prescription.", margin, footerY);
  doc.text(`Generated by Doctors Office — ${clinic.name}`, pageWidth - margin, footerY, { align: "right" });

  return doc;
}

export function downloadPrescriptionPdf(data: PrescriptionPdfData) {
  const doc = generatePrescriptionPdf(data);
  doc.save(`Rx-${data.patient.patient_uid}-${Date.now()}.pdf`);
}

export function getPrescriptionPdfBlob(data: PrescriptionPdfData): Blob {
  const doc = generatePrescriptionPdf(data);
  return doc.output("blob");
}
