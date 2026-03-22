import { cn, getInitials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  name: string;
  src?: string;
  size?: "sm" | "md" | "lg";
  color?: "teal" | "indigo" | "emerald" | "amber" | "rose";
}

const sizeClasses = {
  sm: "h-8 w-8 text-xs",
  md: "h-10 w-10 text-sm",
  lg: "h-12 w-12 text-base",
};

const colorClasses = {
  teal: "bg-[var(--color-teal-50)] text-[var(--color-teal-700)]",
  indigo: "bg-[var(--color-indigo-50)] text-[var(--color-indigo-600)]",
  emerald: "bg-[var(--color-emerald-50)] text-[var(--color-emerald-600)]",
  amber: "bg-[var(--color-amber-50)] text-[var(--color-amber-600)]",
  rose: "bg-[var(--color-rose-50)] text-[var(--color-rose-600)]",
};

function Avatar({ name, src, size = "md", color = "teal", className, ...props }: AvatarProps) {
  const initials = getInitials(name);

  if (src) {
    return (
      <div
        className={cn(
          "relative overflow-hidden rounded-full",
          sizeClasses[size],
          className
        )}
        {...props}
      >
        <img
          src={src}
          alt={name}
          className="h-full w-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full font-medium font-[family-name:var(--font-display)]",
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      title={name}
      {...props}
    >
      {initials}
    </div>
  );
}

export { Avatar };
