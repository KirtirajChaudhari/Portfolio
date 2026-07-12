import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalTimeline } from "@/content/professional";
import { Award } from "lucide-react";

export function Certifications() {
  const certifications = professionalTimeline.filter(
    (e) => e.type === "certification"
  );

  if (certifications.length === 0) return null;

  return (
    <section id="certifications" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading
          overline="Credentials"
          title="Certifications & Awards"
        />
      </AnimeReveal>

      <AnimeReveal staggerChildren staggerDelay={100} delay={200} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mt-16">
        {certifications.map((cert) => (
          <div key={cert.id} className="flex items-start gap-3 rounded-xl border border-border bg-surface p-4 transition-transform hover:scale-105 duration-300">
            <Award className="mt-0.5 h-4 w-4 shrink-0 text-purple-400" />
            <div className="min-w-0">
              <p className="text-sm font-medium text-text">{cert.title}</p>
              <p className="mt-0.5 text-xs text-text-muted">
                {cert.organization}
              </p>
            </div>
          </div>
        ))}
      </AnimeReveal>
    </section>
  );
}
