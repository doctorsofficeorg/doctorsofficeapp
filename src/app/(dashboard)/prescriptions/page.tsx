import { Header } from "@/components/layout";
import { Card, CardTitle, Badge } from "@/components/ui";
import { Eye, FileText } from "lucide-react";
import { Button } from "@/components/ui";
import { PrescriptionForm } from "@/components/forms/prescription-form";
import { DemoPrescriptionActions } from "@/components/actions/demo-prescription-actions";

const prescriptions = [
  { id: "RX-001", patient: "Rajesh Kumar", phone: "9876543210", diagnosis: "Upper respiratory tract infection", medicines: [
    { name: "Amoxicillin 500mg", dosage: "1 tab", frequency: "TDS", duration: "5 days" },
    { name: "Paracetamol 650mg", dosage: "1 tab", frequency: "SOS", duration: "3 days" },
    { name: "Cetirizine 10mg", dosage: "1 tab", frequency: "HS", duration: "5 days" },
  ], date: "22 Mar 2026", status: "sent" },
  { id: "RX-002", patient: "Priya Sharma", phone: "9123456789", diagnosis: "Contact dermatitis", medicines: [
    { name: "Betamethasone cream", dosage: "Apply thin layer", frequency: "BD", duration: "7 days" },
    { name: "Hydroxyzine 25mg", dosage: "1 tab", frequency: "HS", duration: "5 days" },
  ], date: "22 Mar 2026", status: "sent" },
  { id: "RX-003", patient: "Amit Patel", phone: "9988776655", diagnosis: "Lumbar spondylosis", medicines: [
    { name: "Diclofenac 50mg", dosage: "1 tab", frequency: "BD", duration: "7 days" },
    { name: "Thiocolchicoside 4mg", dosage: "1 tab", frequency: "BD", duration: "5 days" },
    { name: "Pantoprazole 40mg", dosage: "1 tab", frequency: "OD", duration: "7 days" },
    { name: "Calcium + Vitamin D3", dosage: "1 tab", frequency: "OD", duration: "30 days" },
  ], date: "21 Mar 2026", status: "draft" },
  { id: "RX-004", patient: "Sunita Devi", phone: "9112233445", diagnosis: "Type 2 Diabetes — follow up", medicines: [
    { name: "Metformin 500mg", dosage: "1 tab", frequency: "BD", duration: "30 days" },
    { name: "Glimepiride 1mg", dosage: "1 tab", frequency: "OD", duration: "30 days" },
    { name: "Atorvastatin 10mg", dosage: "1 tab", frequency: "HS", duration: "30 days" },
  ], date: "20 Mar 2026", status: "sent" },
  { id: "RX-005", patient: "Mohammed Ali", phone: "9556677889", diagnosis: "Tension headache", medicines: [
    { name: "Naproxen 250mg", dosage: "1 tab", frequency: "BD", duration: "3 days" },
    { name: "Amitriptyline 10mg", dosage: "1 tab", frequency: "HS", duration: "14 days" },
  ], date: "19 Mar 2026", status: "sent" },
];

export default function PrescriptionsPage() {
  return (
    <>
      <Header title="Prescriptions" subtitle="Create and manage prescriptions">
        <PrescriptionForm
          clinicId="demo-clinic"
          doctorId="demo-doctor"
          patients={[
            { id: "p1", name: "Rajesh Kumar" },
            { id: "p2", name: "Priya Sharma" },
            { id: "p3", name: "Amit Patel" },
          ]}
          appointments={[
            { id: "a1", patientId: "p1", label: "Rajesh Kumar — Today" },
            { id: "a2", patientId: "p2", label: "Priya Sharma — Today" },
            { id: "a3", patientId: "p3", label: "Amit Patel — Today" },
          ]}
        />
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
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
                  {rx.medicines.length} medicines
                </div>

                <div className="text-sm text-[var(--color-text-muted)]">{rx.date}</div>

                <Badge variant={rx.status === "sent" ? "emerald" : "amber"} dot>
                  {rx.status === "sent" ? "Sent" : "Draft"}
                </Badge>

                <div className="flex items-center gap-1">
                  <Button variant="ghost" size="icon-sm" title="View">
                    <Eye className="h-4 w-4" />
                  </Button>
                  <DemoPrescriptionActions
                    patientName={rx.patient}
                    patientPhone={rx.phone}
                    diagnosis={rx.diagnosis}
                    medicines={rx.medicines}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </>
  );
}
