"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger } from "@/lib/gsap";
import { setLenis } from "@/lib/scroll";

/* Late layout shifts (image decode, 3D canvas mount, grid expansion) can
 * strand once-only reveal triggers past the reachable scroll range —
 * re-measure once everything has actually loaded. */
const refreshOnLoad = () => ScrollTrigger.refresh();

import { LiquidGlassDefs } from "./LiquidGlassDefs";

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

    let lenis: Lenis;
    let frame: number;

    const initLenis = () => {
      lenis = new Lenis({
        duration: 1.2,
        easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        touchMultiplier: 1.5,
      });
      setLenis(lenis);

      if (process.env.NODE_ENV === "development") {
        (window as unknown as Record<string, unknown>).__novelDebug = { lenis, gsap };
      }

      lenis.on("scroll", ScrollTrigger.update);
      gsap.ticker.lagSmoothing(0);

      frame = requestAnimationFrame(function raf(time: number) {
        lenis.raf(time);
        frame = requestAnimationFrame(raf);
      });
    };

    // Defer initialization to let Next.js complete its route-change scroll
    // to top or history scroll restoration before Lenis locks it in.
    const timeoutId = setTimeout(initLenis, 50);

    if (document.readyState === "complete") refreshOnLoad();
    else window.addEventListener("load", refreshOnLoad);

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("load", refreshOnLoad);
      if (frame) cancelAnimationFrame(frame);
      if (lenis) lenis.destroy();
      setLenis(null);
    };
  }, []);

  return (
    <div ref={shellRef} className="relative">
      <LiquidGlassDefs />
      {children}
    </div>
  );
}
