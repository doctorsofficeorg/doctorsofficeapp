import { Header } from "@/components/layout";
import { Card, CardTitle, Badge, Button } from "@/components/ui";
import { Eye, FileText } from "lucide-react";
import { PrescriptionForm } from "@/components/forms/prescription-form";
import { getPrescriptions } from "@/lib/actions/prescriptions";
import { getTodayQueue } from "@/lib/actions/appointments";
import { getPatientsList } from "@/lib/actions/patients";
import { formatDate } from "@/lib/utils";

export default async function PrescriptionsPage() {
  const [prescriptions, patientsList, queue] = await Promise.all([
    getPrescriptions(),
    getPatientsList(),
    getTodayQueue(),
  ]);

  // Build appointment options from today's queue
  const appointmentOptions = queue
    .filter((q) => q.status === "in_consultation" || q.status === "waiting")
    .map((q) => ({
      id: q.id,
      patientId: q.patientId,
      label: `${q.patientName} — Token #${q.tokenNumber}`,
    }));

  return (
    <>
      <Header title="Prescriptions" subtitle="Create and manage prescriptions">
        <PrescriptionForm patients={patientsList} appointments={appointmentOptions} />
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        <Card padding="none">
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)] flex items-center justify-between">
            <CardTitle>Recent Prescriptions</CardTitle>
            <Badge variant="teal">{prescriptions.length} total</Badge>
          </div>

          <div className="divide-y divide-[var(--color-border-subtle)]">
            {prescriptions.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                No prescriptions yet. Create one from an active appointment.
              </div>
            ) : (
              prescriptions.map((rx) => (
                <div key={rx.id} className="flex items-center gap-4 px-6 py-4 hover:bg-[var(--color-pearl-50)] transition-colors">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-indigo-50)]">
                    <FileText className="h-5 w-5 text-[var(--color-indigo-500)]" strokeWidth={1.8} />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{rx.patientName}</p>
                    </div>
                    <p className="text-xs text-[var(--color-text-muted)] mt-0.5">{rx.diagnosis}</p>
                  </div>

                  <div className="text-sm text-[var(--color-text-muted)]">{formatDate(rx.createdAt)}</div>

                  <div className="flex items-center gap-1">
                    <Button variant="ghost" size="icon-sm" title="View">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
