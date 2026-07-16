"use client";

import { useEffect, useRef } from "react";
import { workJourney, educationJourney, JourneyEntry } from "@/content/journey";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { Reveal } from "@/components/novel/Reveal";

/* ——— Monogram badge fallback for missing logos ——— */
function MonogramBadge({ name }: { name: string }) {
  const initials = name
    .split(/[\s,]+/)
    .filter((w) => w.length > 1 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/10 text-xs font-bold text-white shadow-inner">
      {initials || "?"}
    </div>
  );
}

function TimelineItem({ item }: { item: JourneyEntry }) {
  return (
    <div data-journey-item className="relative pl-12 pb-12 last:pb-0">
      {/* Logo / Node */}
      <div className="absolute -left-1 top-1 z-10 flex h-12 w-12 items-center justify-center overflow-hidden rounded-lg border border-white/20 bg-white/10 backdrop-blur-md shadow-sm">
        {item.logo ? (
          <Image
            src={item.logo}
            alt={item.organization}
            width={48}
            height={48}
            className="h-full w-full object-contain p-1"
          />
        ) : (
          <MonogramBadge name={item.organization} />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-text-muted/80">{item.dateRange}</span>
        <h4 className="text-lg font-bold text-text">{item.heading}</h4>
        <Link
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group flex w-fit items-center gap-1.5 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors mb-2"
        >
          <span className="underline decoration-blue-400/30 underline-offset-4 group-hover:decoration-blue-300">
            {item.organization}
          </span>
          <ExternalLink className="h-3.5 w-3.5 opacity-70" />
        </Link>
        <p className="mt-2 max-w-lg text-base leading-relaxed text-text-muted">
          {item.description}
        </p>

        {/* Skills/Tags if they exist */}
        {item.skills && item.skills.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-white/5 px-3 py-1 text-xs font-medium text-text-muted"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/*
 * One track = heading + vertical dot-line timeline. The accent spine draws
 * itself with scroll (same scrub grammar as the rest of Chapter One) and
 * each entry slides in staggered as it enters the viewport.
 */
function TimelineTrack({ label, entries }: { label: string; entries: JourneyEntry[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = trackRef.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = gsap.context(() => {
      // Spine draws from top to bottom as the track scrolls through.
      gsap.fromTo(
        "[data-journey-spine]",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          transformOrigin: "top center",
          scrollTrigger: {
            trigger: el,
            start: "top 75%",
            end: "bottom 65%",
            scrub: 0.5,
          },
        }
      );

      // Entries settle in one after another: card slides up, logo pops.
      gsap.utils.toArray<HTMLElement>("[data-journey-item]").forEach((item, i) => {
        gsap.from(item, {
          opacity: 0,
          y: 36,
          x: -12,
          duration: 0.8,
          delay: (i % 2) * 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: item, start: "top 85%", once: true },
        });
      });
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={trackRef}>
      <Reveal>
        <h3 className="mb-10 text-xl font-bold text-text">{label}</h3>
      </Reveal>
      <div className="relative">
        {/* Static rail + scroll-drawn accent spine */}
        <div className="absolute left-[19px] top-2 bottom-2 w-px bg-white/10" />
        <div
          data-journey-spine
          className="absolute left-[19px] top-2 bottom-2 w-px bg-accent"
        />
        <div className="flex flex-col">
          {entries.map((item) => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function JourneyTimeline() {
  return (
    <section id="timeline" className="mx-auto w-full max-w-6xl px-6 py-24">
      <Reveal className="mb-16">
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-500">
          EXPERIENCE & EDUCATION
        </h2>
        <h3 className="type-heading text-4xl font-bold text-text md:text-5xl">
          The journey so far
        </h3>
      </Reveal>

      {/* Vertically stacked tracks — Work first, Education below */}
      <div className="flex flex-col gap-24">
        <TimelineTrack label="Work Experience" entries={workJourney} />
        <TimelineTrack label="Education" entries={educationJourney} />
      </div>
    </section>
  );
}
