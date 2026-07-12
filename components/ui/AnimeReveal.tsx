"use client";

import React, { useEffect, useRef, useState } from "react";
import anime from "animejs";
import { useReducedMotion } from "motion/react";

interface AnimeRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  staggerChildren?: boolean;
  staggerDelay?: number;
}

const OFFSET_MAP = {
  up: { translateY: 50 },
  down: { translateY: -50 },
  left: { translateX: 50 },
  right: { translateX: -50 },
};

export function AnimeReveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  staggerChildren = false,
  staggerDelay = 100,
}: AnimeRevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion || hasAnimated || !containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          const targets = staggerChildren
            ? Array.from(containerRef.current!.children)
            : containerRef.current;

          // Initial state
          anime.set(targets, {
            opacity: 0,
            ...OFFSET_MAP[direction],
          });

          // Animation
          anime({
            targets,
            opacity: 1,
            translateY: 0,
            translateX: 0,
            duration: 1200,
            delay: staggerChildren
              ? anime.stagger(staggerDelay, { start: delay })
              : delay,
            // Exaggerated spring-like easing for that premium feel
            easing: "easeOutElastic(1, .8)",
          });

          setHasAnimated(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1, // Trigger when 10% visible
        rootMargin: "0px 0px -10% 0px", // Trigger slightly before it comes into view fully
      }
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, [hasAnimated, prefersReducedMotion, direction, delay, staggerChildren, staggerDelay]);

  if (prefersReducedMotion) {
    return <div className={className}>{children}</div>;
  }

  // Pre-hide to prevent flash of unstyled content before JS executes
  return (
    <div
      ref={containerRef}
      className={className}
      style={{ opacity: hasAnimated ? 1 : 0 }}
    >
      {children}
    </div>
  );
}
