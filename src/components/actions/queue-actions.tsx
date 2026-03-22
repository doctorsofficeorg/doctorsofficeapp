"use client";

import { useState } from "react";
import { Button } from "@/components/ui";
import { ArrowRight } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/actions/appointments";

interface QueueActionsProps {
  appointmentId: string;
  action: string;
  nextStatus: "in_consultation" | "done";
  variant: "primary" | "success";
}

export function QueueActions({ appointmentId, action, nextStatus, variant }: QueueActionsProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    setLoading(true);
    try {
      await updateAppointmentStatus(appointmentId, nextStatus);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant={variant} size="sm" className="gap-1" onClick={handleClick} loading={loading}>
      {action}
      <ArrowRight className="h-3.5 w-3.5" />
    </Button>
  );
}
