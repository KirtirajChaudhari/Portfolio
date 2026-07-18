"use client";

import Image from "next/image";
import { workJourney, educationJourney, JourneyEntry } from "@/content/journey";
import { Reveal } from "@/components/novel/Reveal";

/*
 * Experience & Education — full restructure (DESIGN.md):
 * numbered role blocks (karolinahess mechanics: NN over a hairline rule,
 * title / org / dates / one description / small chips) followed by
 * credential badges (yaros mechanics: glass card, logo + two-line label).
 * The scroll-drawn spine and dot rail are retired.
 */

function MonogramBadge({ name }: { name: string }) {
  const initials = name
    .split(/[\s,]+/)
    .filter((w) => w.length > 1 && w[0] === w[0].toUpperCase())
    .slice(0, 2)
    .map((w) => w[0])
    .join("");
  return (
    <div className="flex h-full w-full items-center justify-center rounded-lg bg-surface-2 text-xs font-semibold text-text">
      {initials || "?"}
    </div>
  );
}

function Logo({ item, size }: { item: JourneyEntry; size: number }) {
  return (
    <div
      className={`flex shrink-0 items-center justify-center overflow-hidden rounded-lg border border-border ${
        item.logo ? "bg-white/95" : "bg-surface-2"
      }`}
      style={{ width: size, height: size }}
    >
      {item.logo ? (
        <Image
          src={item.logo}
          alt={item.organization}
          width={size}
          height={size}
          className="h-full w-full object-contain p-1"
        />
      ) : (
        <MonogramBadge name={item.organization} />
      )}
    </div>
  );
}

function RoleBlock({ item, index }: { item: JourneyEntry; index: number }) {
  return (
    <Reveal>
      <div className="glass-panel group relative grid grid-cols-1 gap-4 overflow-hidden rounded-xl border border-border p-6 transition-all duration-500 hover:-translate-y-2 hover:border-accent/40 hover:shadow-[0_0_40px_rgba(var(--color-accent),0.15)] md:grid-cols-[80px_1fr] md:gap-10">
        
        {/* Changing Animation Motion Background */}
        <div className="pointer-events-none absolute -inset-[100%] z-0 opacity-0 transition-opacity duration-700 group-hover:opacity-100">
          <div className="absolute top-1/2 left-1/2 h-full w-full -translate-x-1/2 -translate-y-1/2 animate-[spin_6s_linear_infinite] rounded-full bg-gradient-to-r from-transparent via-accent/15 to-transparent blur-3xl"></div>
        </div>

        <span className="relative z-10 text-sm text-text-muted transition-colors duration-500 group-hover:text-accent">{String(index + 1).padStart(2, "0")}</span>
        <div className="relative z-10 border-t border-border pt-6 transition-colors duration-500 group-hover:border-accent/30">
          <div className="flex flex-wrap items-start justify-between gap-x-8 gap-y-2">
            <div className="flex items-center gap-4">
              <Logo item={item} size={44} />
              <div>
                <h3 className="text-xl font-medium text-text">{item.heading}</h3>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-accent underline decoration-accent/30 underline-offset-4 transition-colors hover:text-text hover:decoration-text/40"
                >
                  {item.organization} ↗
                </a>
              </div>
            </div>
            <span className="text-sm text-text-muted">{item.dateRange}</span>
          </div>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-text-muted">
            {item.description}
          </p>
          {item.skills.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {item.skills.map((skill) => (
                <span
                  key={skill}
                  className="rounded-full border border-border px-3 py-1 text-xs text-text-muted"
                >
                  {skill}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </Reveal>
  );
}



export function JourneyTimeline() {
  return (
    <section id="timeline" className="mx-auto w-full max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="mb-16 md:mb-20">
        <h2 className="type-heading text-4xl uppercase text-text md:text-5xl">
          Experience &amp; Education
        </h2>
      </Reveal>

      {/* Roles — numbered blocks over hairline rules */}
      <div className="flex flex-col gap-14 md:gap-16">
        {workJourney.map((item, i) => (
          <RoleBlock key={item.id} item={item} index={i} />
        ))}
      </div>

      {/* Education — styled same as Experience */}
      <Reveal className="mt-24 mb-14 md:mt-28 md:mb-16">
        <h3 className="text-lg font-medium text-text">Education</h3>
      </Reveal>
      <div className="flex flex-col gap-14 md:gap-16">
        {educationJourney.map((item, i) => (
          <RoleBlock key={item.id} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
