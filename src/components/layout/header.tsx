"use client";

import { Search, Bell, HelpCircle } from "lucide-react";
import { Avatar } from "@/components/ui";

interface HeaderProps {
  title: string;
  subtitle?: string;
  children?: React.ReactNode;
}

export function Header({ title, subtitle, children }: HeaderProps) {
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

        {/* User */}
        <button className="flex items-center gap-2.5 rounded-lg px-2 py-1.5 hover:bg-[var(--color-pearl-50)] transition-colors">
          <Avatar name="Dr. Smith" size="sm" color="teal" />
          <div className="hidden md:flex flex-col items-start">
            <span className="text-sm font-medium text-[var(--color-text-primary)] leading-tight">
              Dr. Smith
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)] leading-tight">
              General Medicine
            </span>
          </div>
        </button>
      </div>
    </header>
  );
}
