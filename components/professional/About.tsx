import Image from "next/image";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalAbout } from "@/content/professional";
import { siteMeta } from "@/content/shared";

export function About() {
  return (
    <section id="about" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading overline="About" title="A bit more about me" />
      </AnimeReveal>

      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.5fr]">
        {/* Avatar */}
        <AnimeReveal direction="left">
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl border border-border">
            <Image
              src="/avatars/professional-full.png"
              alt={siteMeta.fullName}
              fill
              sizes="(max-width: 768px) 80vw, 400px"
              className="object-cover"
            />
            {/* Gradient overlay at bottom */}
            <div
              className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg to-transparent"
              aria-hidden="true"
            />
          </div>
        </AnimeReveal>

        {/* Bio */}
        <AnimeReveal direction="right" delay={150}>
          <p className="text-base leading-relaxed text-text-muted sm:text-lg">
            {professionalAbout}
          </p>

          {/* Quick facts */}
          <AnimeReveal staggerChildren staggerDelay={100} className="mt-8 grid grid-cols-2 gap-4">
            <div className="rounded-xl border border-border bg-surface p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Location
              </span>
              <p className="mt-1 text-sm font-medium text-text">
                {siteMeta.location}
              </p>
            </div>
            <div className="rounded-xl border border-border bg-surface p-4">
              <span className="text-xs font-medium uppercase tracking-wider text-accent">
                Email
              </span>
              <p className="mt-1 text-sm font-medium text-text">
                <a
                  href={`mailto:${siteMeta.email}`}
                  className="transition-colors hover:text-accent"
                >
                  {siteMeta.email}
                </a>
              </p>
            </div>
          </AnimeReveal>
        </AnimeReveal>
      </div>
    </section>
  );
}
