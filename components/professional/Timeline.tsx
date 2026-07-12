import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalTimeline } from "@/content/professional";
import { GraduationCap, Briefcase } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const TYPE_ICON: Record<string, LucideIcon> = {
  education: GraduationCap,
  internship: Briefcase,
};

const TYPE_COLOR: Record<string, string> = {
  education: "text-blue-400 bg-blue-400/10 border-blue-400/30",
  internship: "text-emerald-400 bg-emerald-400/10 border-emerald-400/30",
};

export function Timeline() {
  const internships = professionalTimeline.filter((e) => e.type === "internship");
  const education = professionalTimeline.filter((e) => e.type === "education");

  return (
    <section id="timeline" className="mx-auto max-w-6xl px-6 pt-12 pb-24">
      <AnimeReveal>
        <SectionHeading
          overline="Experience & Education"
          title="The journey so far"
        />
      </AnimeReveal>

      <div className="grid gap-16 lg:grid-cols-2">
        {/* Experience column */}
        <div>
          <AnimeReveal delay={100}>
            <h3 className="mb-8 font-display text-lg font-semibold text-text">
              Work Experience
            </h3>
          </AnimeReveal>
          
          <AnimeReveal staggerChildren staggerDelay={150} className="relative border-l-2 border-border pl-8">
            {internships.map((entry) => {
              const Icon = TYPE_ICON[entry.type] || Briefcase;
              const colorClass = TYPE_COLOR[entry.type] || "";
              return (
                <div key={entry.id} className="relative mb-10 last:mb-0">
                  {/* Timeline dot */}
                  <div
                    className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border ${colorClass}`}
                  >
                    <Icon className="h-3 w-3" />
                  </div>

                  {/* Date */}
                  <span className="mb-1 inline-block text-xs font-medium text-text-muted">
                    {entry.dateRange}
                  </span>

                  {/* Title */}
                  <h4 className="font-display text-base font-semibold text-text">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-accent">{entry.organization}</p>

                  {/* Description */}
                  {entry.description && (
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {entry.description}
                    </p>
                  )}
                </div>
              );
            })}
          </AnimeReveal>
        </div>

        {/* Education column */}
        <div>
          <AnimeReveal delay={200}>
            <h3 className="mb-8 font-display text-lg font-semibold text-text">
              Education
            </h3>
          </AnimeReveal>
          
          <AnimeReveal staggerChildren staggerDelay={150} delay={100} className="relative border-l-2 border-border pl-8">
            {education.map((entry) => {
              const Icon = TYPE_ICON[entry.type] || GraduationCap;
              const colorClass = TYPE_COLOR[entry.type] || "";
              return (
                <div key={entry.id} className="relative mb-10 last:mb-0">
                  <div
                    className={`absolute -left-[41px] flex h-6 w-6 items-center justify-center rounded-full border ${colorClass}`}
                  >
                    <Icon className="h-3 w-3" />
                  </div>

                  <span className="mb-1 inline-block text-xs font-medium text-text-muted">
                    {entry.dateRange}
                  </span>
                  <h4 className="font-display text-base font-semibold text-text">
                    {entry.title}
                  </h4>
                  <p className="text-sm text-accent">{entry.organization}</p>
                  {entry.description && (
                    <p className="mt-2 text-sm leading-relaxed text-text-muted">
                      {entry.description}
                    </p>
                  )}
                </div>
              );
            })}
          </AnimeReveal>
        </div>
      </div>
    </section>
  );
}
