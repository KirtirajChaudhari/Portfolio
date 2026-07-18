"use client";

import Image from "next/image";
import { motion } from "motion/react";
import { Settings, Music, type LucideIcon } from "lucide-react";
import { useViewMode, type ViewMode } from "@/store/useViewMode";

/**
 * Snow-globe style chapter toggle.
 * Recreates the 3D globe + pedestal look from the design reference,
 * with two prominent globe buttons side by side.
 */

const MODE_CONFIG: Record<
  ViewMode,
  {
    label: string;
    avatarSrc: string;
    theme: "blue" | "amber";
    icon: LucideIcon;
  }
> = {
  professional: {
    label: "The Engineer",
    avatarSrc: "/avatars/professional-icon.png",
    theme: "blue",
    icon: Settings,
  },
  artistic: {
    label: "The Artist",
    avatarSrc: "/avatars/artistic-icon.png",
    theme: "amber",
    icon: Music,
  },
};

export function ModeToggle({
  onModeChange,
}: {
  onModeChange?: (mode: ViewMode) => void;
} = {}) {
  const setMode = useViewMode((s) => s.setMode);

  return (
    <div className="relative flex items-center justify-center gap-16 md:gap-20 select-none">
      <Globe
        mode="professional"
        active={true}
        onClick={() => {
          setMode("professional");
          onModeChange?.("professional");
        }}
      />

      {/* Desktop Mouse Scroll Hint (Absolutely Centered Between Globes) */}
      <div className="pointer-events-none hidden md:flex absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex-col items-center justify-center opacity-75">
        <div className="w-5 h-9 md:w-6 md:h-10 border-[1.5px] border-white/40 rounded-full flex justify-center p-1.5 shadow-[0_0_15px_rgba(255,255,255,0.1),inset_0_0_10px_rgba(255,255,255,0.05)] bg-white/5 backdrop-blur-sm">
          <motion.div
            animate={{ y: [0, 10, 0], opacity: [1, 0.2, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1.5 md:w-1.5 md:h-2 bg-white rounded-full shadow-[0_0_8px_2px_rgba(255,255,255,0.8)]"
          />
        </div>
      </div>

      <Globe
        mode="artistic"
        active={true}
        onClick={() => {
          setMode("artistic");
          onModeChange?.("artistic");
        }}
      />
    </div>
  );
}

function Globe({
  mode,
  active,
  onClick,
}: {
  mode: ViewMode;
  active: boolean;
  onClick: () => void;
}) {
  const config = MODE_CONFIG[mode];
  const Icon = config.icon;
  const isBlue = config.theme === "blue";

  // Colors based on theme
  const glowColor = isBlue ? "rgba(59, 130, 246, 0.5)" : "rgba(245, 158, 11, 0.5)";
  const borderColor = isBlue ? "border-blue-500/30" : "border-amber-500/30";
  const activeBorderColor = isBlue ? "border-blue-500" : "border-amber-500";
  const iconBg = isBlue ? "bg-blue-950" : "bg-amber-950";
  const iconColor = isBlue ? "text-blue-400" : "text-amber-400";

  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
      className="group flex flex-col items-center focus-visible:outline-none"
    >
      {/* The Globe Dome */}
      <div
        className="relative w-16 h-16 md:w-20 md:h-20 rounded-full mb-2 z-10 overflow-hidden border border-white/10"
        style={{
          boxShadow: active
            ? `0 0 20px 0 ${glowColor}, inset 0 -5px 10px -2px ${glowColor}`
            : `inset 0 -5px 10px -2px rgba(255,255,255,0.05)`,
          background: "rgba(0,0,0,0.4)",
        }}
      >
        {/* Avatar Image */}
        <div className="absolute inset-1 rounded-full overflow-hidden">
          <Image
            src={config.avatarSrc}
            alt={config.label}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 64px, 80px"
          />
        </div>

        {/* Glass reflection highlight (top-left) */}
        <div
          className="absolute inset-0 rounded-full pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 35% 25%, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 70%)",
          }}
        />
      </div>

      {/* The Pedestal Base */}
      <div
        className={`relative z-20 flex items-center gap-1.5 px-2.5 py-1.5 md:px-3 md:py-2 rounded-full border bg-[#0a0a0c] shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)] transition-colors duration-300 ${
          active ? activeBorderColor : borderColor
        }`}
      >
        {/* Icon Circle */}
        <div className={`flex items-center justify-center w-5 h-5 md:w-6 md:h-6 rounded-full ${iconBg}`}>
          <Icon className={`w-3 h-3 md:w-3.5 md:h-3.5 ${iconColor}`} strokeWidth={2.5} />
        </div>
        
        {/* Label */}
        <span
          className={`type-heading text-[8px] md:text-[9px] tracking-[0.2em] uppercase mt-[1px] ${
            active ? "text-white drop-shadow-[0_0_8px_rgba(255,255,255,0.5)]" : "text-white/60"
          }`}
        >
          {config.label}
        </span>
      </div>
    </motion.button>
  );
}
