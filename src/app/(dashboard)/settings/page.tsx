import { Header } from "@/components/layout";
import { Card, CardHeader, CardTitle, CardDescription, Button, Input } from "@/components/ui";
import { Save, Upload } from "lucide-react";

export default function SettingsPage() {
  return (
    <>
      <Header title="Settings" subtitle="Manage your clinic profile" />

      <div className="p-8 space-y-6 bg-pearl-gradient-subtle min-h-[calc(100vh-64px)] max-w-4xl">
        {/* Clinic Profile */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Clinic Information</CardTitle>
            <CardDescription>
              This information appears on your prescriptions, invoices, and patient communications.
            </CardDescription>
          </CardHeader>

          <div className="mt-6 space-y-5">
            <div className="flex items-center gap-6">
              <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-[var(--color-pearl-100)] border-2 border-dashed border-[var(--color-pearl-300)]">
                <Upload className="h-6 w-6 text-[var(--color-text-muted)]" />
              </div>
              <div>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">Clinic Logo</p>
                <p className="text-xs text-[var(--color-text-muted)] mt-0.5">PNG or SVG, max 2MB. Appears on prescriptions and invoices.</p>
                <Button variant="outline" size="sm" className="mt-2">Upload Logo</Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Clinic Name" placeholder="e.g. City Health Clinic" defaultValue="City Health Clinic" />
              <Input label="Phone Number" placeholder="+91 98765 43210" defaultValue="+91 98765 43210" />
              <Input label="Email" type="email" placeholder="clinic@example.com" defaultValue="clinic@cityhealth.in" />
              <Input label="GSTIN" placeholder="22AAAAA0000A1Z5" hint="Required for GST billing" />
            </div>

            <Input label="Address" placeholder="Full clinic address" defaultValue="42, MG Road, Koramangala" />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input label="City" placeholder="City" defaultValue="Bangalore" />
              <Input label="State" placeholder="State" defaultValue="Karnataka" />
              <Input label="Pincode" placeholder="560001" defaultValue="560034" />
            </div>
          </div>
        </Card>

        {/* Doctor Profile */}
        <Card padding="lg">
          <CardHeader>
            <CardTitle>Doctor Profile</CardTitle>
            <CardDescription>
              Your professional details for prescriptions and medical records.
            </CardDescription>
          </CardHeader>

          <div className="mt-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input label="Full Name" placeholder="Dr. Full Name" defaultValue="Dr. Rajiv Mehta" />
              <Input label="Qualification" placeholder="MBBS, MD" defaultValue="MBBS, MD (General Medicine)" />
              <Input label="Registration Number" placeholder="KMC-12345" defaultValue="KMC-78543" hint="State Medical Council registration" />
              <Input label="Specialization" placeholder="General Medicine" defaultValue="General Medicine" />
            </div>
          </div>
        </Card>

        {/* Save */}
        <div className="flex justify-end">
          <Button size="lg" className="gap-2">
            <Save className="h-4 w-4" />
            Save Changes
          </Button>
        </div>
      </div>
    </>
  );
}
