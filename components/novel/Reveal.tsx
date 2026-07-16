"use client";

import { useEffect, useRef } from "react";
import { gsap, ScrollTrigger } from "@/lib/gsap";

interface RevealProps {
  children: React.ReactNode;
  /** Extra classes on the wrapper div. */
  className?: string;
  /** Stagger direct children instead of moving the wrapper as one block. */
  stagger?: boolean;
  delay?: number;
  y?: number;
}

/**
 * The one scroll-reveal used by BOTH chapters — identical duration, ease and
 * travel everywhere is what makes the two halves feel like one book.
 */
export function Reveal({ children, className, stagger = false, delay = 0, y = 24 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // gsap.context + revert restores inline styles on cleanup — a bare
    // tween.kill() would leave the from-state (opacity 0) behind and the
    // StrictMode re-run would then capture 0 as the end value.
    const ctx = gsap.context(() => {
      const targets = stagger ? Array.from(el.children) : el;
      gsap.from(targets, {
        opacity: 0,
        y,
        duration: 0.8,
        delay,
        ease: "power3.out",
        stagger: stagger ? 0.12 : 0,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [stagger, delay, y]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}

/**
 * Word-by-word kinetic reveal, scrub-free (plays once on enter).
 */
export function KineticText({
  text,
  className,
  as: Tag = "p",
}: {
  text: string;
  className?: string;
  as?: "h1" | "h2" | "h3" | "p" | "span";
}) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      gsap.from(el.querySelectorAll("[data-word]"), {
        opacity: 0,
        yPercent: 60,
        duration: 0.7,
        ease: "power3.out",
        stagger: 0.04,
        scrollTrigger: {
          trigger: el,
          start: "top 85%",
          once: true,
        },
      });
    }, el);

    return () => ctx.revert();
  }, [text]);

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <Tag ref={ref as any} className={className} aria-label={text}>
      {text.split(" ").map((word, i) => (
        <span key={i} aria-hidden className="inline-block overflow-hidden align-bottom">
          <span data-word className="inline-block">
            {word}
            {" "}
          </span>
        </span>
      ))}
    </Tag>
  );
}

/** Kill-safe helper: refresh ScrollTrigger after images/fonts settle. */
export function refreshScrollTriggers() {
  ScrollTrigger.refresh();
}
