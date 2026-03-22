import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, Badge, Avatar, Button } from "@/components/ui";
import {
  Users,
  CalendarClock,
  FileText,
  IndianRupee,
  TrendingUp,
  ArrowRight,
  Plus,
  Clock,
  UserPlus,
} from "lucide-react";

// Demo data — will be replaced with Supabase queries
const stats = [
  {
    label: "Total Patients",
    value: "1,284",
    change: 12,
    icon: Users,
    color: "teal" as const,
    bgClass: "bg-[var(--color-teal-50)]",
    iconClass: "text-[var(--color-teal-600)]",
  },
  {
    label: "Today's Appointments",
    value: "32",
    change: 8,
    icon: CalendarClock,
    color: "indigo" as const,
    bgClass: "bg-[var(--color-indigo-50)]",
    iconClass: "text-[var(--color-indigo-500)]",
  },
  {
    label: "Prescriptions Today",
    value: "18",
    change: -3,
    icon: FileText,
    color: "emerald" as const,
    bgClass: "bg-[var(--color-emerald-50)]",
    iconClass: "text-[var(--color-emerald-600)]",
  },
  {
    label: "Revenue Today",
    value: "₹24,500",
    change: 15,
    icon: IndianRupee,
    color: "amber" as const,
    bgClass: "bg-[var(--color-amber-50)]",
    iconClass: "text-[var(--color-amber-600)]",
  },
];

const todaysQueue = [
  { id: 1, name: "Rajesh Kumar", token: 1, time: "9:00 AM", complaint: "Fever & cough", status: "done" as const },
  { id: 2, name: "Priya Sharma", token: 2, time: "9:15 AM", complaint: "Skin rash", status: "done" as const },
  { id: 3, name: "Amit Patel", token: 3, time: "9:30 AM", complaint: "Back pain", status: "in_consultation" as const },
  { id: 4, name: "Sunita Devi", token: 4, time: "9:45 AM", complaint: "Diabetes follow-up", status: "waiting" as const },
  { id: 5, name: "Mohammed Ali", token: 5, time: "10:00 AM", complaint: "Headache", status: "waiting" as const },
  { id: 6, name: "Lakshmi Iyer", token: 6, time: "10:15 AM", complaint: "BP check-up", status: "waiting" as const },
];

const statusLabels: Record<string, string> = {
  waiting: "Waiting",
  in_consultation: "In Consultation",
  done: "Done",
  cancelled: "Cancelled",
};

export default function DashboardPage() {
  return (
    <>
      <Header
        title="Dashboard"
        subtitle="Welcome back, Dr. Smith"
      >
        <Button size="sm" variant="primary" className="gap-1.5">
          <Plus className="h-4 w-4" />
          Walk-in Patient
        </Button>
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
                  <div className="flex items-center gap-1 mt-1">
                    <TrendingUp
                      className={`h-3.5 w-3.5 ${
                        stat.change >= 0
                          ? "text-[var(--color-emerald-500)]"
                          : "text-[var(--color-rose-500)] rotate-180"
                      }`}
                    />
                    <span
                      className={`text-xs font-medium ${
                        stat.change >= 0
                          ? "text-[var(--color-emerald-600)]"
                          : "text-[var(--color-rose-600)]"
                      }`}
                    >
                      {Math.abs(stat.change)}%
                    </span>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      vs last week
                    </span>
                  </div>
                </div>
                <div
                  className={`flex h-11 w-11 items-center justify-center rounded-xl ${stat.bgClass} transition-transform duration-200 group-hover:scale-110`}
                >
                  <stat.icon className={`h-5 w-5 ${stat.iconClass}`} strokeWidth={1.8} />
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Today's Queue — takes 2 columns */}
          <Card padding="none" className="lg:col-span-2">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--color-border-subtle)]">
              <div className="flex items-center gap-3">
                <CardTitle>Today&apos;s Queue</CardTitle>
                <Badge variant="teal" dot>
                  {todaysQueue.filter((p) => p.status === "waiting").length} waiting
                </Badge>
              </div>
              <Button variant="ghost" size="sm" className="gap-1 text-[var(--color-primary)]">
                View all
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </div>

            <div className="divide-y divide-[var(--color-border-subtle)]">
              {todaysQueue.map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center gap-4 px-6 py-3.5 hover:bg-[var(--color-pearl-50)] transition-colors"
                >
                  {/* Token */}
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-pearl-100)] text-sm font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-600)]">
                    {patient.token}
                  </div>

                  {/* Avatar + Info */}
                  <Avatar
                    name={patient.name}
                    size="sm"
                    color={
                      patient.status === "in_consultation"
                        ? "teal"
                        : patient.status === "done"
                        ? "emerald"
                        : "indigo"
                    }
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                      {patient.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)] truncate">
                      {patient.complaint}
                    </p>
                  </div>

                  {/* Time */}
                  <div className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
                    <Clock className="h-3 w-3" />
                    {patient.time}
                  </div>

                  {/* Status */}
                  <Badge variant={patient.status} dot>
                    {statusLabels[patient.status]}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="space-y-6">
            <Card padding="md">
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <div className="mt-4 space-y-2">
                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-teal-50)] border border-[var(--color-border)] hover:border-[var(--color-teal-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-teal-50)] group-hover:bg-[var(--color-teal-100)] transition-colors">
                    <UserPlus className="h-4 w-4 text-[var(--color-teal-600)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>New Patient</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Register a new patient</span>
                  </div>
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-indigo-50)] border border-[var(--color-border)] hover:border-[var(--color-indigo-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-indigo-50)] group-hover:bg-[var(--color-indigo-100)] transition-colors">
                    <CalendarClock className="h-4 w-4 text-[var(--color-indigo-500)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>Add to Queue</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Walk-in appointment</span>
                  </div>
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-emerald-50)] border border-[var(--color-border)] hover:border-[var(--color-emerald-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-emerald-50)] group-hover:bg-[var(--color-emerald-100)] transition-colors">
                    <FileText className="h-4 w-4 text-[var(--color-emerald-600)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>Write Prescription</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Quick prescription</span>
                  </div>
                </button>

                <button className="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-amber-50)] border border-[var(--color-border)] hover:border-[var(--color-amber-200)] transition-all group">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-amber-50)] group-hover:bg-[var(--color-amber-100)] transition-colors">
                    <IndianRupee className="h-4 w-4 text-[var(--color-amber-600)]" />
                  </div>
                  <div className="flex flex-col items-start">
                    <span>Create Invoice</span>
                    <span className="text-xs text-[var(--color-text-muted)] font-normal">Generate bill</span>
                  </div>
                </button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
