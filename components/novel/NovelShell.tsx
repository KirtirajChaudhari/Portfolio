"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/**
 * One scroll system for the whole novel: Lenis drives the scroll,
 * GSAP ScrollTrigger reads it. Both chapters inherit this — the motion
 * language never changes, only the palette does.
 */
export function NovelShell({ children }: { children: React.ReactNode }) {
  const shellRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });
    setLenis(lenis);

    if (process.env.NODE_ENV === "development") {
      // Dev-only: lets automated checks drive the clock when rAF is throttled.
      (window as unknown as Record<string, unknown>).__novelDebug = { lenis, gsap };
    }

    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    let frame = requestAnimationFrame(function raf(time: number) {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    });

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div ref={shellRef} className="relative">
      {children}
    </div>
  );
}
