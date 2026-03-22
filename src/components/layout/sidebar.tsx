"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  CalendarClock,
  FileText,
  Receipt,
  Settings,
  Stethoscope,
  LogOut,
  ChevronLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

const navItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Patients",
    href: "/patients",
    icon: Users,
  },
  {
    title: "Appointments",
    href: "/appointments",
    icon: CalendarClock,
  },
  {
    title: "Prescriptions",
    href: "/prescriptions",
    icon: FileText,
  },
  {
    title: "Billing",
    href: "/billing",
    icon: Receipt,
  },
];

const bottomItems = [
  {
    title: "Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-[var(--color-border)] bg-white transition-all duration-300 ease-out",
        collapsed ? "w-[72px]" : "w-[260px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-[var(--color-border-subtle)] px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[var(--color-teal-600)] to-[var(--color-teal-700)] shadow-sm">
          <Stethoscope className="h-5 w-5 text-white" strokeWidth={2} />
        </div>
        {!collapsed && (
          <div className="flex flex-col animate-fade-in">
            <span className="text-[15px] font-semibold font-[family-name:var(--font-display)] text-[var(--color-pearl-900)] leading-tight">
              Doctors Office
            </span>
            <span className="text-[11px] text-[var(--color-text-muted)] leading-tight">
              Clinic Management
            </span>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {navItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--color-teal-50)] text-[var(--color-teal-700)] shadow-sm border border-[rgba(20,184,166,0.1)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-pearl-50)] hover:text-[var(--color-text-primary)]",
                collapsed && "justify-center px-0"
              )}
              title={collapsed ? item.title : undefined}
            >
              <item.icon
                className={cn(
                  "h-[18px] w-[18px] shrink-0 transition-colors",
                  isActive
                    ? "text-[var(--color-teal-600)]"
                    : "text-[var(--color-text-muted)] group-hover:text-[var(--color-text-secondary)]"
                )}
                strokeWidth={isActive ? 2.2 : 1.8}
              />
              {!collapsed && (
                <span className="font-[family-name:var(--font-body)]">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom section */}
      <div className="border-t border-[var(--color-border-subtle)] px-3 py-3 space-y-1">
        {bottomItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-[var(--color-pearl-100)] text-[var(--color-text-primary)]"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-pearl-50)] hover:text-[var(--color-text-primary)]",
                collapsed && "justify-center px-0"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0 text-[var(--color-text-muted)]" strokeWidth={1.8} />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className={cn(
            "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-text-muted)] hover:bg-[var(--color-pearl-50)] hover:text-[var(--color-text-secondary)] transition-all duration-200",
            collapsed && "justify-center px-0"
          )}
        >
          <ChevronLeft
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
            strokeWidth={1.8}
          />
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
