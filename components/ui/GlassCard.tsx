import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
}

export function GlassCard({
  children,
  className = "",
  hover = true,
}: GlassCardProps) {
  return (
    <div
      className={`
        glass rounded-2xl p-6
        ${
          hover
            ? "transition-all duration-500 ease-out hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg hover:shadow-accent-glow/10 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            : ""
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
