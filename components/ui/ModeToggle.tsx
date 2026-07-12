"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { useViewMode, type ViewMode } from "@/store/useViewMode";
import { Briefcase, Palette } from "lucide-react";

/**
 * Segmented pill toggle showing both modes with a sliding indicator.
 * Active side gets the accent highlight. Icon morphs between modes.
 */

const MODE_CONFIG: Record<
  ViewMode,
  { label: string; icon: typeof Briefcase; avatarSrc: string }
> = {
  professional: {
    label: "Professional",
    icon: Briefcase,
    avatarSrc: "/avatars/professional-icon.png",
  },
  artistic: {
    label: "Artistic",
    icon: Palette,
    avatarSrc: "/avatars/artistic-icon.png",
  },
};

export function ModeToggle() {
  const mode = useViewMode((s) => s.mode);
  const setMode = useViewMode((s) => s.setMode);
  const prefersReducedMotion = useReducedMotion();

  return (
    <div
      className="relative inline-flex items-center rounded-full border border-border bg-surface p-1 gap-1"
      role="radiogroup"
      aria-label="Portfolio mode"
    >
      {/* Sliding indicator */}
      <motion.div
        className="absolute top-1 bottom-1 rounded-full bg-accent/15 border border-accent/30"
        animate={{
          left: mode === "professional" ? "4px" : "50%",
          width: "calc(50% - 4px)",
        }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : { type: "spring", stiffness: 300, damping: 30 }
        }
        aria-hidden="true"
      />

      {(["professional", "artistic"] as const).map((m) => {
        const config = MODE_CONFIG[m];
        const isActive = mode === m;
        const Icon = config.icon;

        return (
          <button
            key={m}
            type="button"
            role="radio"
            aria-checked={isActive}
            onClick={() => setMode(m)}
            className={`
              relative z-10 flex items-center gap-2 rounded-full px-4 py-2
              text-sm font-medium transition-colors duration-300
              focus-visible:outline-none focus-visible:ring-2
              focus-visible:ring-accent focus-visible:ring-offset-2
              focus-visible:ring-offset-bg
              motion-reduce:transition-none
              ${isActive ? "text-text" : "text-text-muted hover:text-text/70"}
            `}
          >
            <Image
              src={config.avatarSrc}
              alt=""
              aria-hidden="true"
              width={20}
              height={20}
              className="h-5 w-5 rounded-full object-cover"
            />
            <Icon
              className={`h-3.5 w-3.5 transition-colors duration-300 motion-reduce:transition-none ${
                isActive ? "text-accent" : "text-text-muted"
              }`}
              strokeWidth={2}
            />
            <span className="hidden sm:inline">{config.label}</span>
          </button>
        );
      })}
    </div>
  );
}
