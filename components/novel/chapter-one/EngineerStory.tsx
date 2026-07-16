"use client";

import { engineerBeats } from "@/content/novel";

/**
 * About Me static section.
 * The Education and Experience panels have been moved to their own dedicated timeline section.
 */
export function EngineerStory() {
  const about = engineerBeats[0];

  return (
    <section
      id="about"
      aria-label="About Me"
      className="relative flex min-h-[50vh] items-center overflow-hidden py-24"
    >
      <div className="mx-auto grid w-full max-w-6xl grid-cols-1 gap-10 px-6 md:grid-cols-[220px_1fr] md:gap-20">
        {/* Title column */}
        <div className="flex flex-col gap-8">
          <div className="flex items-baseline gap-4">
            <span className="type-heading text-3xl text-accent">01</span>
            <span className="text-xs uppercase tracking-[0.25em] text-text-muted">
              {about.heading}
            </span>
          </div>
        </div>

        {/* Text panel */}
        <div className="relative">
          <h3 className="type-heading text-4xl uppercase text-text md:text-6xl">
            {about.heading}
          </h3>
          <p className="mt-8 max-w-2xl text-base leading-relaxed text-text-muted md:text-lg">
            {about.body}
          </p>
        </div>
      </div>
    </section>
  );
}
