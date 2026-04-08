"use server";

import { db } from "@/db";
import { invoices, invoiceItems, patients } from "@/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getSessionContext } from "@/lib/auth/session";
import { isDemoMode, demoInvoices } from "@/lib/demo-data";

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceInput {
  patientId: string;
  appointmentId?: string;
  gstPercent: number;
  discount: number;
  paymentMode: "cash" | "upi" | "card" | "insurance" | "other";
  paymentStatus: "paid" | "pending" | "partial";
  notes?: string;
  items: InvoiceItemInput[];
}

async function generateInvoiceNumber(clinicId: string): Promise<string> {
  const [result] = await db
    .select({ count: sql<number>`COUNT(*)` })
    .from(invoices)
    .where(eq(invoices.clinicId, clinicId));

  const next = (result?.count ?? 0) + 1;
  return `INV-${String(next).padStart(4, "0")}`;
}

export async function createInvoice(input: CreateInvoiceInput) {
  const { clinic } = await getSessionContext();
  const invoiceNumber = await generateInvoiceNumber(clinic.id);

  const subtotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const gstAmount = (subtotal * input.gstPercent) / 100;
  const total = subtotal + gstAmount - input.discount;

  const [invoice] = await db
    .insert(invoices)
    .values({
      clinicId: clinic.id,
      patientId: input.patientId,
      appointmentId: input.appointmentId || null,
      invoiceNumber,
      subtotal: subtotal.toFixed(2),
      gstPercent: input.gstPercent.toFixed(2),
      gstAmount: gstAmount.toFixed(2),
      discount: input.discount.toFixed(2),
      total: total.toFixed(2),
      paymentMode: input.paymentMode,
      paymentStatus: input.paymentStatus,
      notes: input.notes || null,
    })
    .returning();

  if (input.items.length > 0) {
    await db.insert(invoiceItems).values(
      input.items.map((item) => ({
        invoiceId: invoice.id,
        description: item.description,
        quantity: item.quantity,
        unitPrice: item.unitPrice.toFixed(2),
        amount: (item.quantity * item.unitPrice).toFixed(2),
      }))
    );
  }

  revalidatePath("/billing");
  return invoice;
}

export async function getInvoices() {
  if (isDemoMode) return demoInvoices;

  const { clinic } = await getSessionContext();

  return db
    .select({
      id: invoices.id,
      invoiceNumber: invoices.invoiceNumber,
      subtotal: invoices.subtotal,
      gstPercent: invoices.gstPercent,
      gstAmount: invoices.gstAmount,
      discount: invoices.discount,
      total: invoices.total,
      paymentMode: invoices.paymentMode,
      paymentStatus: invoices.paymentStatus,
      createdAt: invoices.createdAt,
      patientName: patients.fullName,
      patientPhone: patients.phone,
    })
    .from(invoices)
    .innerJoin(patients, eq(invoices.patientId, patients.id))
    .where(eq(invoices.clinicId, clinic.id))
    .orderBy(desc(invoices.createdAt));
}
