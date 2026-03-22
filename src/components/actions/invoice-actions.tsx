"use client";

import { Button } from "@/components/ui";
import { Download, Send } from "lucide-react";
import { downloadInvoicePdf } from "@/lib/pdf";
import { shareViaWhatsApp, buildInvoiceMessage } from "@/lib/utils/whatsapp";
import { formatCurrency } from "@/lib/utils";
import type { Invoice, InvoiceItem, Patient, Clinic } from "@/types";

interface InvoiceActionsProps {
  invoice: Invoice;
  items: InvoiceItem[];
  patient: Patient;
  clinic: Clinic;
}

export function InvoiceActions({ invoice, items, patient, clinic }: InvoiceActionsProps) {
  function handleDownload() {
    downloadInvoicePdf({ invoice, items, patient, clinic });
  }

  function handleWhatsApp() {
    const message = buildInvoiceMessage(
      patient.full_name,
      clinic.name,
      invoice.invoice_number,
      formatCurrency(invoice.total),
      invoice.payment_status
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
