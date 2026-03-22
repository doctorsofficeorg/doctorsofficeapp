import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, Badge, Avatar, Button } from "@/components/ui";
import {
  Users,
  CalendarClock,
  FileText,
  IndianRupee,
  ArrowRight,
  Clock,
} from "lucide-react";
import Link from "next/link";
import { getPatients, getPatientsList } from "@/lib/actions/patients";
import { getTodayQueue } from "@/lib/actions/appointments";
import { getPrescriptions } from "@/lib/actions/prescriptions";
import { getInvoices } from "@/lib/actions/invoices";
import { getSessionContext } from "@/lib/auth/session";
import { formatCurrency } from "@/lib/utils";
import { AppointmentForm } from "@/components/forms/appointment-form";

const statusLabels: Record<string, string> = {
  waiting: "Waiting",
  in_consultation: "In Consultation",
  done: "Done",
  cancelled: "Cancelled",
  no_show: "No Show",
};

export default async function DashboardPage() {
  const [{ doctor }, allPatients, queue, prescriptions, invoices, patientsList] = await Promise.all([
    getSessionContext(),
    getPatients(),
    getTodayQueue(),
    getPrescriptions(),
    getInvoices(),
    getPatientsList(),
  ]);

  const todayStr = new Date().toDateString();
  const todayInvoices = invoices.filter((i) => new Date(i.createdAt).toDateString() === todayStr);
  const todayRevenue = todayInvoices.reduce((sum, i) => sum + Number(i.total), 0);
  const todayPrescriptions = prescriptions.filter((p) => new Date(p.createdAt).toDateString() === todayStr);

  const stats = [
    { label: "Total Patients", value: allPatients.length, icon: Users, bgClass: "bg-[var(--color-teal-50)]", iconClass: "text-[var(--color-teal-600)]" },
    { label: "Today's Queue", value: queue.length, icon: CalendarClock, bgClass: "bg-[var(--color-indigo-50)]", iconClass: "text-[var(--color-indigo-500)]" },
    { label: "Prescriptions Today", value: todayPrescriptions.length, icon: FileText, bgClass: "bg-[var(--color-emerald-50)]", iconClass: "text-[var(--color-emerald-600)]" },
    { label: "Revenue Today", value: formatCurrency(todayRevenue), icon: IndianRupee, bgClass: "bg-[var(--color-amber-50)]", iconClass: "text-[var(--color-amber-600)]" },
  ];

  return (
    <>
      <Header title="Dashboard" subtitle={`Welcome back, Dr. ${doctor.fullName.split(" ").pop()}`}>
        <AppointmentForm patients={patientsList} />
      </Header>

      <div className="p-8 space-y-8 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 stagger-children">
          {stats.map((stat) => (
            <Card key={stat.label} padding="md" className="group">
              <div className="flex items-start justify-between">
                <div className="flex flex-col gap-1">
                  <span className="text-sm text-[var(--color-text-secondary)] font-[family-name:var(--font-body)]">
                    {stat.label}
                  </span>
                  <span className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">
                    {stat.value}
                  </span>
                </div>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bgClass} transition-transform duration-200 group-hover:scale-110`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconClass}`} strokeWidth={1.8} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Queue */}
          <Card padding="none" className="lg:col-span-2">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-3">
                <CardTitle>Today&apos;s Queue</CardTitle>
                <Badge variant="teal" dot>
                  {queue.filter((p) => p.status === "waiting").length} waiting
                </Badge>
              </div>
              <Link href="/appointments">
                <Button variant="ghost" size="sm" className="gap-1 text-[var(--color-primary)]">
                  View all
                  <ArrowRight className="h-3.5 w-3.5" />
                </Button>
              </Link>
            </div>

            <div className="divide-y divide-[var(--color-border-subtle)]">
              {queue.length === 0 ? (
                <div className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                  No patients in queue today.
                </div>
              ) : (
                queue.slice(0, 6).map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center gap-4 px-6 py-3.5 hover:bg-[var(--color-pearl-50)] transition-colors"
                  >
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-pearl-100)] text-sm font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-600)]">
                      {patient.tokenNumber}
                    </div>

                    <Avatar
                      name={patient.patientName}
                      size="sm"
                      color={
                        patient.status === "in_consultation" ? "teal"
                        : patient.status === "done" ? "emerald"
                        : "indigo"
                      }
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">{patient.patientName}</p>
                      <p className="text-xs text-[var(--color-text-muted)] truncate">{patient.chiefComplaint || "No complaint noted"}</p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                      <Clock className="h-3 w-3" />
                      {new Date(patient.createdAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })}
                    </div>

                    <Badge variant={patient.status as "waiting" | "in_consultation" | "done"} dot>
                      {statusLabels[patient.status]}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card padding="md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <div className="mt-4 space-y-2">
                <Link href="/patients" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-teal-50)] border border-[var(--color-border)] hover:border-[var(--color-teal-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal-50)] group-hover:bg-[var(--color-teal-100)] transition-colors">
                    <Users className="h-4 w-4 text-[var(--color-teal-600)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>New Patient</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Register a new patient</span>
                  </div>
                </Link>

                <Link href="/appointments" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-indigo-50)] border border-[var(--color-border)] hover:border-[var(--color-indigo-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-indigo-50)] group-hover:bg-[var(--color-indigo-100)] transition-colors">
                    <CalendarClock className="h-4 w-4 text-[var(--color-indigo-500)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>View Queue</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Manage appointments</span>
                  </div>
                </Link>

                <Link href="/prescriptions" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-emerald-50)] border border-[var(--color-border)] hover:border-[var(--color-emerald-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-emerald-50)] group-hover:bg-[var(--color-emerald-100)] transition-colors">
                    <FileText className="h-4 w-4 text-[var(--color-emerald-600)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>Prescriptions</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Write & manage</span>
                  </div>
                </Link>

                <Link href="/billing" className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-amber-50)] border border-[var(--color-border)] hover:border-[var(--color-amber-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-amber-50)] group-hover:bg-[var(--color-amber-100)] transition-colors">
                    <IndianRupee className="h-4 w-4 text-[var(--color-amber-600)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>Billing</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Invoices & payments</span>
                  </div>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
