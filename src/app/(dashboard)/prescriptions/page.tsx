import { Header } from "@/components/layout";
import { Card, CardTitle, Button, Badge, Avatar } from "@/components/ui";
import { Plus, Download, Send, Eye, FileText } from "lucide-react";

const prescriptions = [
  { id: "RX-001", patient: "Rajesh Kumar", diagnosis: "Upper respiratory tract infection", medicines: 3, date: "22 Mar 2026", status: "sent" },
  { id: "RX-002", patient: "Priya Sharma", diagnosis: "Contact dermatitis", medicines: 2, date: "22 Mar 2026", status: "sent" },
  { id: "RX-003", patient: "Amit Patel", diagnosis: "Lumbar spondylosis", medicines: 4, date: "21 Mar 2026", status: "draft" },
  { id: "RX-004", patient: "Sunita Devi", diagnosis: "Type 2 Diabetes — follow up", medicines: 3, date: "20 Mar 2026", status: "sent" },
  { id: "RX-005", patient: "Mohammed Ali", diagnosis: "Tension headache", medicines: 2, date: "19 Mar 2026", status: "sent" },
];

export default function PrescriptionsPage() {
  return (
    <>
      <Header title="Prescriptions" subtitle="Create and manage prescriptions">
        <Button size="sm" variant="primary" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Prescription
        </Button>
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        {/* Prescription List */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <CardTitle>Recent Prescriptions</CardTitle>
            <Badge variant="teal">{prescriptions.length} this week</Badge>
          </div>

          <div className="divide-y divide-[var(--color-border-subtle)]">
            {prescriptions.map((rx) => (
              <div key={rx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--color-pearl-50)] transition-colors">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-indigo-50)]">
                  <FileText className="h-5 w-5 text-[var(--color-indigo-500)]" strokeWidth={1.8} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{rx.patient}</p>
                    <span className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">{rx.id}</span>
                  </div>
                  <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{rx.diagnosis}</p>
                </div>

                <div className="text-sm text-[var(--color-text-muted)]">
                  {rx.medicines} medicines
                </div>

                <div className="text-sm text-[var(--color-text-muted)]">{rx.date}</div>

                <Badge variant={rx.status === "sent" ? "emerald" : "amber"} dot>
                  {rx.status === "sent" ? "Sent" : "Draft"}
                </Badge>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" title="Download PDF">
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon-sm" title="Send via WhatsApp">
                    <Send className="h-4 w-4 text-[var(--color-emerald-600)]" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
