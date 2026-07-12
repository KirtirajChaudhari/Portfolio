"use client";

import type { ReactNode } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
} from "motion/react";
import { useViewMode, type SwitchDirection } from "@/store/useViewMode";

/**
 * Perspective-rotation transition between professional and artistic views.
 * Outgoing view tilts away on the Y-axis; incoming tilts in from the opposite side.
 * Under prefers-reduced-motion → pure cross-fade (no transform).
 */

const DURATION_S = 0.6;
const EASE: [number, number, number, number] = [0.32, 0.72, 0, 1];

const perspectiveVariants: Variants = {
  enter: (dir: SwitchDirection) => ({
    opacity: 0,
    rotateY: dir === "toArtistic" ? 4 : -4,
    x: dir === "toArtistic" ? 40 : -40,
    filter: "blur(4px)",
  }),
  center: {
    opacity: 1,
    rotateY: 0,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (dir: SwitchDirection) => ({
    opacity: 0,
    rotateY: dir === "toArtistic" ? -4 : 4,
    x: dir === "toArtistic" ? -40 : 40,
    filter: "blur(4px)",
    pointerEvents: "none" as const,
  }),
};

const reducedVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0, pointerEvents: "none" as const },
};

interface ViewTransitionProps {
  professional: ReactNode;
  artistic: ReactNode;
}

export function ViewTransition({
  professional,
  artistic,
}: ViewTransitionProps) {
  const mode = useViewMode((s) => s.mode);
  const direction = useViewMode((s) => s.direction);
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion
    ? reducedVariants
    : perspectiveVariants;

  return (
    <div className="relative" style={{ perspective: "1200px" }}>
      <div aria-live="polite" className="sr-only">
        {mode === "professional"
          ? "Professional side shown"
          : "Artistic side shown"}
      </div>

      <div className="grid overflow-x-clip">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={mode}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: DURATION_S, ease: EASE }}
            className="col-start-1 row-start-1 min-w-0"
            style={{ transformOrigin: "center center" }}
          >
            {mode === "professional" ? professional : artistic}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
