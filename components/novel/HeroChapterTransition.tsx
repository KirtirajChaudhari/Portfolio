"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

/**
 * HeroChapterTransition — cinematic reveal strip between the hero
 * canvas and the Chapter One title.
 *
 * Layout:
 *   • A full-width dark overlay that sits between HeroCover and #chapter-one.
 *   • As the user scrolls past the hero, the overlay:
 *       1. Fades in a thin horizontal reveal line (like film leader tape)
 *       2. Expands outward to reveal the chapter content below
 *       3. Simultaneously fades a deep vignette, giving a "projector opening" feel.
 *
 * The chapter title / "THE ENGINEER" text then rises in naturally via its
 * existing Reveal animation.
 */
export function HeroChapterTransition() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const curtainTopRef = useRef<HTMLDivElement>(null);
  const curtainBotRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);
  const vigRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const top = curtainTopRef.current;
    const bot = curtainBotRef.current;
    const line = lineRef.current;
    const vig = vigRef.current;
    if (!wrap || !top || !bot || !line || !vig) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Set initial state — curtains fully closed, line invisible.
    gsap.set([top, bot], { scaleY: 1, transformOrigin: "center center" });
    gsap.set(line, { scaleX: 0, opacity: 0 });
    gsap.set(vig, { opacity: 1 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: wrap,
        start: "top 90%",
        end: "bottom 20%",
        scrub: 1.2,
      },
    });

    tl
      // 1. Flash the reveal line across the seam.
      .to(line, { scaleX: 1, opacity: 1, duration: 0.15, ease: "power2.out" }, 0)
      // 2. Split the curtains open like a projector iris.
      .to(top, { scaleY: 0, transformOrigin: "top center", duration: 0.6, ease: "power2.inOut" }, 0.1)
      .to(bot, { scaleY: 0, transformOrigin: "bottom center", duration: 0.6, ease: "power2.inOut" }, 0.1)
      // 3. Fade the line and vignette as content reveals.
      .to(line, { opacity: 0, duration: 0.15 }, 0.6)
      .to(vig, { opacity: 0, duration: 0.5 }, 0.4);

    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="pointer-events-none relative z-20 -my-2 h-24 overflow-hidden"
      aria-hidden="true"
    >
      {/* Top curtain panel */}
      <div
        ref={curtainTopRef}
        className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-bg to-bg/60"
      />

      {/* Reveal line — thin bright seam across the middle */}
      <div
        ref={lineRef}
        className="absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-gradient-to-r from-transparent via-white/40 to-transparent origin-left"
      />

      {/* Bottom curtain panel */}
      <div
        ref={curtainBotRef}
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-bg/60"
      />

      {/* Soft vignette softens the cut */}
      <div
        ref={vigRef}
        className="absolute inset-0 bg-gradient-to-b from-bg/80 via-transparent to-bg/80"
      />
    </div>
  );
}
