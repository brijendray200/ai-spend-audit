import type { ButtonHTMLAttributes } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "default" | "outline" | "secondary";
  size?: "sm" | "default" | "lg";
};

const variantClasses = {
  default:
    "bg-[color:var(--primary)] text-[color:var(--primary-foreground)] shadow-lg shadow-sky-950/15 hover:-translate-y-0.5 hover:bg-sky-500",
  outline:
    "border border-[color:var(--border)] bg-[color:var(--surface)] text-[color:var(--foreground)] hover:bg-[color:var(--surface-strong)]",
  secondary:
    "bg-[color:var(--secondary)] text-[color:var(--foreground)] hover:opacity-90",
};

const sizeClasses = {
  sm: "h-9 px-4 text-xs",
  default: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-base",
};

export function Button({
  className,
  variant = "default",
  size = "default",
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center rounded-full font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--background)] disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
