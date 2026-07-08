"use client";

import type { ReactNode } from "react";
import { useViewMode } from "@/store/useViewMode";
import { useSwipe } from "@/hooks/useSwipe";
import { useModeHotkeys } from "@/hooks/useModeHotkeys";
import { ModeToggle } from "@/components/ModeToggle";
import { ModeSwitcher } from "@/components/ModeSwitcher";

interface PortfolioShellProps {
  professional: ReactNode;
  artistic: ReactNode;
}

/**
 * The interaction root. Owns the swipe surface and keyboard hotkeys, renders
 * the STABLE hero frame (mounted once, never remounts across mode changes),
 * and hands the two views to ModeSwitcher — the only region that swaps.
 *
 * `professional` / `artistic` are ReactNode props on purpose: the real
 * portfolio sections can stay Server Components and be slotted through this
 * client boundary from a server `page.tsx`. Both sides ship in the initial
 * payload, which is also why switching is instant — nothing is fetched.
 */
export function PortfolioShell({
  professional,
  artistic,
}: PortfolioShellProps) {
  const mode = useViewMode((s) => s.mode);
  const setMode = useViewMode((s) => s.setMode);

  useModeHotkeys();

  // Swipe mirrors the transition's world-direction: pushing content LEFT
  // reveals the right-hand (artistic) panel, and vice versa — the exit
  // animation then moves the same way the finger just did. Attached to the
  // whole shell so the gesture works anywhere on the page, not just the hero.
  const swipeRef = useSwipe<HTMLDivElement>({
    onSwipeLeft: () => setMode("artistic"),
    onSwipeRight: () => setMode("professional"),
  });

  return (
    <div
      ref={swipeRef}
      className="min-h-screen bg-[#0C0C0C] text-white antialiased"
    >
      {/* ——— Stable hero frame: shared by both modes, never unmounts ——— */}
      <header className="mx-auto flex max-w-3xl flex-col items-center gap-6 px-6 pb-12 pt-20 text-center">
        {/*
          Shared avatar frame. The frame element persists across switches;
          only its treatment cross-fades (two stacked layers, opacity-only —
          cheap, and disabled under reduced motion). Swap the gradients for
          the two real avatar images later.
        */}
        <div className="relative h-24 w-24 overflow-hidden rounded-full ring-1 ring-white/15">
          <div
            className={`absolute inset-0 bg-gradient-to-br from-sky-400/70 to-slate-700 transition-opacity duration-500 motion-reduce:transition-none ${
              mode === "professional" ? "opacity-100" : "opacity-0"
            }`}
          />
          <div
            className={`absolute inset-0 bg-gradient-to-br from-fuchsia-400/70 to-amber-500/70 transition-opacity duration-500 motion-reduce:transition-none ${
              mode === "artistic" ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>

        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Your Name</h1>
          {/* Copy may react to mode; the element itself stays put. */}
          <p className="mt-1 text-sm text-white/50">
            {mode === "professional"
              ? "Engineer — the day job"
              : "Artist — after hours"}
          </p>
        </div>

        <ModeToggle />

        {/*
          Mobile-only affordance that the canvas is swipeable. Decorative and
          aria-hidden: the toggle above is the accessible path, and these dots
          would only add noise for assistive tech.
        */}
        <div className="flex items-center gap-3 md:hidden" aria-hidden="true">
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
              mode === "professional" ? "bg-white/80" : "bg-white/25"
            }`}
          />
          <span
            className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 motion-reduce:transition-none ${
              mode === "artistic" ? "bg-white/80" : "bg-white/25"
            }`}
          />
          <span className="text-[11px] tracking-wide text-white/35">swipe</span>
        </div>
      </header>

      {/* ——— Only this region swaps ——— */}
      <main className="mx-auto max-w-3xl px-6 pb-24">
        <ModeSwitcher professional={professional} artistic={artistic} />
      </main>
    </div>
  );
}
