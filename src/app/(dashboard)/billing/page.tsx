import { Header } from "@/components/layout";
import { Card, CardTitle, Button, Badge } from "@/components/ui";
import { Download, IndianRupee, TrendingUp, Receipt } from "lucide-react";
import { InvoiceForm } from "@/components/forms/invoice-form";
import { getInvoices } from "@/lib/actions/invoices";
import { getPatientsList } from "@/lib/actions/patients";
import { formatCurrency, formatDate } from "@/lib/utils";

export default async function BillingPage() {
  const [invoicesList, patientsList] = await Promise.all([
    getInvoices(),
    getPatientsList(),
  ]);

  const todayStr = new Date().toDateString();
  const todayInvoices = invoicesList.filter(
    (i) => new Date(i.createdAt).toDateString() === todayStr
  );
  const todayRevenue = todayInvoices.reduce((sum, i) => sum + Number(i.total), 0);
  const pendingCount = invoicesList.filter((i) => i.paymentStatus === "pending").length;

  return (
    <>
      <Header title="Billing" subtitle="Invoices and payments">
        <InvoiceForm patients={patientsList} />
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card padding="md">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-emerald-50)]">
                <IndianRupee className="h-5 w-5 text-[var(--color-emerald-600)]" />
              </div>
              <div>
                <p className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">{formatCurrency(todayRevenue)}</p>
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
                <p className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">{todayInvoices.length}</p>
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
                <p className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">{pendingCount}</p>
                <p className="text-xs text-[var(--color-text-muted)]">Pending Payments</p>
              </div>
            </div>
          </Card>
        </div>

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
                <th className="px-6 py-3 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Mode</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {invoicesList.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                    No invoices yet. Click &quot;New Invoice&quot; to create one.
                  </td>
                </tr>
              ) : (
                invoicesList.map((inv) => (
                  <tr key={inv.id} className="hover:bg-[var(--color-pearl-50)] transition-colors cursor-pointer">
                    <td className="px-6 py-3.5 text-sm font-medium font-[family-name:var(--font-mono)] text-[var(--color-primary)]">{inv.invoiceNumber}</td>
                    <td className="px-6 py-3.5 text-sm text-[var(--color-text-primary)]">{inv.patientName}</td>
                    <td className="px-6 py-3.5 text-sm font-semibold text-[var(--color-text-primary)] text-right">{formatCurrency(Number(inv.total))}</td>
                    <td className="px-6 py-3.5 text-center">
                      <Badge variant="default">{inv.paymentMode.toUpperCase()}</Badge>
                    </td>
                    <td className="px-6 py-3.5 text-center">
                      <Badge variant={inv.paymentStatus === "paid" ? "emerald" : "amber"} dot>
                        {inv.paymentStatus === "paid" ? "Paid" : "Pending"}
                      </Badge>
                    </td>
                    <td className="px-6 py-3.5 text-sm text-[var(--color-text-muted)]">{formatDate(inv.createdAt)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </Card>
      </div>
    </>
  );
}
