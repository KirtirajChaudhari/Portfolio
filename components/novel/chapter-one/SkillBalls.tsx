"use client";

import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Reveal } from "../Reveal";

/*
 * Skills as 3D physics balls (spec v3 §2): React Three Fiber + Rapier.
 * Dynamically imported to avoid SSR issues with WebGL.
 * Falls back to the static 2D layout if WebGL fails.
 */

const Placeholder = () => (
  <section aria-label="Skills" className="mx-auto max-w-6xl px-6 py-28 md:py-36">
    <Reveal className="mb-12">
      <h3 className="type-heading text-4xl uppercase text-text md:text-5xl">Skills</h3>
      <p className="type-serif mt-3 text-lg italic text-text-muted">The toolkit.</p>
    </Reveal>
    <div className="relative h-[55vh] min-h-[380px] overflow-hidden rounded-xl border border-border bg-surface/40 md:h-[65vh] flex items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-accent border-t-transparent" />
    </div>
  </section>
);

const SkillBalls3D = dynamic(
  () => import("./SkillBalls3D").then((mod) => mod.SkillBalls3D),
  {
    ssr: false,
    loading: Placeholder,
  }
);

export function SkillBalls() {
  const [shouldMount, setShouldMount] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldMount(true);
          observer.disconnect();
        }
      },
      { rootMargin: "600px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {shouldMount ? <SkillBalls3D /> : <Placeholder />}
    </div>
  );
}
