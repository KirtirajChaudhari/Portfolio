"use client";

import { motion, useReducedMotion, type Target } from "motion/react";
import { professionalHero } from "@/content/professional";
import { useMounted } from "@/hooks/useMounted";

// Spec: left enters from x:+150, right from x:-150 — both spring inward to center.
const ENTER = { type: "spring" as const, bounce: 0, duration: 1, delay: 0.3 };

export function Hero() {
  const mounted = useMounted();
  const reduce = useReducedMotion();

  // Presence-safe entrance: hidden until the post-hydration mount flip, then
  // springs in. `initial` is skipped inside ViewTransition's AnimatePresence.
  const column = (from: number): Target =>
    reduce || mounted ? { x: 0, opacity: 1 } : { x: from, opacity: 0 };

  return (
    <section
      id="hero"
      className="relative flex h-dvh w-full items-center justify-center overflow-hidden"
    >
      {/* Container: max-width 1200px, large gap between columns */}
      <div className="mx-auto flex w-full max-w-[1200px] flex-col items-center gap-10 px-6 tablet:flex-row tablet:items-center tablet:justify-center tablet:gap-[6vw] desktop:gap-[370px]">
        {/* ——— Left column: right-aligned, ending in the big word ——— */}
        <motion.div
          initial={false}
          animate={column(150)}
          transition={reduce ? { duration: 0 } : ENTER}
          className="flex w-full flex-col items-center text-center tablet:w-1/2 tablet:max-w-[50%] tablet:items-end tablet:text-right"
        >
          <div className="relative pr-2.5">
            {/* Name label — absolutely pinned above the big word */}
            <span className="type-heading absolute -top-8 left-1 text-[24px] font-normal leading-none text-text tablet:-top-11 tablet:text-[32px]">
              {professionalHero.label}
            </span>
            {/* Big word: Heading 1 — 120/96/56px responsive */}
            <span className="type-heading -ml-2.5 block text-[56px] font-bold leading-[1.1] tracking-[-0.03em] text-text tablet:text-[96px] desktop:text-[120px]">
              {professionalHero.bigWordLeft}
            </span>
          </div>
        </motion.div>

        {/* ——— Right column: left-aligned, starting with the big word ——— */}
        <motion.div
          initial={false}
          animate={column(-150)}
          transition={reduce ? { duration: 0 } : ENTER}
          className="flex w-full flex-col items-center text-center tablet:w-1/2 tablet:max-w-[50%] tablet:items-start tablet:text-left"
        >
          <div className="relative">
            {/* Big word: Heading 1 — same responsive scale */}
            <span className="type-heading block text-[56px] font-bold leading-[1.1] tracking-[-0.03em] text-text tablet:text-[96px] desktop:text-[120px]">
              {professionalHero.bigWordRight}
            </span>
            {/* Tagline — pinned under the big word on tablet+, in-flow on phone */}
            <p
              className="mt-5 max-w-[90%] text-[16px] font-light leading-[1.5] text-text-muted tablet:absolute tablet:right-0 tablet:-bottom-[65px] tablet:mt-0 tablet:text-right desktop:text-[18px]"
              style={{ fontFamily: "var(--font-inter), sans-serif" }}
            >
              {professionalHero.tagline}
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
