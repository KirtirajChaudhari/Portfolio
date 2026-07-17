"use client";

import { KineticText, Reveal } from "../Reveal";
import { creatorIntro } from "@/content/novel";

/** Who I am outside the resume — spec v2 copy, verbatim. */
export function CreatorIntro() {
  return (
    <section aria-label="Creator introduction" className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <KineticText
        text={creatorIntro}
        className="type-serif text-2xl font-light italic leading-relaxed text-text md:text-[2.4rem] md:leading-relaxed"
      />
      <Reveal delay={0.2} className="mt-8 flex items-center gap-4">
        <span className="inline-block h-1 w-24 rounded-full bg-crayon-pink" />
        <span className="type-hand text-xl text-text-muted">— the off-hours chapter</span>
      </Reveal>
    </section>
  );
}
