import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalTimeline } from "@/content/professional";
import type { TimelineEntry } from "@/content/types";
import { Award, ExternalLink, GraduationCap } from "lucide-react";

function VerifyLink({ cert }: { cert: TimelineEntry }) {
  if (!cert.link) return null;
  return (
    <a
      href={cert.link}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-2 inline-flex items-center gap-1 text-xs text-text-muted transition-colors hover:text-accent"
    >
      Verify <ExternalLink className="h-3 w-3" />
    </a>
  );
}

export function Certifications() {
  const certifications = professionalTimeline.filter(
    (e) => e.type === "certification"
  );

  if (certifications.length === 0) return null;

  const programs = certifications.filter((c) => c.tier === "program");
  const platform = certifications.filter((c) => c.tier === "platform");
  const simulations = certifications.filter((c) => c.tier === "simulation");

  return (
    <section id="certifications" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading
          overline="Credentials"
          title="Certifications & Programs"
        />
      </AnimeReveal>

      {/* Programs — the heavyweight credentials */}
      {programs.length > 0 && (
        <AnimeReveal staggerChildren staggerDelay={100} delay={150} className="mt-16 grid gap-4 sm:grid-cols-3">
          {programs.map((cert) => (
            <div
              key={cert.id}
              className="rounded-2xl border border-accent/20 bg-surface p-6"
            >
              <GraduationCap className="h-5 w-5 text-accent" />
              <p className="mt-3 font-display text-base font-semibold text-text">
                {cert.title}
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {cert.organization}
                {cert.dateRange !== "Completed" && ` · ${cert.dateRange}`}
              </p>
              <VerifyLink cert={cert} />
            </div>
          ))}
        </AnimeReveal>
      )}

      {/* Platform & cloud certifications */}
      {platform.length > 0 && (
        <AnimeReveal staggerChildren staggerDelay={80} delay={200} className="mt-4 grid gap-4 sm:grid-cols-3">
          {platform.map((cert) => (
            <div
              key={cert.id}
              className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4"
            >
              <Award className="mt-0.5 h-4 w-4 shrink-0 text-accent/70" />
              <div className="min-w-0">
                <p className="text-sm font-medium text-text">{cert.title}</p>
                <p className="mt-0.5 text-xs text-text-muted">
                  {cert.organization}
                  {cert.dateRange !== "Completed" && ` · ${cert.dateRange}`}
                </p>
                <VerifyLink cert={cert} />
              </div>
            </div>
          ))}
        </AnimeReveal>
      )}

      {/* Job simulations — supporting signal, kept deliberately quiet */}
      {simulations.length > 0 && (
        <AnimeReveal delay={250} className="mt-6">
          <p className="text-xs font-medium uppercase tracking-wider text-text-muted">
            Job Simulations
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {simulations.map((cert) => (
              <span
                key={cert.id}
                className="rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-text-muted"
              >
                {cert.title} · {cert.organization}
              </span>
            ))}
          </div>
        </AnimeReveal>
      )}
    </section>
  );
}
