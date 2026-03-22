import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium font-[family-name:var(--font-body)] transition-colors",
  {
    variants: {
      variant: {
        default: "bg-[var(--color-pearl-100)] text-[var(--color-pearl-600)] border border-[var(--color-pearl-200)]",
        waiting: "badge-waiting",
        in_consultation: "badge-in-consultation",
        done: "badge-done",
        cancelled: "badge-cancelled",
        no_show: "bg-[var(--color-pearl-100)] text-[var(--color-pearl-500)] border border-[var(--color-pearl-200)]",
        teal: "bg-[var(--color-teal-50)] text-[var(--color-teal-700)] border border-[rgba(20,184,166,0.2)]",
        indigo: "bg-[var(--color-indigo-50)] text-[var(--color-indigo-600)] border border-[rgba(99,102,241,0.2)]",
        emerald: "bg-[var(--color-emerald-50)] text-[var(--color-emerald-600)] border border-[rgba(16,185,129,0.2)]",
        amber: "bg-[var(--color-amber-50)] text-[var(--color-amber-600)] border border-[rgba(245,158,11,0.2)]",
        rose: "bg-[var(--color-rose-50)] text-[var(--color-rose-600)] border border-[rgba(244,63,94,0.2)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean;
}

function Badge({ className, variant, dot, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" />
      )}
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
