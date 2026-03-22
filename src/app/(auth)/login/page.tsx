"use client";

import Link from "next/link";
import { useState } from "react";
import { Stethoscope } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-pearl-gradient flex">
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-[var(--color-teal-700)] to-[var(--color-teal-900)] p-12 relative overflow-hidden">
        {/* Decorative circles */}
        <div className="absolute -top-20 -left-20 h-64 w-64 rounded-full bg-white/5" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-white/5" />
        <div className="absolute top-1/3 right-10 h-40 w-40 rounded-full bg-white/5" />

        <div className="relative z-10 max-w-md text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 backdrop-blur-sm mx-auto mb-8">
            <Stethoscope className="h-8 w-8 text-white" strokeWidth={1.8} />
          </div>
          <h2 className="text-3xl font-bold font-[family-name:var(--font-display)] text-white mb-4">
            Welcome to Doctors Office
          </h2>
          <p className="text-teal-100 text-base leading-relaxed">
            The clinic management platform trusted by doctors across India.
            Manage patients, prescriptions, and billing — all in one place.
          </p>
        </div>
      </div>

      {/* Right — Login form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-3 mb-10">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--color-teal-600)] to-[var(--color-teal-700)] shadow-md">
              <Stethoscope className="h-5 w-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)]">
              Doctors Office
            </span>
          </div>

          <h1 className="text-2xl font-bold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] mb-1">
            Sign in to your account
          </h1>
          <p className="text-sm text-[var(--color-text-secondary)] mb-8">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
            >
              Create one for free
            </Link>
          </p>

          <div className="space-y-5">
            <Input
              label="Email or Phone"
              type="text"
              placeholder="doctor@clinic.com or 98765 43210"
              autoComplete="username"
            />

            <div>
              <Input
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
              <div className="mt-1.5 text-right">
                <Link
                  href="/forgot-password"
                  className="text-xs text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] font-medium transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </div>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">or continue with</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <div className="mt-6 grid grid-cols-2 gap-3">
            <Button variant="outline" size="lg" className="text-sm">
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </Button>
            <Button variant="outline" size="lg" className="text-sm">
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
              </svg>
              WhatsApp
            </Button>
          </div>

          <p className="mt-8 text-center text-xs text-[var(--color-text-muted)]">
            By signing in, you agree to our{" "}
            <Link href="/terms" className="text-[var(--color-primary)] hover:underline">Terms of Service</Link>
            {" "}and{" "}
            <Link href="/privacy" className="text-[var(--color-primary)] hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
