"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { Search, Bell, HelpCircle, LogOut, Settings, User } from "lucide-react";
import { Avatar } from "@/components/ui";
import { createClient } from "@/lib/supabase/client";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

interface UserInfo {
  name: string;
  email: string;
  avatarUrl?: string;
}

export function Header({ title, subtitle, children }: HeaderProps) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUser({
          name: user.user_metadata?.full_name || user.email?.split("@")[0] || "Doctor",
          email: user.email || "",
          avatarUrl: user.user_metadata?.avatar_url,
        });
      }
    });
  }, []);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-[var(--color-border-subtle)] bg-white/80 backdrop-blur-md px-8">
      {/* Left — Page title */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] leading-tight">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm text-[var(--color-text-muted)] leading-tight">
            {subtitle}
          </p>
        )}
      </div>

      {/* Right — Actions */}
      <div className="flex items-center gap-2">
        {children}

        {/* Search */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-pearl-100)] hover:text-[var(--color-text-secondary)] transition-colors">
          <Search className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-pearl-100)] hover:text-[var(--color-text-secondary)] transition-colors">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-[var(--color-rose-500)]" />
        </button>

        {/* Help */}
        <button className="flex h-9 w-9 items-center justify-center rounded-lg text-[var(--color-text-muted)] hover:bg-[var(--color-pearl-100)] hover:text-[var(--color-text-secondary)] transition-colors">
          <HelpCircle className="h-[18px] w-[18px]" strokeWidth={1.8} />
        </button>

        {/* Separator */}
        <div className="mx-1 h-6 w-px bg-[var(--color-border)]" />

        {/* User Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--color-pearl-50)] transition-colors"
          >
            {user?.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt=""
                className="h-8 w-8 rounded-full border border-[var(--color-border)]"
              />
            ) : (
              <Avatar name={user?.name || "Doctor"} size="sm" color="teal" />
            )}
            <div className="hidden md:flex flex-col items-start">
              <span className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
                {user?.name || "Loading..."}
              </span>
              <span className="text-[11px] text-[var(--color-text-muted)] leading-tight truncate max-w-[140px]">
                {user?.email || ""}
              </span>
            </div>
          </button>

          {/* Dropdown Menu */}
          {menuOpen && (
            <div className="absolute right-0 top-full mt-1.5 w-56 rounded-xl border border-[var(--color-border)] bg-white shadow-xl py-1.5 z-50">
              <div className="px-3.5 py-2.5 border-b border-[var(--color-border-subtle)]">
                <p className="text-sm font-medium text-[var(--color-text-primary)] truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-[var(--color-text-muted)] truncate">
                  {user?.email}
                </p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); router.push("/settings"); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-pearl-50)] transition-colors"
              >
                <Settings className="h-4 w-4" strokeWidth={1.8} />
                Settings
              </button>
              <button
                onClick={() => { setMenuOpen(false); router.push("/settings"); }}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-pearl-50)] transition-colors"
              >
                <User className="h-4 w-4" strokeWidth={1.8} />
                Profile
              </button>
              <div className="my-1 h-px bg-[var(--color-border-subtle)]" />
              <button
                onClick={handleSignOut}
                className="flex w-full items-center gap-2.5 px-3.5 py-2 text-sm text-[var(--color-rose-600)] hover:bg-[var(--color-rose-50)] transition-colors"
              >
                <LogOut className="h-4 w-4" strokeWidth={1.8} />
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
