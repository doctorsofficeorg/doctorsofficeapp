"use client";

import { Button } from "@/components/ui";
import { Download, Send } from "lucide-react";
import { downloadInvoicePdf } from "@/lib/pdf";
import { shareViaWhatsApp, buildInvoiceMessage } from "@/lib/utils/whatsapp";
import { formatCurrency } from "@/lib/utils";

const demoClinic = {
  id: "demo", name: "Pearl Clinic", address: "42 MG Road", city: "Chennai",
  state: "Tamil Nadu", pincode: "600001", phone: "044-28150000",
  email: "info@pearlclinic.in", gstin: "33AABCP1234Q1Z5",
  region: "india" as const, created_at: "", updated_at: "",
};

interface Props {
  patientName: string;
  patientPhone: string;
  invoiceNumber: string;
  total: number;
  paymentStatus: string;
  items: { description: string; quantity: number; unitPrice: number; amount: number }[];
  gstPercent: number;
  gstAmount: number;
  subtotal: number;
  discount: number;
  paymentMode: string;
}

export function DemoInvoiceActions({
  patientName, patientPhone, invoiceNumber, total, paymentStatus,
  items, gstPercent, gstAmount, subtotal, discount, paymentMode,
}: Props) {
  const demoPatient = {
    id: "demo", clinic_id: "demo", patient_uid: "PT-DEMO",
    full_name: patientName, phone: patientPhone, gender: "male" as const,
    age: 45, created_at: "", updated_at: "",
  };

  const demoInvoice = {
    id: "demo", clinic_id: "demo", patient_id: "demo",
    invoice_number: invoiceNumber, subtotal, gst_percent: gstPercent,
    gst_amount: gstAmount, discount, total,
    payment_mode: paymentMode as "cash", payment_status: paymentStatus as "paid",
    items: [], created_at: new Date().toISOString(),
  };

  const demoItems = items.map((item, i) => ({
    id: `item-${i}`, invoice_id: "demo",
    description: item.description, quantity: item.quantity,
    unit_price: item.unitPrice, amount: item.amount,
  }));

  function handleDownload() {
    downloadInvoicePdf({
      invoice: demoInvoice,
      items: demoItems,
      patient: demoPatient,
      clinic: demoClinic,
    });
  }

  function handleWhatsApp() {
    const message = buildInvoiceMessage(
      patientName, demoClinic.name, invoiceNumber,
      formatCurrency(total), paymentStatus
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
