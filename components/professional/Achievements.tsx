"use client";

import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { professionalAchievements } from "@/content/professional";

function Counter({ end, label }: { end: number; label: string }) {
  const { count, ref } = useCountUp({ end, duration: 2000 });

  return (
    <div ref={ref} className="text-center">
      <div className="font-display text-5xl font-bold text-text sm:text-6xl">
        {count}
        <span className="text-accent">+</span>
      </div>
      <p className="mt-2 text-sm font-medium uppercase tracking-wider text-text-muted">
        {label}
      </p>
    </div>
  );
}

export function Achievements() {
  return (
    <section className="relative overflow-hidden pt-16 pb-8">
      {/* Gradient background */}
      <div
        className="absolute inset-0 bg-gradient-to-r from-accent-glow/5 via-accent/5 to-accent-glow/5"
        aria-hidden="true"
      />
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,transparent_0%,var(--bg)_70%)]"
        aria-hidden="true"
      />

      <div className="relative mx-auto max-w-4xl px-6">
        <AnimeReveal staggerChildren staggerDelay={100} className="flex flex-wrap items-center justify-center gap-16 sm:gap-24">
          {professionalAchievements.map((a) => (
            <Counter key={a.label} end={a.value} label={a.label} />
          ))}
        </AnimeReveal>
      </div>
    </section>
  );
}
