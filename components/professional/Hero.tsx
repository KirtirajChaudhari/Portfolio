import Image from "next/image";
import {
  professionalHeadline,
  professionalValueProposition,
} from "@/content/professional";
import { siteMeta } from "@/content/shared";
import { ArrowDown, FileDown } from "lucide-react";
import { AnimeReveal } from "@/components/ui/AnimeReveal";

export function Hero() {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Dot grid background */}
      <div className="absolute inset-0 dot-grid opacity-30" aria-hidden="true" />

      {/* Radial gradient overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,var(--bg)_70%)]"
        aria-hidden="true"
      />

      {/* Accent glow orb */}
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 h-[500px] w-[500px] rounded-full bg-accent-glow/10 blur-[120px]"
        aria-hidden="true"
      />

      <AnimeReveal staggerChildren staggerDelay={150} className="relative z-10 mx-auto max-w-4xl px-6 text-center">
        {/* Avatar */}
        <div className="mb-8 flex justify-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-full ring-2 ring-accent/30 ring-offset-4 ring-offset-bg">
            <Image
              src="/avatars/professional-full.png"
              alt={siteMeta.fullName}
              fill
              sizes="112px"
              priority
              className="object-cover"
            />
          </div>
        </div>

        {/* Overline */}
        <div className="mb-4 flex items-center justify-center gap-2">
          <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
          <span className="text-xs font-medium uppercase tracking-[0.25em] text-accent">
            {professionalHeadline}
          </span>
          <span className="h-px w-8 bg-accent/50" aria-hidden="true" />
        </div>

        {/* Name */}
        <h1 className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-text sm:text-6xl lg:text-7xl">
          {siteMeta.fullName}
        </h1>

        {/* Value prop */}
        <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-text-muted">
          {professionalValueProposition}
        </p>

        {/* CTAs */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <a
            href="#projects"
            className="group inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3 text-sm font-semibold text-bg shadow-[0_0_24px_rgba(88,166,255,0.3)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(88,166,255,0.5)] hover:scale-[1.02] motion-reduce:transition-none motion-reduce:hover:scale-100"
          >
            View Projects
            <ArrowDown className="h-4 w-4 transition-transform duration-300 group-hover:translate-y-0.5 motion-reduce:transition-none" />
          </a>
          <a
            href={siteMeta.resumeUrl}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-7 py-3 text-sm font-semibold text-text transition-all duration-300 hover:border-accent/40 hover:bg-surface-2 motion-reduce:transition-none"
          >
            <FileDown className="h-4 w-4" />
            Resume
          </a>
        </div>
      </AnimeReveal>

      {/* Scroll indicator */}
      <AnimeReveal delay={800} className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="flex h-8 w-5 items-start justify-center rounded-full border border-border p-1" aria-hidden="true">
          <div className="h-1.5 w-1 animate-bounce rounded-full bg-accent" />
        </div>
      </AnimeReveal>
    </section>
  );
}
