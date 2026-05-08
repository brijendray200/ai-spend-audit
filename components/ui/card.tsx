import type { HTMLAttributes } from "react";

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[30px] border border-[color:var(--border)] bg-[color:var(--surface)] shadow-[0_24px_80px_-36px_rgba(14,23,38,0.4)] backdrop-blur",
        className,
      )}
      {...props}
    />
  );
}
