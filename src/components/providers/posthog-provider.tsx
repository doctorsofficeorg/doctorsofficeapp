"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { initPostHog } from "@/lib/posthog";

export function PostHogProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  useEffect(() => {
    const ph = initPostHog();
    if (ph && ph.capture) {
      ph.capture("$pageview", { $current_url: window.location.href });
    }
  }, [pathname]);

  return <>{children}</>;
}
