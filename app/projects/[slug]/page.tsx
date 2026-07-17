import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { projectCases, getProjectCase } from "@/content/projects";
import { NovelShell } from "@/components/novel/NovelShell";
import { Reveal } from "@/components/novel/Reveal";
import { ProjectCardGrid } from "@/components/novel/chapter-one/ProjectsGrid";

export function generateStaticParams() {
  return projectCases.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectCase(slug);
  return {
    title: project ? `${project.title} — Kirtiraj Chaudhari` : "Project",
    description: project?.oneLiner,
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = getProjectCase(slug);
  if (!project) notFound();

  const others = projectCases.filter((p) => p.slug !== project.slug);

  return (
    <NovelShell>
      <main className="mx-auto max-w-4xl px-6 pb-24 pt-28 md:pt-36">
        <Reveal>
          <Link
            href="/#chapter-one"
            className="text-xs tracking-[0.3em] text-text-muted transition-colors hover:text-accent"
          >
            ← BACK TO THE STORY
          </Link>
          <h1 className="type-heading mt-6 text-[clamp(2.75rem,8vw,6rem)] uppercase leading-[0.92] text-text">
            {project.title}
          </h1>
          <p className="mt-4 text-lg text-text-muted">{project.oneLiner}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4">
            <span className="text-xs tracking-[0.15em] text-text-muted">{project.techLine}</span>
            {project.github && (
              <a
                href={project.github}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-4 py-1.5 text-xs tracking-widest text-text transition-colors hover:border-accent hover:text-accent"
              >
                GITHUB ↗
              </a>
            )}
            {project.live && (
              <a
                href={project.live}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-border px-4 py-1.5 text-xs tracking-widest text-text transition-colors hover:border-accent hover:text-accent"
              >
                LIVE ↗
              </a>
            )}
          </div>
        </Reveal>

        {/* Screenshot slot — placeholder until real captures are supplied */}
        <Reveal className="mt-14">
          <div className="dot-grid flex aspect-[16/9] items-center justify-center overflow-hidden rounded-xl border border-border bg-gradient-to-br from-surface-2 to-bg">
            {project.screenshot ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={project.screenshot}
                alt={`${project.title} screenshot`}
                className="h-full w-full object-cover"
              />
            ) : (
              <span className="font-mono text-[10px] tracking-[0.3em] text-text-muted">
                SCREENSHOT PENDING
              </span>
            )}
          </div>
        </Reveal>

        {/* Problem / Approach */}
        <div className="mt-20 flex flex-col gap-16">
          <Reveal>
            <h2 className="type-heading text-2xl uppercase text-text md:text-3xl">The Problem</h2>
            <p className="mt-4 leading-relaxed text-text-muted md:text-lg">{project.problem}</p>
          </Reveal>
          <Reveal>
            <h2 className="type-heading text-2xl uppercase text-text md:text-3xl">The Approach</h2>
            <p className="mt-4 leading-relaxed text-text-muted md:text-lg">{project.approach}</p>
          </Reveal>
        </div>

        {/* Stack breakdown */}
        <Reveal className="mt-20">
          <h2 className="type-heading text-2xl uppercase text-text md:text-3xl">Tech Stack</h2>
          <ul className="mt-6 divide-y divide-border border-y border-border">
            {project.stack.map((item) => (
              <li key={item.name} className="grid grid-cols-1 gap-1 py-4 md:grid-cols-[180px_1fr] md:gap-6">
                <span className="type-heading text-sm uppercase tracking-wider text-text">
                  {item.name}
                </span>
                <span className="text-sm leading-relaxed text-text-muted">{item.role}</span>
              </li>
            ))}
          </ul>
        </Reveal>

        {/* Key decisions */}
        <Reveal className="mt-20">
          <h2 className="type-heading text-2xl uppercase text-text md:text-3xl">Key Decisions</h2>
          <ul className="mt-6 flex flex-col gap-4">
            {project.decisions.map((d, i) => (
              <li key={i} className="flex gap-4 text-sm leading-relaxed text-text-muted md:text-base">
                <span className="type-heading shrink-0 text-accent">{String(i + 1).padStart(2, "0")}</span>
                {d}
              </li>
            ))}
          </ul>
          {project.outcome && (
            <p className="mt-10 border-l-2 border-accent pl-5 text-lg text-text">{project.outcome}</p>
          )}
        </Reveal>

        {/* Other projects — same cards, same ripple */}
        <div className="mt-28">
          <Reveal className="mb-10">
            <h3 className="type-heading text-3xl uppercase text-text md:text-4xl">Other Projects</h3>
          </Reveal>
          <ProjectCardGrid projects={others} small />
        </div>
      </main>
    </NovelShell>
  );
}
