"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "motion/react";
import { Reveal } from "../Reveal";
import type { ProjectCase } from "@/content/projects";

interface Ripple {
  x: number;
  y: number;
  slug: string;
}

/* Shared ripple state hook: circular clip-path mask out from the click point, then route. */
function useRipple() {
  const router = useRouter();
  const [ripple, setRipple] = useState<Ripple | null>(null);

  const open = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (ripple) return;
    setRipple({ x: e.clientX, y: e.clientY, slug });
  };

  const overlay = (
    <AnimatePresence>
      {ripple && (
        <motion.div
          className="fixed inset-0 z-[var(--z-transition)] bg-bg"
          initial={{ clipPath: `circle(0px at ${ripple.x}px ${ripple.y}px)` }}
          animate={{ clipPath: `circle(150vmax at ${ripple.x}px ${ripple.y}px)` }}
          transition={{ duration: 0.55, ease: [0.23, 1, 0.32, 1] }}
          onAnimationComplete={() => router.push(`/projects/${ripple.slug}`)}
        />
      )}
    </AnimatePresence>
  );

  return { open, overlay };
}

/*
 * Compact card grid — survives only as "related projects" on case-study
 * pages (DESIGN.md). Screenshot, name, tech line; hover lifts the image.
 */
export function ProjectCardGrid({
  projects,
  small = false,
}: {
  projects: ProjectCase[];
  small?: boolean;
}) {
  const { open, overlay } = useRipple();

  return (
    <>
      <div
        className={`grid grid-cols-1 gap-x-8 gap-y-14 sm:grid-cols-2 ${
          small ? "lg:grid-cols-3 gap-y-10" : ""
        }`}
      >
        {projects.map((project) => (
          <a
            key={project.slug}
            href={`/projects/${project.slug}`}
            onClick={(e) => open(e, project.slug)}
            className="group block"
          >
            <div className="relative aspect-[16/10] overflow-hidden rounded-xl border border-border bg-surface">
              <div className="absolute inset-0 transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-[1.03]">
                {project.screenshot ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={project.screenshot}
                    alt={`${project.title} screenshot`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="dot-grid flex h-full w-full items-center justify-center bg-gradient-to-br from-surface-2 to-bg">
                    <span className="type-heading text-5xl uppercase text-text/15">
                      {project.title.slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-text px-6 py-3 text-xs font-semibold tracking-widest text-bg shadow-lg">
                  VIEW PROJECT
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-bg text-text">
                    ↗
                  </span>
                </span>
              </div>
            </div>
            <h4 className="type-heading mt-5 text-lg uppercase text-text transition-colors group-hover:text-accent">
              {project.title}
            </h4>
            <p className="mt-1 text-xs tracking-[0.15em] text-text-muted">{project.techLine}</p>
          </a>
        ))}
      </div>
      {overlay}
    </>
  );
}

/*
 * Homepage projects — xhulia.com mechanics (extraction spec): one
 * full-width block per project. Rhythm: [meta: name · tech] →
 * [outcome-driven headline sentence] → [dot-separated metric chips from
 * real outcome data] → [wide preview] with the "View case study" pill at
 * the meta row. Uniform card grid retired here.
 */
function ProjectBlock({
  project,
  open,
}: {
  project: ProjectCase;
  open: (e: React.MouseEvent, slug: string) => void;
}) {
  const metrics = (project.outcome ?? "").split("·").map((m) => m.trim()).filter(Boolean);

  return (
    <Reveal>
      <article className="border-t border-border pt-10 md:pt-12">
        <div className="flex flex-wrap items-start justify-between gap-x-10 gap-y-6">
          <div className="min-w-0 max-w-3xl">
            <p className="text-sm text-text-muted">
              <span className="font-medium text-text">{project.title}</span>
              <span className="mx-2">—</span>
              {project.techLine}
            </p>
            <h3 className="mt-3 text-[clamp(1.375rem,2.6vw,2rem)] font-medium leading-snug text-text">
              {project.oneLiner}
            </h3>
            {metrics.length > 0 && (
              <p className="mt-3 text-sm text-text-muted">
                {metrics.map((m, i) => (
                  <span key={m}>
                    {i > 0 && <span className="mx-2 text-text-muted/60">·</span>}
                    {m}
                  </span>
                ))}
              </p>
            )}
          </div>
          <a
            href={`/projects/${project.slug}`}
            onClick={(e) => open(e, project.slug)}
            className="shrink-0 rounded-full bg-text px-6 py-3.5 text-sm font-medium text-bg transition-transform duration-[var(--dur-fast)] hover:scale-[1.03] active:scale-[0.98]"
          >
            View case study →
          </a>
        </div>

        <a
          href={`/projects/${project.slug}`}
          onClick={(e) => open(e, project.slug)}
          className="group mt-8 block overflow-hidden rounded-xl border border-border bg-surface"
          aria-label={`${project.title} case study`}
        >
          <div className="transition-transform duration-500 ease-out group-hover:scale-[1.02]">
            {project.screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.screenshot}
                alt={`${project.title} preview`}
                className="aspect-[16/8] w-full object-cover object-top"
              />
            ) : (
              <div className="dot-grid flex aspect-[16/8] w-full items-center justify-center bg-gradient-to-br from-surface-2 to-bg">
                <span className="type-heading text-6xl uppercase text-text/15">
                  {project.title.slice(0, 2)}
                </span>
              </div>
            )}
          </div>
        </a>
      </article>
    </Reveal>
  );
}

export function ProjectsGrid({ projects }: { projects: ProjectCase[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);
  const { open, overlay } = useRipple();

  return (
    <section aria-label="Projects" className="mx-auto max-w-6xl px-6 pt-28 pb-12 md:pt-36 md:pb-16">
      <Reveal className="mb-14 md:mb-16">
        <h2 className="type-heading text-4xl uppercase text-text md:text-5xl">
          Academic &amp; Personal Projects
        </h2>
      </Reveal>

      <div className="flex flex-col gap-20 md:gap-24">
        {visibleProjects.map((project) => (
          <ProjectBlock key={project.slug} project={project} open={open} />
        ))}
      </div>

      {projects.length > 4 && (
        <Reveal className="mt-16 flex justify-center">
          <button
            type="button"
            onClick={() => setShowAll(!showAll)}
            className="rounded-full border border-border px-8 py-3.5 text-sm text-text transition-colors duration-[var(--dur-ui)] hover:border-accent hover:text-accent active:scale-[0.98]"
          >
            {showAll ? "Show fewer projects ↑" : `View all ${projects.length} projects ↓`}
          </button>
        </Reveal>
      )}

      {overlay}
    </section>
  );
}
