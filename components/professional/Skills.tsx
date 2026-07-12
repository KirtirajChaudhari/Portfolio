import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalSkills } from "@/content/professional";

export function Skills() {
  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading
          overline="Skills"
          title="What I work with"
          description="Grouped by domain — no self-rated percentages, just what I actually use."
        />
      </AnimeReveal>

      <AnimeReveal staggerChildren staggerDelay={100} delay={150} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {professionalSkills.map((group) => (
            <div key={group.category} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => (
                  <span
                    key={skill}
                    className="rounded-full bg-surface-2 px-3 py-1.5 text-sm text-text-muted transition-colors duration-200 hover:bg-accent-subtle hover:text-accent motion-reduce:transition-none"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
        ))}
      </AnimeReveal>
    </section>
  );
}
