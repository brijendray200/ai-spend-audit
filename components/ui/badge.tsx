import type { HTMLAttributes } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type BadgeProps = HTMLAttributes<HTMLDivElement> & {
  variant?: "neutral" | "primary";
};

const variantClasses = {
  neutral: "bg-[color:rgba(148,163,184,0.14)] text-[color:var(--foreground)]",
  primary: "bg-[color:rgba(56,189,248,0.14)] text-[color:var(--primary)]",
};

export function Badge({
  className,
  variant = "neutral",
  ...props
}: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em]",
        variantClasses[variant],
        className,
      )}
      {...props}
    />
  );
}
