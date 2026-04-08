import Link from "next/link";
import { Stethoscope, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import { isDemoMode } from "@/lib/demo-data";

async function getUser() {
  if (isDemoMode) return null;
  const { createClient } = await import("@/lib/supabase/server");
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  return user;
}

export default async function LandingPage() {
  const user = await getUser();

  return (
    <div className="min-h-screen bg-pearl-mesh">
      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-5 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-teal-600)] to-[var(--color-teal-700)] shadow-md">
            <Stethoscope className="h-5 w-5 text-white" strokeWidth={2} />
          </div>
          <span className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">
            Doctors Office
          </span>
        </div>
        <div className="flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2">
                {user.user_metadata?.avatar_url && (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt=""
                    className="h-8 w-8 rounded-full border border-[var(--color-border)]"
                  />
                )}
                <span className="text-sm font-medium text-[var(--color-text-primary)]">
                  {user.user_metadata?.full_name || user.email}
                </span>
              </div>
              <Link
                href="/dashboard"
                className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                Go to Dashboard
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="px-5 py-2.5 text-sm font-medium text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-lg shadow-sm hover:shadow-md transition-all active:scale-[0.98]"
              >
                Get Started Free
              </Link>
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="max-w-7xl mx-auto px-8 pt-20 pb-32 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[var(--color-teal-50)] border border-[rgba(20,184,166,0.2)] text-sm text-[var(--color-teal-700)] font-medium mb-8">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--color-teal-500)]" />
          Trusted by 500+ doctors across India
        </div>

        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] leading-[1.1] tracking-tight max-w-4xl mx-auto">
          Your clinic,{" "}
          <span className="bg-gradient-to-r from-[var(--color-teal-600)] to-[var(--color-teal-500)] bg-clip-text text-transparent">
            beautifully
          </span>{" "}
          managed
        </h1>

        <p className="mt-6 text-lg md:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
          Record patients, generate prescriptions, and share via WhatsApp — all
          in under 60 seconds. The clinic management platform that doctors
          actually love using.
        </p>

        <div className="mt-10 flex items-center justify-center gap-4">
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-semibold text-white bg-[var(--color-primary)] hover:bg-[var(--color-primary-hover)] rounded-xl shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
          >
            Start Free Trial
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link
            href="#features"
            className="inline-flex items-center gap-2 px-7 py-3.5 text-base font-medium text-[var(--color-text-primary)] bg-white border border-[var(--color-border)] hover:bg-[var(--color-pearl-50)] rounded-xl shadow-sm transition-all"
          >
            See How It Works
          </Link>
        </div>

        <p className="mt-4 text-sm text-[var(--color-text-muted)]">
          Free forever for solo practitioners &middot; No credit card required
        </p>
      </section>

      {/* Feature Cards */}
      <section id="features" className="max-w-7xl mx-auto px-8 pb-32">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-8 group hover:border-[var(--color-teal-200)] transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-teal-50)] group-hover:bg-[var(--color-teal-100)] transition-colors mb-5">
              <Zap className="h-6 w-6 text-[var(--color-teal-600)]" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] mb-2">
              60-Second Prescriptions
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Generate professional prescriptions and share them instantly via
              WhatsApp. Your patients receive a clean PDF within seconds.
            </p>
          </div>

          <div className="card p-8 group hover:border-[var(--color-indigo-200)] transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-indigo-50)] group-hover:bg-[var(--color-indigo-100)] transition-colors mb-5">
              <Shield className="h-6 w-6 text-[var(--color-indigo-500)]" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] mb-2">
              Your Data, Your Control
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Unlike marketplace platforms, your patient data stays yours.
              Enterprise-grade encryption, DPDPA compliant, stored in India.
            </p>
          </div>

          <div className="card p-8 group hover:border-[var(--color-emerald-200)] transition-all">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[var(--color-emerald-50)] group-hover:bg-[var(--color-emerald-100)] transition-colors mb-5">
              <Globe className="h-6 w-6 text-[var(--color-emerald-600)]" strokeWidth={1.8} />
            </div>
            <h3 className="text-lg font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] mb-2">
              GST-Ready Billing
            </h3>
            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
              Automated invoicing with GST calculation, UPI payment tracking,
              and downloadable reports for your CA at filing time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-8 px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>&copy; 2026 Doctors Office. All rights reserved.</span>
          <div className="flex items-center gap-6">
            <Link href="/privacy" className="hover:text-[var(--color-text-secondary)] transition-colors">
              Privacy Policy
            </Link>
            <Link href="/terms" className="hover:text-[var(--color-text-secondary)] transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
