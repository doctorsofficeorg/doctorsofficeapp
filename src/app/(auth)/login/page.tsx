"use client";

import Link from "next/link";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Stethoscope } from "lucide-react";
import { Button, Input } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

const isDemoMode =
  !process.env.NEXT_PUBLIC_SUPABASE_URL;

function OAuthCodeHandler() {
  const searchParams = useSearchParams();
  const [exchanging, setExchanging] = useState(false);

  useEffect(() => {
    const code = searchParams.get("code");
    if (code && !exchanging) {
      setExchanging(true);
      const supabase = createClient();
      supabase.auth.exchangeCodeForSession(code).then(({ data, error }) => {
        if (!error && data.session) {
          // Full page redirect so middleware picks up the new session cookies
          window.location.href = "/dashboard";
        } else {
          console.error("OAuth code exchange failed:", error?.message);
          setExchanging(false);
        }
      });
    }
  }, [searchParams, exchanging]);

  if (exchanging) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-sm">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--color-teal-600)] border-t-transparent mx-auto mb-3" />
          <p className="text-sm text-[var(--color-text-secondary)]">Signing you in...</p>
        </div>
      </div>
    );
  }

  return null;
}

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (isDemoMode) {
      router.push("/dashboard");
      return;
    }

    const form = new FormData(e.currentTarget);
    const email = (form.get("email") as string).trim();
    const password = form.get("password") as string;

    if (!email || !password) {
      setError("Email and password are required.");
      setLoading(false);
      return;
    }

    const supabase = createClient();
    const { error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      router.push("/dashboard");
      router.refresh();
    }
  }

  async function handleGoogleSignIn() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });
  }

  return (
    <div className="min-h-screen bg-pearl-gradient flex">
      <Suspense fallback={null}>
        <OAuthCodeHandler />
      </Suspense>
      {/* Left — Branding panel */}
      <div className="hidden lg:flex lg:w-1/2 items-center justify-center bg-gradient-to-br from-[var(--color-teal-700)] to-[var(--color-teal-900)] p-12 relative overflow-hidden">
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

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-[var(--color-rose-50)] text-sm text-[var(--color-rose-600)]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} method="post" className="space-y-5">
            <Input
              name="email"
              label="Email"
              type="email"
              placeholder="doctor@clinic.com"
              autoComplete="username"
              required
            />

            <div>
              <Input
                name="password"
                label="Password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                required
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

            <Button type="submit" className="w-full" size="lg" loading={loading}>
              Sign In
            </Button>
          </form>

          <div className="mt-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-text-muted)]">or continue with</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          <div className="mt-6">
            <Button variant="outline" size="lg" className="w-full text-sm gap-2" onClick={handleGoogleSignIn}>
              <svg className="h-4 w-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Sign in with Google
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
