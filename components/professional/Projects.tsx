import {
  Brain,
  Eye,
  Train,
  Wrench,
  Car,
  Landmark,
  BarChart3,
  Code2,
  ExternalLink,
} from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { GlassCard } from "@/components/ui/GlassCard";
import type { LucideIcon } from "lucide-react";
import { professionalProjects } from "@/content/professional";

const ICON_MAP: Record<string, LucideIcon> = {
  rasacare: Brain,
  drishtimanas: Eye,
  pravaas: Train,
  "lab-complaint": Wrench,
  "autonomous-driving": Car,
  "preserving-heritage": Landmark,
  "sales-forecasting": BarChart3,
};

export function Projects() {
  const featured = professionalProjects.filter((p) => p.featured);
  const other = professionalProjects.filter((p) => !p.featured);

  return (
    <section id="projects-all" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading
          overline="Projects"
          title="Built to ship, not just to learn"
          description="Case studies from applied ML, full-stack platforms, and real-time systems."
        />
      </AnimeReveal>

      {/* Featured projects — large cards */}
      <AnimeReveal staggerChildren staggerDelay={100} delay={100} className="grid gap-6 lg:grid-cols-2">
        {featured.map((project) => {
          const Icon = ICON_MAP[project.id] || Code2;
          return (
              <GlassCard key={project.id} className="group flex flex-col overflow-hidden !p-0">
                {/* Visual header */}
                <div className="flex h-48 items-center justify-center bg-gradient-to-br from-surface-2 to-surface transition-colors duration-500 group-hover:from-accent/5 group-hover:to-surface">
                  <Icon
                    className="h-12 w-12 text-accent/30 transition-all duration-500 group-hover:scale-110 group-hover:text-accent/70"
                    strokeWidth={1.5}
                  />
                </div>

                <div className="flex flex-1 flex-col p-6">
                  {/* Title + badges */}
                  <div className="flex flex-wrap items-start gap-2">
                    <h3 className="font-display text-lg font-semibold text-text">
                      {project.title}
                      <span className="mt-1 block text-sm font-normal text-text-muted">
                        {project.oneLiner}
                      </span>
                    </h3>
                  </div>

                  {/* Status badges */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    {project.badge && (
                      <span className="rounded-full bg-accent-subtle px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-accent">
                        {project.badge}
                      </span>
                    )}
                    {project.links?.live && (
                      <a
                        href={project.links.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-emerald-400 transition-colors hover:bg-emerald-500/20"
                      >
                        Live <ExternalLink className="h-2.5 w-2.5" />
                      </a>
                    )}
                    {project.outcome === "In Development" && (
                      <span className="rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-amber-400">
                        In Development
                      </span>
                    )}
                  </div>

                  {/* Tech stack */}
                  <div className="mt-4 flex flex-wrap gap-1.5">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-surface-2 px-2.5 py-1 text-[11px] text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {/* Description */}
                  <p className="mt-4 flex-1 text-sm leading-relaxed text-text-muted">
                    {project.description}
                  </p>

                  {/* Outcome */}
                  {project.outcome && project.outcome !== "In Development" && (
                    <div className="mt-4 rounded-lg bg-accent-subtle px-4 py-2.5">
                      <span className="text-xs font-medium uppercase tracking-wider text-accent">
                        Outcome
                      </span>
                      <p className="mt-0.5 text-sm font-semibold text-text">
                        {project.outcome}
                      </p>
                    </div>
                  )}

                  {/* Links */}
                  <div className="mt-4 flex gap-3">
                    {project.links?.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent"
                      >
                        <GithubIcon className="h-3.5 w-3.5" />
                        Source
                      </a>
                    )}
                    {project.links?.demo && (
                      <a
                        href={project.links.demo}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        Demo
                      </a>
                    )}
                  </div>
                </div>
              </GlassCard>
          );
        })}
      </AnimeReveal>

      {/* Other projects — compact list */}
      {other.length > 0 && (
        <AnimeReveal staggerChildren staggerDelay={80} delay={150} className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {other.map((project) => {
            const Icon = ICON_MAP[project.id] || Code2;
            return (
                <GlassCard key={project.id} className="flex flex-col !p-5">
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-surface-2">
                      <Icon className="h-5 w-5 text-accent/50" strokeWidth={1.5} />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-display text-sm font-semibold text-text">
                        {project.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-text-muted">
                        {project.oneLiner}
                      </p>
                      {project.badge && (
                        <span className="mt-2 inline-block rounded-full bg-accent-subtle px-2 py-0.5 text-[9px] font-medium uppercase tracking-wider text-accent">
                          {project.badge}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="mt-3 flex-1 text-xs leading-relaxed text-text-muted">
                    {project.description}
                  </p>

                  {project.outcome && (
                    <p className="mt-3 text-xs font-semibold text-accent">
                      {project.outcome}
                    </p>
                  )}

                  <div className="mt-3 flex flex-wrap gap-1">
                    {project.techStack.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] text-text-muted"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>

                  {project.links?.github && (
                    <a
                      href={project.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-3 inline-flex items-center gap-1.5 text-xs text-text-muted transition-colors hover:text-accent"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      Source
                    </a>
                  )}
                </GlassCard>
            );
          })}
        </AnimeReveal>
      )}
    </section>
  );
}
