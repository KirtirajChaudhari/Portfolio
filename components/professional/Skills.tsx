import { AnimeReveal } from "@/components/ui/AnimeReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { professionalSkills, professionalProjects } from "@/content/professional";

/** skill (lowercased) → titles of projects whose tech stack uses it */
function buildSkillUsage(): Map<string, string[]> {
  const usage = new Map<string, string[]>();
  for (const project of professionalProjects) {
    for (const raw of project.techStack) {
      // entries like "TensorFlow/PyTorch" list two technologies
      for (const tech of raw.split("/")) {
        const key = tech.trim().toLowerCase();
        if (!key) continue;
        const titles = usage.get(key) ?? [];
        if (!titles.includes(project.title)) titles.push(project.title);
        usage.set(key, titles);
      }
    }
  }
  return usage;
}

export function Skills() {
  const usage = buildSkillUsage();

  return (
    <section id="skills" className="mx-auto max-w-6xl px-6 py-24">
      <AnimeReveal>
        <SectionHeading
          overline="Skills"
          title="What I work with"
          description="Grouped by domain, no self-rated percentages. Highlighted tags carry the number of projects above that use them — hover for which."
        />
      </AnimeReveal>

      <AnimeReveal staggerChildren staggerDelay={100} delay={150} className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {professionalSkills.map((group) => (
            <div key={group.category} className="rounded-2xl border border-border bg-surface p-6">
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-accent">
                {group.category}
              </h3>
              <div className="flex flex-wrap gap-2">
                {group.items.map((skill) => {
                  const usedIn = usage.get(skill.toLowerCase());
                  if (!usedIn) {
                    return (
                      <span
                        key={skill}
                        className="rounded-full bg-surface-2 px-3 py-1.5 text-sm text-text-muted"
                      >
                        {skill}
                      </span>
                    );
                  }
                  return (
                    <span
                      key={skill}
                      title={`Used in: ${usedIn.join(", ")}`}
                      className="inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent-subtle px-3 py-1.5 text-sm text-text transition-colors duration-200 hover:border-accent/50 motion-reduce:transition-none"
                    >
                      {skill}
                      <span className="text-[11px] font-semibold text-accent">
                        ×{usedIn.length}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>
        ))}
      </AnimeReveal>
    </section>
  );
}
