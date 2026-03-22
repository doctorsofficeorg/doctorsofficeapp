import { Header } from "@/components/layout";
import { Card, CardTitle, Button, Badge, Avatar } from "@/components/ui";
import { Plus, Clock, ArrowRight, Phone, MessageCircle } from "lucide-react";

const queue = [
  { token: 1, name: "Rajesh Kumar", phone: "9876543210", time: "9:00 AM", complaint: "Fever, cough for 3 days", status: "done" as const, duration: "12 min" },
  { token: 2, name: "Priya Sharma", phone: "9123456789", time: "9:15 AM", complaint: "Skin rash on arms", status: "done" as const, duration: "8 min" },
  { token: 3, name: "Amit Patel", phone: "9988776655", time: "9:30 AM", complaint: "Lower back pain", status: "in_consultation" as const, duration: null },
  { token: 4, name: "Sunita Devi", phone: "9112233445", time: "9:45 AM", complaint: "Diabetes follow-up", status: "waiting" as const, duration: null },
  { token: 5, name: "Mohammed Ali", phone: "9556677889", time: "10:00 AM", complaint: "Headache & dizziness", status: "waiting" as const, duration: null },
  { token: 6, name: "Lakshmi Iyer", phone: "9443322110", time: "10:15 AM", complaint: "BP check-up, routine", status: "waiting" as const, duration: null },
  { token: 7, name: "Venkat Raman", phone: "9667788990", time: "10:30 AM", complaint: "Knee pain, swelling", status: "waiting" as const, duration: null },
];

const statusConfig = {
  waiting: { label: "Waiting", action: "Start Consultation", nextStatus: "in_consultation" },
  in_consultation: { label: "In Consultation", action: "Complete", nextStatus: "done" },
  done: { label: "Done", action: null, nextStatus: null },
  cancelled: { label: "Cancelled", action: null, nextStatus: null },
  no_show: { label: "No Show", action: null, nextStatus: null },
};

export default function AppointmentsPage() {
  const waiting = queue.filter((q) => q.status === "waiting").length;
  const inConsultation = queue.find((q) => q.status === "in_consultation");
  const done = queue.filter((q) => q.status === "done").length;

  return (
    <>
      <Header title="Today's Queue" subtitle="Saturday, 22 March 2026">
        <Button size="sm" variant="primary" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Add Walk-in
        </Button>
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        {/* Queue Stats */}
        <div className="grid grid-cols-3 gap-4">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-amber-600)]">{waiting}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Waiting</p>
          </Card>
          <Card padding="sm" className="text-center border-[var(--color-teal-200)] bg-[var(--color-teal-50)]/30">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-teal-700)]">{inConsultation ? 1 : 0}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">In Consultation</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-emerald-600)]">{done}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Completed</p>
          </Card>
        </div>

        {/* Queue List */}
        <Card padding="none">
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)]">
            <CardTitle>Patient Queue</CardTitle>
          </div>

          <div className="divide-y divide-[var(--color-border-subtle)]">
            {queue.map((patient) => {
              const config = statusConfig[patient.status];
              return (
                <div
                  key={patient.token}
                  className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                    patient.status === "in_consultation"
                      ? "bg-[var(--color-teal-50)]/40 border-l-[3px] border-l-[var(--color-teal-500)]"
                      : patient.status === "done"
                      ? "opacity-60"
                      : "hover:bg-[var(--color-pearl-50)]"
                  }`}
                >
                  {/* Token */}
                  <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold font-[family-name:var(--font-display)] ${
                    patient.status === "in_consultation"
                      ? "bg-[var(--color-teal-100)] text-[var(--color-teal-700)]"
                      : patient.status === "done"
                      ? "bg-[var(--color-emerald-50)] text-[var(--color-emerald-600)]"
                      : "bg-[var(--color-pearl-100)] text-[var(--color-pearl-600)]"
                  }`}>
                    {patient.token}
                  </div>

                  {/* Patient Info */}
                  <Avatar name={patient.name} size="sm" color={patient.status === "in_consultation" ? "teal" : "indigo"} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)]">{patient.name}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">{patient.complaint}</p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <Clock className="h-3 w-3" />
                    {patient.time}
                    {patient.duration && (
                      <span className="ml-1 text-[var(--color-emerald-600)]">({patient.duration})</span>
                    )}
                  </div>

                  {/* Status */}
                  <Badge variant={patient.status} dot>{config.label}</Badge>

                  {/* Actions */}
                  <div className="flex items-center gap-1.5">
                    {patient.status === "waiting" && (
                      <Button variant="ghost" size="icon-sm" title="WhatsApp reminder">
                        <MessageCircle className="h-4 w-4 text-[var(--color-emerald-600)]" />
                      </Button>
                    )}
                    {config.action && (
                      <Button
                        variant={patient.status === "in_consultation" ? "success" : "primary"}
                        size="sm"
                        className="gap-1"
                      >
                        {config.action}
                        <ArrowRight className="h-3.5 w-3.5" />
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      </div>
    </>
  );
}
