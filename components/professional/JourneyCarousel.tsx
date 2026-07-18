"use client";

import Image from "next/image";
import { workJourney, educationJourney, JourneyEntry } from "@/content/journey";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
// Removed invalid import

function MonogramBadge({ name }: { name: string }) {
  const initials = name
    .split(/[\s,]+/)
    .filter((w) => w.length > 1 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="flex h-full w-full items-center justify-center rounded bg-surface-2 text-[10px] font-bold text-text-muted">
      {initials || "?"}
    </div>
  );
}

function CredentialBadge({ item }: { item: JourneyEntry }) {
  return (
    <div className="glass-panel flex items-center gap-4 rounded-xl p-4">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded bg-white/5 p-1">
        {item.logo ? (
          <Image
            src={item.logo}
            alt={item.organization}
            width={32}
            height={32}
            className="h-full w-full object-contain"
          />
        ) : (
          <MonogramBadge name={item.organization} />
        )}
      </div>
      <div className="flex flex-col min-w-0">
        <h4 className="truncate text-[14px] font-bold text-text" title={item.heading}>
          {item.heading}
        </h4>
        <span className="truncate text-[12px] text-text-muted" title={item.organization}>
          {item.organization}
        </span>
      </div>
    </div>
  );
}

function RoleBlock({ item, index }: { item: JourneyEntry; index: number }) {
  const num = (index + 1).toString().padStart(2, "0");
  return (
    <div className="group flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:gap-8 hover:border-accent/40 transition-colors">
      <div className="flex shrink-0 items-start pt-1 sm:w-20">
        <span className="type-heading text-sm text-text-muted group-hover:text-accent transition-colors">
          {num}
        </span>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <h4 className="font-sans text-lg font-bold text-text">
            {item.heading}
          </h4>
          <span className="font-sans text-sm text-text-muted">
            {item.dateRange}
          </span>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="w-fit text-sm font-medium text-accent hover:text-accent-deep transition-colors"
        >
          {item.organization} ↗
        </a>
        <p className="font-sans text-base text-text-muted max-w-[64ch] leading-relaxed">
          {item.description}
        </p>
        {item.skills && item.skills.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {item.skills.map((skill) => (
              <span
                key={skill}
                className="rounded bg-surface-2 px-2 py-1 text-[11px] font-medium uppercase tracking-wider text-text-muted"
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

export function JourneyCarousel() {
  return (
    <section id="timeline" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading title="Experience & Education" />
      </AnimeReveal>

      {/* Part 1: Credential Badges (Education) */}
      <AnimeReveal delay={100}>
        <div className="mb-20">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {educationJourney.map((entry) => (
              <CredentialBadge key={entry.id} item={entry} />
            ))}
          </div>
        </div>
      </AnimeReveal>

      {/* Part 2: Numbered Role Blocks (Experience) */}
      <div className="flex flex-col">
        {workJourney.map((entry, idx) => (
          <AnimeReveal key={entry.id} delay={200 + idx * 50}>
            <RoleBlock item={entry} index={idx} />
          </AnimeReveal>
        ))}
        <AnimeReveal delay={200 + workJourney.length * 50}>
          <div className="border-t border-border" />
        </AnimeReveal>
      </div>
    </section>
  );
}
