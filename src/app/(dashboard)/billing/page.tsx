import { Header } from "@/components/layout";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { Download, IndianRupee, TrendingUp, Receipt } from "lucide-react";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { DemoInvoiceActions } from "@/components/actions/demo-invoice-actions";
import { formatCurrency } from "@/lib/utils";

const invoices = [
  { id: "INV-0032", patient: "Rajesh Kumar", phone: "9876543210", amount: 800, gst: 144, total: 944, mode: "UPI", status: "paid", date: "22 Mar 2026", items: [{ description: "Consultation", quantity: 1, unitPrice: 800, amount: 800 }] },
  { id: "INV-0031", patient: "Priya Sharma", phone: "9123456789", amount: 500, gst: 90, total: 590, mode: "Cash", status: "paid", date: "22 Mar 2026", items: [{ description: "Consultation", quantity: 1, unitPrice: 500, amount: 500 }] },
  { id: "INV-0030", patient: "Amit Patel", phone: "9988776655", amount: 1200, gst: 216, total: 1416, mode: "Card", status: "pending", date: "22 Mar 2026", items: [{ description: "Consultation", quantity: 1, unitPrice: 500, amount: 500 }, { description: "X-Ray Lumbar Spine", quantity: 1, unitPrice: 700, amount: 700 }] },
  { id: "INV-0029", patient: "Sunita Devi", phone: "9112233445", amount: 600, gst: 108, total: 708, mode: "UPI", status: "paid", date: "21 Mar 2026", items: [{ description: "Follow-up Consultation", quantity: 1, unitPrice: 400, amount: 400 }, { description: "Blood Sugar Test", quantity: 1, unitPrice: 200, amount: 200 }] },
  { id: "INV-0028", patient: "Mohammed Ali", phone: "9556677889", amount: 500, gst: 90, total: 590, mode: "Cash", status: "paid", date: "20 Mar 2026", items: [{ description: "Consultation", quantity: 1, unitPrice: 500, amount: 500 }] },
];

export default function BillingPage() {
  const todayRevenue = invoices.filter(i => i.date === "22 Mar 2026").reduce((sum, i) => sum + i.total, 0);
  const paidCount = invoices.filter(i => i.status === "paid").length;

  return (
    <>
      <Header title="Billing" subtitle="Invoices and payments">
        <InvoiceForm
          clinicId="demo-clinic"
          patients={[
            { id: "p1", name: "Rajesh Kumar" },
            { id: "p2", name: "Priya Sharma" },
            { id: "p3", name: "Amit Patel" },
          ]}
        />
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        {/* Revenue Summary */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-emerald-50)]">
                <IndianRupee className="h-5 w-5 text-[var(--color-emerald-600)]" />
              </div>
              <div>
                <p className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">
                  {formatCurrency(todayRevenue)}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">Today&apos;s Revenue</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-teal-50)]">
                <Receipt className="h-5 w-5 text-[var(--color-teal-600)]" />
              </div>
              <div>
                <p className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">{invoices.length}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Invoices Today</p>
              </div>
            </div>
          </Card>
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-amber-50)]">
                <TrendingUp className="h-5 w-5 text-[var(--color-amber-600)]" />
              </div>
              <div>
                <p className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">
                  {invoices.filter(i => i.status === "pending").length}
                </p>
                <p className="text-xs text-[var(--color-text-muted)]">Pending Payments</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Invoice Table */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="outline" size="sm" className="gap-1.5">
              <Download className="h-3.5 w-3.5" />
              Export
            </Button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Patient</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">GST (18%)</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-[var(--color-pearl-50)] transition-colors cursor-pointer">
                  <td className="px-6 py-3.5 text-sm font-medium font-[family-name:var(--font-mono)] text-[var(--color-primary)]">{inv.id}</td>
                  <td className="px-6 py-3.5 text-sm text-[var(--color-text-primary)]">{inv.patient}</td>
                  <td className="px-6 py-3.5 text-sm text-[var(--color-text-secondary)] text-right">{formatCurrency(inv.amount)}</td>
                  <td className="px-6 py-3.5 text-sm text-[var(--color-text-muted)] text-right">{formatCurrency(inv.gst)}</td>
                  <td className="px-6 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] text-right">{formatCurrency(inv.total)}</td>
                  <td className="px-6 py-3.5 text-center">
                    <Badge variant="default">{inv.mode}</Badge>
                  </td>
                  <td className="px-6 py-3.5 text-center">
                    <Badge variant={inv.status === "paid" ? "emerald" : "amber"} dot>
                      {inv.status === "paid" ? "Paid" : "Pending"}
                    </Badge>
                  </td>
                  <td className="px-6 py-3.5 text-sm text-[var(--color-text-muted)]">{inv.date}</td>
                  <td className="px-6 py-3.5 text-right">
                    <DemoInvoiceActions
                      patientName={inv.patient}
                      patientPhone={inv.phone}
                      invoiceNumber={inv.id}
                      total={inv.total}
                      paymentStatus={inv.status}
                      items={inv.items}
                      gstPercent={18}
                      gstAmount={inv.gst}
                      subtotal={inv.amount}
                      discount={0}
                      paymentMode={inv.mode.toLowerCase()}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
