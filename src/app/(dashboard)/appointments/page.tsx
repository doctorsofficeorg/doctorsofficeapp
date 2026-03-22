export const dynamic = "force-dynamic";

import { Header } from "@/components/layout";
import { Card, CardTitle, Button, Badge, Avatar } from "@/components/ui";
import { Clock, ArrowRight, MessageCircle } from "lucide-react";
import { AppointmentForm } from "@/components/forms/appointment-form";
import { getTodayQueue } from "@/lib/actions/appointments";
import { getPatientsList } from "@/lib/actions/patients";
import { QueueActions } from "@/components/actions/queue-actions";

const statusConfig: Record<string, { label: string; action: string | null; nextStatus: string | null }> = {
  waiting: { label: "Waiting", action: "Start Consultation", nextStatus: "in_consultation" },
  in_consultation: { label: "In Consultation", action: "Complete", nextStatus: "done" },
  done: { label: "Done", action: null, nextStatus: null },
  cancelled: { label: "Cancelled", action: null, nextStatus: null },
  no_show: { label: "No Show", action: null, nextStatus: null },
};

export default async function AppointmentsPage() {
  const [queue, patientsList] = await Promise.all([
    getTodayQueue(),
    getPatientsList(),
  ]);

  const waiting = queue.filter((q) => q.status === "waiting").length;
  const inConsultation = queue.filter((q) => q.status === "in_consultation").length;
  const done = queue.filter((q) => q.status === "done").length;

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <>
      <Header title="Today's Queue" subtitle={today}>
        <AppointmentForm patients={patientsList} />
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        <div className="grid grid-cols-3 gap-4">
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-amber-600)]">{waiting}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Waiting</p>
          </Card>
          <Card padding="sm" className="text-center border-[var(--color-teal-200)] bg-[var(--color-teal-50)]/30">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-teal-700)]">{inConsultation}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">In Consultation</p>
          </Card>
          <Card padding="sm" className="text-center">
            <p className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-emerald-600)]">{done}</p>
            <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Completed</p>
          </Card>
        </div>

        <Card padding="none">
          <div className="px-6 py-4 border-b border-[var(--color-border-subtle)]">
            <CardTitle>Patient Queue</CardTitle>
          </div>

          <div className="divide-y divide-[var(--color-border-subtle)]">
            {queue.length === 0 ? (
              <div className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                No patients in queue today. Click &quot;Add Walk-in&quot; to start.
              </div>
            ) : (
              queue.map((appointment) => {
                const config = statusConfig[appointment.status];
                return (
                  <div
                    key={appointment.id}
                    className={`flex items-center gap-4 px-6 py-4 transition-colors ${
                      appointment.status === "in_consultation"
                        ? "bg-[var(--color-teal-50)]/40 border-l-[3px] border-l-[var(--color-teal-500)]"
                        : appointment.status === "done"
                        ? "opacity-60"
                        : "hover:bg-[var(--color-pearl-50)]"
                    }`}
                  >
                    <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold font-[family-name:var(--font-display)] ${
                      appointment.status === "in_consultation"
                        ? "bg-[var(--color-teal-100)] text-[var(--color-teal-700)]"
                        : appointment.status === "done"
                        ? "bg-[var(--color-emerald-50)] text-[var(--color-emerald-600)]"
                        : "bg-[var(--color-pearl-100)] text-[var(--color-pearl-600)]"
                    }`}>
                      {appointment.tokenNumber}
                    </div>

                    <Avatar name={appointment.patientName} size="sm" color={appointment.status === "in_consultation" ? "teal" : "indigo"} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)]">{appointment.patientName}</p>
                      <p className="text-xs text-[var(--color-text-muted)]">{appointment.chiefComplaint || "No complaint noted"}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Clock className="h-3 w-3" />
                      {new Date(appointment.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </div>

                    <Badge variant={appointment.status as "waiting" | "in_consultation" | "done" | "cancelled" | "no_show"} dot>{config.label}</Badge>

                    <div className="flex items-center gap-1.5">
                      {appointment.status === "waiting" && (
                        <Button variant="ghost" size="icon-sm" title="WhatsApp reminder">
                          <MessageCircle className="h-4 w-4 text-[var(--color-emerald-600)]" />
                        </Button>
                      )}
                      {config.action && config.nextStatus && (
                        <QueueActions
                          appointmentId={appointment.id}
                          action={config.action}
                          nextStatus={config.nextStatus as "in_consultation" | "done"}
                          variant={appointment.status === "in_consultation" ? "success" : "primary"}
                        />
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>
      </div>
    </>
  );
}
