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
 * Transition design
 * -----------------
 * Spatial model: professional = left panel, artistic = right panel.
 * Switching should read like turning to face the other side, so BOTH views
 * move in the same world-direction (camera pans right → everything shifts
 * left, and vice versa):
 *
 *   toArtistic:      outgoing exits to −24px, incoming enters from +24px
 *   toProfessional:  outgoing exits to +24px, incoming enters from −24px
 *
 * 24px is deliberate: enough displacement to feel directional, small enough
 * that it stays a "turn" — a full-viewport slide at this duration would read
 * as page navigation, not a mode change.
 */
const SHIFT_PX = 24;
const DURATION_S = 0.5;
/** easeInOutCubic — symmetric and calm; nothing springy. */
const EASE: [number, number, number, number] = [0.65, 0, 0.35, 1];

const directionalVariants: Variants = {
  // `dir` arrives via the `custom` prop — see the AnimatePresence note below.
  enter: (dir: SwitchDirection) => ({
    opacity: 0,
    x: dir === "toArtistic" ? SHIFT_PX : -SHIFT_PX,
  }),
  center: { opacity: 1, x: 0 },
  exit: (dir: SwitchDirection) => ({
    opacity: 0,
    x: dir === "toArtistic" ? -SHIFT_PX : SHIFT_PX,
    // The outgoing view lingers on screen for ~0.5s while fading; make sure
    // a stray tap can't hit its buttons/links mid-exit.
    pointerEvents: "none",
  }),
};

/**
 * prefers-reduced-motion: same choreography with all translation removed —
 * a plain cross-fade. Opacity changes are generally considered safe; it's
 * the movement that triggers vestibular issues.
 * (useReducedMotion returns null before hydration; treating that as "full
 * motion" is safe because initial={false} means nothing animates at mount.)
 */
const reducedVariants: Variants = {
  enter: { opacity: 0 },
  center: { opacity: 1 },
  exit: { opacity: 0, pointerEvents: "none" },
};

interface ModeSwitcherProps {
  professional: ReactNode;
  artistic: ReactNode;
}

export function ModeSwitcher({ professional, artistic }: ModeSwitcherProps) {
  const mode = useViewMode((s) => s.mode);
  const direction = useViewMode((s) => s.direction);
  const prefersReducedMotion = useReducedMotion();

  const variants = prefersReducedMotion ? reducedVariants : directionalVariants;

  return (
    <div className="relative">
      {/*
        The ModeToggle's visible label names the TARGET side, so it flips on
        every activation. This polite live region is what actually tells
        screen-reader users which side is now shown (see the semantics
        rationale in ModeToggle.tsx).
      */}
      <div aria-live="polite" className="sr-only">
        {mode === "professional"
          ? "Professional side shown"
          : "Artistic side shown"}
      </div>

      {/*
        Grid-stack instead of AnimatePresence's mode="popLayout":
        both children occupy the same grid cell (col 1 / row 1), so during the
        0.5s overlap the outgoing and incoming views cross-fade in normal
        document flow — no absolute positioning, no layout measurement, and
        anything below this region never thrashes (the cell simply holds
        max(outgoing, incoming) height while both exist, then settles).

        overflow-x-clip: the ±24px offsets would otherwise flash a horizontal
        scrollbar on mobile. `clip` rather than `hidden` because clip doesn't
        create a scroll container.
      */}
      <div className="grid overflow-x-clip">
        {/*
          custom={direction} on AnimatePresence ITSELF is load-bearing: the
          exiting child's own props were frozen when it mounted, so its exit
          variant would otherwise see a stale direction from the previous
          switch. AnimatePresence forwards its current `custom` value to
          exiting children, keeping both halves of the animation in agreement.

          initial={false}: no entrance animation on first paint — a recruiter
          lands on a static, fully-visible professional view.
        */}
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
          >
            {mode === "professional" ? professional : artistic}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
