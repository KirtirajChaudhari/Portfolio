"use client";

import { useEffect, useRef, useState } from "react";

interface UseCountUpOptions {
  end: number;
  duration?: number;
}

/**
 * Animated counter hook. The REAL value is the initial state, so SSR,
 * crawlers, screen readers, and no-JS users always see the true number —
 * the 0→end count-up is a client-only enhancement that starts on view.
 */
export function useCountUp({ end, duration = 2000 }: UseCountUpOptions) {
  const [count, setCount] = useState(end);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let frame: number;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) return;
        started.current = true;
        observer.disconnect();

        let startTime: number | null = null;
        const animate = (timestamp: number) => {
          if (startTime === null) startTime = timestamp;
          const progress = Math.min((timestamp - startTime) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
          setCount(Math.round(eased * end));
          if (progress < 1) frame = requestAnimationFrame(animate);
        };
        frame = requestAnimationFrame(animate);
      },
      { threshold: 0.3 }
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [end, duration]);

  return { count, ref };
}
