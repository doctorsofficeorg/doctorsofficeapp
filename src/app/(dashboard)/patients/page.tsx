import { Header } from "@/components/layout";
import { Card, Button, Badge, Avatar, Input } from "@/components/ui";
import { Plus, Search, Phone, Filter, MoreHorizontal } from "lucide-react";

const patients = [
  { id: "PT-A1B2C", name: "Rajesh Kumar", phone: "9876543210", age: 45, gender: "M", lastVisit: "20 Mar 2026", visits: 12, status: "active" },
  { id: "PT-D3E4F", name: "Priya Sharma", phone: "9123456789", age: 32, gender: "F", lastVisit: "19 Mar 2026", visits: 5, status: "active" },
  { id: "PT-G5H6I", name: "Amit Patel", phone: "9988776655", age: 58, gender: "M", lastVisit: "18 Mar 2026", visits: 23, status: "active" },
  { id: "PT-J7K8L", name: "Sunita Devi", phone: "9112233445", age: 67, gender: "F", lastVisit: "15 Mar 2026", visits: 8, status: "active" },
  { id: "PT-M9N0O", name: "Mohammed Ali", phone: "9556677889", age: 29, gender: "M", lastVisit: "14 Mar 2026", visits: 2, status: "active" },
  { id: "PT-P1Q2R", name: "Lakshmi Iyer", phone: "9443322110", age: 41, gender: "F", lastVisit: "10 Mar 2026", visits: 15, status: "active" },
];

export default function PatientsPage() {
  return (
    <>
      <Header title="Patients" subtitle="Manage your patient records">
        <Button size="sm" variant="primary" className="gap-1.5">
          <Plus className="h-4 w-4" />
          New Patient
        </Button>
      </Header>

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)]">
        {/* Search and Filters */}
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

        {/* Patients Table */}
        <Card padding="none">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[var(--color-border-subtle)]">
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider font-[family-name:var(--font-body)]">
                  Patient
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Phone
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Age / Gender
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Last Visit
                </th>
                <th className="px-6 py-3.5 text-left text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Total Visits
                </th>
                <th className="px-6 py-3.5 text-right text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--color-border-subtle)]">
              {patients.map((patient, i) => (
                <tr
                  key={patient.id}
                  className="hover:bg-[var(--color-pearl-50)] transition-colors cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <Avatar
                        name={patient.name}
                        size="sm"
                        color={["teal", "indigo", "emerald", "amber", "rose"][i % 5] as any}
                      />
                      <div>
                        <p className="text-sm font-medium text-[var(--color-text-primary)]">
                          {patient.name}
                        </p>
                        <p className="text-xs text-[var(--color-text-muted)] font-[family-name:var(--font-mono)]">
                          {patient.id}
                        </p>
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
                    {patient.age}y / {patient.gender}
                  </td>
                  <td className="px-6 py-4 text-sm text-[var(--color-text-secondary)]">
                    {patient.lastVisit}
                  </td>
                  <td className="px-6 py-4">
                    <Badge variant="teal">{patient.visits} visits</Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button variant="ghost" size="icon-sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
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
