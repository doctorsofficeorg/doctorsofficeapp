"use client";

import { useState, useMemo } from "react";
import { Button, Input, Select, Textarea, Modal } from "@/components/ui";
import { createInvoice, type InvoiceItemInput } from "@/lib/actions/invoices";
import { Plus, Trash2, Receipt } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

const PAYMENT_MODE_OPTIONS = [
  { value: "cash", label: "Cash" },
  { value: "upi", label: "UPI" },
  { value: "card", label: "Card" },
  { value: "insurance", label: "Insurance" },
  { value: "other", label: "Other" },
];

const PAYMENT_STATUS_OPTIONS = [
  { value: "paid", label: "Paid" },
  { value: "pending", label: "Pending" },
  { value: "partial", label: "Partial" },
];

interface InvoiceFormProps {
  patients: { id: string; name: string }[];
}

const emptyItem: InvoiceItemInput = { description: "", quantity: 1, unitPrice: 0 };

export function InvoiceForm({ patients }: InvoiceFormProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [items, setItems] = useState<InvoiceItemInput[]>([{ ...emptyItem }]);
  const [gstPercent, setGstPercent] = useState(18);
  const [discount, setDiscount] = useState(0);

  const subtotal = useMemo(() => items.reduce((sum, item) => sum + item.quantity * item.unitPrice, 0), [items]);
  const gstAmount = (subtotal * gstPercent) / 100;
  const total = subtotal + gstAmount - discount;

  function addItem() { setItems([...items, { ...emptyItem }]); }
  function removeItem(index: number) { if (items.length === 1) return; setItems(items.filter((_, i) => i !== index)); }
  function updateItem(index: number, field: keyof InvoiceItemInput, value: string | number) {
    setItems(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const form = new FormData(e.currentTarget);
    const patientId = form.get("patientId") as string;
    const paymentMode = form.get("paymentMode") as string;
    const paymentStatus = form.get("paymentStatus") as string;

    const newErrors: Record<string, string> = {};
    if (!patientId) newErrors.patientId = "Select a patient";
    if (!paymentMode) newErrors.paymentMode = "Select payment mode";
    if (items.some((item) => !item.description || item.unitPrice <= 0)) newErrors.items = "Fill in all line items with valid amounts";

    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }

    setLoading(true);
    try {
      await createInvoice({
        patientId,
        gstPercent,
        discount,
        paymentMode: paymentMode as "cash" | "upi" | "card" | "insurance" | "other",
        paymentStatus: (paymentStatus as "paid" | "pending" | "partial") || "pending",
        notes: (form.get("notes") as string)?.trim() || undefined,
        items,
      });
      setOpen(false);
      setItems([{ ...emptyItem }]);
      setDiscount(0);
    } catch {
      setErrors({ form: "Failed to create invoice. Please try again." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button size="sm" variant="primary" className="gap-1.5" onClick={() => setOpen(true)}>
        <Receipt className="h-4 w-4" />
        New Invoice
      </Button>

      <Modal open={open} onClose={() => setOpen(false)} title="New Invoice" size="xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {errors.form && (
            <div className="p-3 rounded-lg bg-[var(--color-rose-50)] text-sm text-[var(--color-rose-600)]">{errors.form}</div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Select name="patientId" label="Patient" placeholder="Select patient" options={patients.map((p) => ({ value: p.id, label: p.name }))} defaultValue="" error={errors.patientId} />
            <Select name="paymentMode" label="Payment Mode" placeholder="Select mode" options={PAYMENT_MODE_OPTIONS} defaultValue="" error={errors.paymentMode} />
            <Select name="paymentStatus" label="Payment Status" options={PAYMENT_STATUS_OPTIONS} defaultValue="paid" />
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-[var(--color-text-primary)]">Line Items</label>
              <Button type="button" variant="outline" size="sm" className="gap-1" onClick={addItem}><Plus className="h-3.5 w-3.5" />Add Item</Button>
            </div>
            {errors.items && <p className="text-xs text-[var(--color-rose-600)]">{errors.items}</p>}
            <div className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 text-xs font-medium text-[var(--color-text-muted)] uppercase">
              <span>Description</span><span>Qty</span><span>Unit Price</span><span>Amount</span><span />
            </div>
            {items.map((item, index) => (
              <div key={index} className="grid grid-cols-[1fr_80px_100px_80px_32px] gap-2 items-center">
                <Input placeholder="Consultation, procedure..." value={item.description} onChange={(e) => updateItem(index, "description", e.target.value)} />
                <Input type="number" min={1} value={item.quantity} onChange={(e) => updateItem(index, "quantity", Number(e.target.value))} />
                <Input type="number" min={0} step="0.01" value={item.unitPrice} onChange={(e) => updateItem(index, "unitPrice", Number(e.target.value))} />
                <span className="text-sm font-medium text-[var(--color-text-primary)] text-right pr-2">{formatCurrency(item.quantity * item.unitPrice)}</span>
                <Button type="button" variant="ghost" size="icon-sm" onClick={() => removeItem(index)} disabled={items.length === 1}>
                  <Trash2 className="h-4 w-4 text-[var(--color-rose-500)]" />
                </Button>
              </div>
            ))}
          </div>

          <div className="bg-[var(--color-pearl-50)] rounded-xl p-4 space-y-2">
            <div className="flex justify-between text-sm"><span className="text-[var(--color-text-muted)]">Subtotal</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
            <div className="flex justify-between text-sm items-center gap-4">
              <span className="text-[var(--color-text-muted)]">GST</span>
              <div className="flex items-center gap-2">
                <Input type="number" min={0} max={100} value={gstPercent} onChange={(e) => setGstPercent(Number(e.target.value))} className="w-16 text-center !py-1 text-xs" />
                <span className="text-xs text-[var(--color-text-muted)]">%</span>
                <span className="font-medium w-20 text-right">{formatCurrency(gstAmount)}</span>
              </div>
            </div>
            <div className="flex justify-between text-sm items-center gap-4">
              <span className="text-[var(--color-text-muted)]">Discount</span>
              <Input type="number" min={0} value={discount} onChange={(e) => setDiscount(Number(e.target.value))} className="w-24 text-right !py-1 text-xs" />
            </div>
            <div className="flex justify-between text-base font-bold pt-2 border-t border-[var(--color-border-subtle)]">
              <span>Total</span><span className="text-[var(--color-primary)]">{formatCurrency(total)}</span>
            </div>
          </div>

          <Textarea name="notes" label="Notes" placeholder="Additional notes..." rows={2} />

          <div className="flex justify-end gap-3 pt-2 border-t border-[var(--color-border-subtle)]">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>Create Invoice</Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
