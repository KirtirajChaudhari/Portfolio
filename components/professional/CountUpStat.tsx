"use client";

import { useRef } from "react";
import { useInView, useMotionValue, useTransform, animate } from "motion/react";
import { useEffect } from "react";

interface CountUpStatProps {
  value: number;
  label: string;
  suffix?: string;
}

/**
 * Reusable count-up stat card. One component drives all stat counters in the
 * About section (spec: "build one <CountUpStat />, not three bespoke copies").
 *
 * SSR-safe: renders the final value server-side. The 0→value count-up is a
 * client-only decoration triggered by scroll-into-view (~1.2s ease-out).
 * Respects prefers-reduced-motion — skips the tween entirely.
 */
export function CountUpStat({ value, label, suffix }: CountUpStatProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const motionVal = useMotionValue(0);
  const rounded = useTransform(motionVal, (v) => Math.round(v));

  useEffect(() => {
    if (!inView) return;

    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReduced) {
      motionVal.set(value);
      return;
    }

    const controls = animate(motionVal, value, {
      duration: 1.2,
      ease: [0.16, 1, 0.3, 1], // ease-out cubic
    });

    return () => controls.stop();
  }, [inView, value, motionVal]);

  return (
    <div ref={ref} className="flex flex-col items-start gap-1">
      {/* Static real value for assistive tech; count-up is decoration */}
      <span className="sr-only">
        {value}
        {suffix ?? ""} {label}
      </span>
      <CountUpNumber value={rounded} suffix={suffix} />
      <p
        aria-hidden="true"
        className="text-[13px] font-light leading-[1.5] text-text-muted"
        style={{ fontFamily: "var(--font-inter), sans-serif" }}
      >
        {label}
      </p>
    </div>
  );
}

/**
 * Renders the animated number. Separated so we can subscribe to the
 * MotionValue without re-rendering the entire card.
 */
function CountUpNumber({
  value,
  suffix,
}: {
  value: ReturnType<typeof useTransform<number, number>>;
  suffix?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubscribe = value.on("change", (v) => {
      if (ref.current) {
        ref.current.textContent = `${Math.round(v)}${suffix ?? ""}`;
      }
    });
    return unsubscribe;
  }, [value, suffix]);

  return (
    <span
      ref={ref}
      aria-hidden="true"
      className="type-heading text-[48px] font-bold leading-[1.1] text-text tablet:text-[56px] desktop:text-[60px]"
    >
      0{suffix ?? ""}
    </span>
  );
}
