import { workJourney, educationJourney, JourneyEntry } from "@/content/journey";
import { ExternalLink } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { AnimeReveal } from "@/components/ui/AnimeReveal";

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
    <div className="relative pl-12 pb-12 last:pb-0">
      {/* Timeline line */}
      <div className="absolute left-[19px] top-12 bottom-0 w-px bg-white/10" />

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

export function JourneyTimeline() {
  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-24">
      <AnimeReveal>
        <div className="mb-16">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-widest text-blue-500">
            EXPERIENCE & EDUCATION
          </h2>
          <h3 className="type-heading text-4xl font-bold text-text md:text-5xl">
            The journey so far
          </h3>
        </div>
      </AnimeReveal>

      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 md:gap-12 lg:gap-24">
        {/* Work Experience Column */}
        <AnimeReveal delay={100}>
          <div>
            <h3 className="mb-10 text-xl font-bold text-text">Work Experience</h3>
            <div className="flex flex-col">
              {workJourney.map((item) => (
                <TimelineItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </AnimeReveal>

        {/* Education Column */}
        <AnimeReveal delay={200}>
          <div>
            <h3 className="mb-10 text-xl font-bold text-text">Education</h3>
            <div className="flex flex-col">
              {educationJourney.map((item) => (
                <TimelineItem key={item.id} item={item} />
              ))}
            </div>
          </div>
        </AnimeReveal>
      </div>
    </section>
  );
}
