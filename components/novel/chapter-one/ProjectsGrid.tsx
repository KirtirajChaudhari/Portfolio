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

/*
 * Neozen-pattern card grid (reference PDF): screenshot on top, name below,
 * one-line tech stack under the name. Hover lifts the image and fades in a
 * centered "View Project" pill. Click ripples a circular clip-path mask out
 * from the click point (<600ms), then routes to the project page.
 */
export function ProjectCardGrid({
  projects,
  small = false,
}: {
  projects: ProjectCase[];
  small?: boolean;
}) {
  const router = useRouter();
  const [ripple, setRipple] = useState<Ripple | null>(null);

  const open = (e: React.MouseEvent, slug: string) => {
    e.preventDefault();
    if (ripple) return;
    setRipple({ x: e.clientX, y: e.clientY, slug });
  };

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
            <div
              className={`relative overflow-hidden rounded-xl border border-border bg-surface ${
                small ? "aspect-[16/10]" : "aspect-[16/10] md:aspect-[16/9]"
              }`}
            >
              {/* Screenshot slot — styled placeholder until real captures are supplied */}
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
                    <span className="type-heading text-5xl uppercase text-text/15 md:text-6xl">
                      {project.title.slice(0, 2)}
                    </span>
                  </div>
                )}
              </div>
              {/* View Project pill */}
              <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                <span className="flex items-center gap-2 rounded-full bg-[#F5F5F0] px-6 py-3 text-xs font-semibold tracking-widest text-[#0d1117] shadow-lg">
                  VIEW PROJECT
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#0d1117] text-[#F5F5F0]">
                    ↗
                  </span>
                </span>
              </div>
            </div>
            <h4
              className={`type-heading mt-5 uppercase text-text transition-colors group-hover:text-accent ${
                small ? "text-lg" : "text-2xl"
              }`}
            >
              {project.title}
            </h4>
            <p className="mt-1 text-xs tracking-[0.15em] text-text-muted">{project.techLine}</p>
          </a>
        ))}
      </div>

      {/* Ripple: circular clip-path mask expanding from the click point */}
      <AnimatePresence>
        {ripple && (
          <motion.div
            className="fixed inset-0 z-[90] bg-bg"
            initial={{ clipPath: `circle(0px at ${ripple.x}px ${ripple.y}px)` }}
            animate={{ clipPath: `circle(150vmax at ${ripple.x}px ${ripple.y}px)` }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            onAnimationComplete={() => router.push(`/projects/${ripple.slug}`)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

export function ProjectsGrid({ projects }: { projects: ProjectCase[] }) {
  const [showAll, setShowAll] = useState(false);
  const visibleProjects = showAll ? projects : projects.slice(0, 4);

  return (
    <section aria-label="Projects" className="mx-auto max-w-6xl px-6 pt-28 pb-12 md:pt-36 md:pb-16">
      <Reveal className="mb-14 md:mb-20">
        <span className="type-heading text-sm tracking-[0.4em] text-accent">
          OTHER PAGES FROM THIS CHAPTER
        </span>
        <h3 className="type-heading mt-3 text-4xl uppercase text-text md:text-5xl">
          Academic & Personal Projects
        </h3>
      </Reveal>
      <ProjectCardGrid projects={visibleProjects} />
      
      {projects.length > 4 && (
        <Reveal className="mt-12 flex justify-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="group relative overflow-hidden rounded-full border border-surface/50 bg-surface/20 px-8 py-3 backdrop-blur-md transition-colors hover:bg-surface/40 hover:border-accent/30"
          >
            <span className="type-body relative z-10 text-sm tracking-widest text-text uppercase">
              {showAll ? "View Less Projects" : "View All Projects"}
            </span>
            <div className="absolute inset-0 z-0 bg-gradient-to-r from-accent/0 via-accent/10 to-accent/0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </button>
        </Reveal>
      )}
    </section>
  );
}
