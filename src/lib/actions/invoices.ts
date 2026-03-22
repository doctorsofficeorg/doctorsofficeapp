"use server";

import { db } from "@/db";
import { invoices, invoiceItems } from "@/db/schema";
import { eq, sql, desc } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export interface InvoiceItemInput {
  description: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateInvoiceInput {
  clinicId: string;
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
  const invoiceNumber = await generateInvoiceNumber(input.clinicId);

  const subtotal = input.items.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );
  const gstAmount = (subtotal * input.gstPercent) / 100;
  const total = subtotal + gstAmount - input.discount;

  const [invoice] = await db
    .insert(invoices)
    .values({
      clinicId: input.clinicId,
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

export async function getInvoices(clinicId: string) {
  return db
    .select()
    .from(invoices)
    .where(eq(invoices.clinicId, clinicId))
    .orderBy(desc(invoices.createdAt));
}
