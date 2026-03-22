/**
 * Open WhatsApp with a pre-filled message via wa.me deep link.
 * Works on both mobile (opens WhatsApp app) and desktop (opens WhatsApp Web).
 */
export function shareViaWhatsApp(phone: string, message: string) {
  // Strip non-numeric chars and add country code if missing
  let cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 10) {
    cleaned = `91${cleaned}`; // Default to India
  }
  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/${cleaned}?text=${encoded}`, "_blank");
}

export function buildPrescriptionMessage(
  patientName: string,
  doctorName: string,
  clinicName: string,
  diagnosis: string,
  medicines: { name: string; dosage: string; frequency: string; duration: string }[]
): string {
  const medicineList = medicines
    .map((m, i) => `${i + 1}. *${m.name}* — ${m.dosage}, ${m.frequency}, ${m.duration}`)
    .join("\n");

  return [
    `📋 *Prescription — ${clinicName}*`,
    ``,
    `Patient: *${patientName}*`,
    `Doctor: *Dr. ${doctorName}*`,
    `Diagnosis: ${diagnosis}`,
    ``,
    `*Medicines:*`,
    medicineList,
    ``,
    `_This is a digital prescription from ${clinicName}._`,
  ].join("\n");
}

export function buildInvoiceMessage(
  patientName: string,
  clinicName: string,
  invoiceNumber: string,
  total: string,
  paymentStatus: string
): string {
  return [
    `🧾 *Invoice ${invoiceNumber} — ${clinicName}*`,
    ``,
    `Patient: *${patientName}*`,
    `Total: *${total}*`,
    `Status: ${paymentStatus === "paid" ? "✅ Paid" : "⏳ Pending"}`,
    ``,
    `_Thank you for visiting ${clinicName}._`,
  ].join("\n");
}
