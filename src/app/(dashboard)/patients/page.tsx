import { Header } from "@/components/layout";
import { Card, Badge, Avatar, Button } from "@/components/ui";
import { Search, Phone, Filter, MoreHorizontal } from "lucide-react";
import { PatientForm } from "@/components/forms/patient-form";
import { getPatients } from "@/lib/actions/patients";
import { formatDate } from "@/lib/utils";

export default async function PatientsPage() {
  const patients = await getPatients();

  return (
    <>
      <Header title="Patients" subtitle="Manage your patient records">
        <PatientForm />
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--color-text-muted)]" />
            <input
              type="text"
              placeholder="Search by name or phone number..."
              className="input-base w-full pl-10"
            />
          </div>
          <Button variant="outline" size="md" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>

        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider font-[family-name:var(--font-body)]">Patient</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Phone</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Age / Gender</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Blood Group</th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Registered</th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {patients.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[var(--color-text-muted)]">
                    No patients yet. Click &quot;New Patient&quot; to register one.
                  </td>
                </tr>
              ) : (
                patients.map((patient, i) => (
                  <tr key={patient.id} className="hover:bg-[var(--color-pearl-50)] transition-colors cursor-pointer">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <Avatar
                          name={patient.fullName}
                          size="sm"
                          color={["teal", "indigo", "emerald", "amber", "rose"][i % 5] as "teal" | "indigo" | "emerald" | "amber" | "rose"}
                        />
                        <div>
                          <p className="text-sm font-medium text-[var(--color-text-primary)]">{patient.fullName}</p>
                          <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">{patient.patientUid}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                        <Phone className="h-3.5 w-3.5 text-[var(--color-text-muted)]" />
                        {patient.phone}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {patient.age ? `${patient.age}y` : "—"} / {patient.gender.charAt(0).toUpperCase()}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {patient.bloodGroup || "—"}
                    </td>
                    <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                      {formatDate(patient.createdAt)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="icon-sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
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
