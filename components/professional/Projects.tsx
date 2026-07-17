import { ArrowUpRight } from "lucide-react";
import { GithubIcon } from "@/components/ui/Icons";
import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalProjects } from "@/content/professional";
import { Project } from "@/content/types";

function ProjectBlock({ project, index }: { project: Project; index: number }) {
  const isEven = index % 2 === 0;

  return (
    <div className="group flex flex-col gap-6 py-16 border-t border-border hover:border-accent/40 transition-colors">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="flex w-full flex-col gap-4 lg:w-5/12">
          {/* Meta line */}
          <div className="flex items-center justify-between">
            <h3 className="font-display text-3xl font-bold text-text sm:text-4xl">
              {project.title}
            </h3>
            {project.badge && (
              <span className="rounded-full border border-accent/20 bg-accent/5 px-3 py-1 text-xs font-medium uppercase tracking-wider text-accent">
                {project.badge}
              </span>
            )}
          </div>

          {/* Outcome-driven subtitle line */}
          <p className="text-lg font-medium text-text-muted">
            {project.oneLiner}
          </p>

          <p className="font-sans text-base leading-relaxed text-text-muted/80">
            {project.description}
          </p>

          {/* Quantified metric chips */}
          {project.metrics && project.metrics.length > 0 && (
            <div className="mt-2 flex flex-wrap items-center gap-2">
              {project.metrics.map((metric, idx) => (
                <span key={metric} className="flex items-center text-sm font-semibold text-text">
                  {idx > 0 && <span className="mx-2 text-border">•</span>}
                  {metric}
                </span>
              ))}
            </div>
          )}

          {/* Action Links */}
          <div className="mt-6 flex items-center gap-4">
            {project.links?.live && (
              <a
                href={project.links.live}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full bg-surface-2 px-6 py-2.5 text-sm font-semibold text-text transition-colors hover:bg-accent hover:text-bg"
              >
                View case study <ArrowUpRight className="h-4 w-4" />
              </a>
            )}
            {project.links?.github && (
              <a
                href={project.links.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-full border border-border px-6 py-2.5 text-sm font-medium text-text transition-colors hover:border-text-muted"
              >
                <GithubIcon className="h-4 w-4" /> Source
              </a>
            )}
          </div>
        </div>

        {/* Mosaic / Preview Strip */}
        <div className="mt-8 flex w-full flex-col lg:mt-0 lg:w-6/12">
          <div className="group/mosaic relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-surface-2 ring-1 ring-border transition-all group-hover:ring-accent/30">
            {/* Real placeholder for the mosaic strip until images are provided */}
            <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-surface to-bg">
              <span className="type-heading text-xl text-text-muted/50">Mosaic Strip / UI Preview</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Projects() {
  const featured = professionalProjects.filter((p) => p.featured);
  const other = professionalProjects.filter((p) => !p.featured);

  return (
    <section id="projects-all" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading title="Projects" />
      </AnimeReveal>

      <div className="flex flex-col mt-12">
        {featured.map((project, index) => (
          <AnimeReveal key={project.id} delay={100 + index * 50}>
            <ProjectBlock project={project} index={index} />
          </AnimeReveal>
        ))}
      </div>

      {other.length > 0 && (
        <div className="mt-16 border-t border-border pt-16">
          <AnimeReveal>
            <h3 className="mb-8 font-display text-2xl font-bold text-text">More Projects</h3>
          </AnimeReveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {other.map((project, index) => (
              <AnimeReveal key={project.id} delay={100 + index * 50}>
                <div className="flex h-full flex-col gap-4 rounded-xl border border-border bg-surface/30 p-6 transition-colors hover:border-accent/30">
                  <div className="flex items-start justify-between">
                    <h4 className="font-sans text-lg font-bold text-text">{project.title}</h4>
                    {project.links?.github && (
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer" className="text-text-muted hover:text-accent">
                        <GithubIcon className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <p className="text-sm leading-relaxed text-text-muted flex-1">{project.description}</p>
                  <div className="flex flex-wrap gap-2 pt-4">
                    {project.techStack.slice(0, 3).map((tech) => (
                      <span key={tech} className="text-[11px] font-medium uppercase tracking-wider text-text-muted">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </AnimeReveal>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
