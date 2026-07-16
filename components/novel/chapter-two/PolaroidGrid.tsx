"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * Shared scrapbook entrance: cards stagger in with a tilt-settle
 * (drop + over-rotate + ease back to their resting tilt), not a flat fade.
 */
export function PolaroidGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLElement>("[data-polaroid]");
      cards.forEach((card, i) => {
        const tilt = parseFloat(card.style.getPropertyValue("--tilt")) || 0;
        gsap.fromTo(
          card,
          { opacity: 0, y: 70, rotate: tilt * 3 },
          {
            opacity: 1,
            y: 0,
            rotate: tilt,
            duration: 0.9,
            delay: (i % 4) * 0.1,
            ease: "back.out(1.4)",
            clearProps: "rotate", // let the CSS --tilt + hover transition own it after entry
            scrollTrigger: { trigger: card, start: "top 88%", once: true },
          }
        );
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
