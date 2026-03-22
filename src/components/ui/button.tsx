import { forwardRef } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium font-[family-name:var(--font-body)] transition-all duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer",
  {
    variants: {
      variant: {
        primary:
          "bg-[var(--color-primary)] text-white hover:bg-[var(--color-primary-hover)] focus-visible:ring-[var(--color-teal-400)] shadow-sm hover:shadow-md active:scale-[0.98]",
        secondary:
          "bg-[var(--color-pearl-100)] text-[var(--color-pearl-700)] hover:bg-[var(--color-pearl-200)] focus-visible:ring-[var(--color-pearl-400)]",
        outline:
          "border border-[var(--color-border)] bg-white text-[var(--color-text-primary)] hover:bg-[var(--color-pearl-50)] focus-visible:ring-[var(--color-pearl-400)]",
        ghost:
          "text-[var(--color-text-secondary)] hover:bg-[var(--color-pearl-100)] hover:text-[var(--color-text-primary)] focus-visible:ring-[var(--color-pearl-400)]",
        danger:
          "bg-[var(--color-rose-600)] text-white hover:bg-[var(--color-rose-500)] focus-visible:ring-[var(--color-rose-500)]",
        success:
          "bg-[var(--color-emerald-600)] text-white hover:bg-[var(--color-emerald-700)] focus-visible:ring-[var(--color-emerald-500)]",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-md",
        md: "h-10 px-4 text-sm",
        lg: "h-11 px-6 text-base",
        icon: "h-10 w-10",
        "icon-sm": "h-8 w-8 rounded-md",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, loading, children, disabled, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={disabled || loading}
        {...props}
      >
        {loading && (
          <svg
            className="h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants };
