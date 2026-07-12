import { SectionReveal } from "@/components/ui/SectionReveal";
import { GlassCard } from "@/components/ui/GlassCard";
import { artisticFeaturedWork } from "@/content/artistic";
import { Sparkles } from "lucide-react";

export function FeaturedWork() {
  return (
    <section className="mx-auto max-w-4xl px-6 py-24">
      <SectionReveal>
        <GlassCard hover={false} className="!p-8 sm:!p-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-accent" />
            <span className="text-xs font-medium uppercase tracking-[0.2em] text-accent">
              Featured Piece
            </span>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1fr_1fr]">
            {/* Media placeholder */}
            <div className="flex aspect-video items-center justify-center rounded-xl bg-surface-2">
              <span className="text-sm text-text-muted">
                Media — replace with real content
              </span>
            </div>

            {/* Story */}
            <div className="flex flex-col justify-center">
              <h3 className="font-display text-2xl font-bold text-text sm:text-3xl">
                {artisticFeaturedWork.title}
              </h3>
              <p className="mt-4 text-base leading-relaxed text-text-muted">
                {artisticFeaturedWork.story}
              </p>
            </div>
          </div>
        </GlassCard>
      </SectionReveal>
    </section>
  );
}
