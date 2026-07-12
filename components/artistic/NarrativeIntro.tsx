import { SectionReveal } from "@/components/ui/SectionReveal";
import { artisticStory } from "@/content/artistic";

export function NarrativeIntro() {
  return (
    <section className="mx-auto max-w-3xl px-6 py-24">
      <SectionReveal>
        <blockquote className="text-center">
          <p className="font-display text-2xl font-medium leading-relaxed text-text sm:text-3xl lg:text-4xl">
            &ldquo;{artisticStory}&rdquo;
          </p>
        </blockquote>
      </SectionReveal>
    </section>
  );
}
