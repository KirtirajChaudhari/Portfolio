"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/*
 * Pinboard — the shared vocabulary for Chapter Two.
 * Hero establishes it; Photography, Poetry and Music reuse it unchanged.
 *
 * Two rules hold the illusion together:
 *   1. The light source is top-left. Shadows come from the --pin-shadow-*
 *      tokens in globals.css and nowhere else.
 *   2. Entrance motion animates the WRAPPER; the resting tilt and the hover
 *      lift live on the inner .pinned element. Keeping them on separate
 *      nodes means GSAP's inline transform never fights the CSS hover rule.
 */

export type CrayonHue = "pink" | "violet" | "blue" | "peach" | "sun" | "leaf";

const HUE_VAR: Record<CrayonHue, string> = {
  pink: "var(--crayon-pink)",
  violet: "var(--crayon-violet)",
  blue: "var(--crayon-blue)",
  peach: "var(--crayon-peach)",
  sun: "var(--crayon-sun)",
  leaf: "var(--crayon-leaf)",
};

export function crayon(hue: CrayonHue) {
  return HUE_VAR[hue];
}

/* ——— Fasteners ——————————————————————————————————————————————— */

export function Tape({
  hue = "sun",
  className = "",
  rotate = -8,
}: {
  hue?: CrayonHue;
  /** Positioning classes — the caller decides which edge it holds down. */
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`tape ${className}`}
      /* The independent `rotate` property, not transform — so positioning
         utilities like -translate-x-1/2 still compose on the same element. */
      style={
        {
          "--tape-hue": HUE_VAR[hue],
          rotate: `${rotate}deg`,
        } as React.CSSProperties
      }
    />
  );
}

export function Pin({
  hue = "pink",
  className = "",
}: {
  hue?: CrayonHue;
  className?: string;
}) {
  return (
    <span
      aria-hidden
      className={`pin ${className}`}
      style={{ "--pin-hue": HUE_VAR[hue] } as React.CSSProperties}
    />
  );
}

export function Staple({
  className = "",
  rotate = -4,
}: {
  className?: string;
  rotate?: number;
}) {
  return (
    <span
      aria-hidden
      className={`staple ${className}`}
      style={{ rotate: `${rotate}deg` }}
    />
  );
}

/* ——— The pinned object ——————————————————————————————————————— */

export function Pinned({
  tilt = 0,
  className = "",
  children,
  style,
}: {
  /** Resting rotation in degrees. Keep within ±5 to stay in grammar. */
  tilt?: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <div data-pinned className="relative">
      <div
        className={`pinned ${className}`}
        style={{ "--tilt": `${tilt}deg`, ...style } as React.CSSProperties}
      >
        {children}
      </div>
    </div>
  );
}

/** White post card — the default object on the board. */
export function PostCard({
  tilt = 0,
  className = "",
  children,
  style,
}: {
  tilt?: number;
  className?: string;
  children: React.ReactNode;
  style?: React.CSSProperties;
}) {
  return (
    <Pinned
      tilt={tilt}
      className={`rounded-[3px] border border-border bg-surface p-2 ${className}`}
      style={style}
    >
      {children}
    </Pinned>
  );
}

/* ——— Entrance ————————————————————————————————————————————————— */

/**
 * Objects settle onto the board instead of fading in: they drop, overshoot
 * their angle slightly, then rest. `back.out` is the spring read — GSAP is
 * already the page's scroll system (Lenis drives ScrollTrigger), so this
 * stays on one timeline rather than introducing a second motion runtime.
 */
export function PinnedGroup({
  children,
  className,
  stagger = 0.07,
}: {
  children: React.ReactNode;
  className?: string;
  stagger?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // gsap.context().revert() restores inline styles on cleanup — without it
    // a StrictMode re-run captures the from-state and locks cards invisible.
    const ctx = gsap.context(() => {
      // Queried off the ref rather than by selector string so nested groups
      // can never claim each other's cards.
      const cards = Array.from(el.querySelectorAll<HTMLElement>("[data-pinned]"));
      cards.forEach((card, i) => {
        gsap.from(card, {
          opacity: 0,
          y: 34,
          rotate: i % 2 === 0 ? -5 : 5,
          duration: 0.85,
          delay: (i % 4) * stagger,
          ease: "back.out(1.4)",
          scrollTrigger: { trigger: card, start: "top 90%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, [stagger]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
