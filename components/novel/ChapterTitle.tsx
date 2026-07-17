"use client";

import { Reveal, KineticText } from "./Reveal";

interface ChapterTitleProps {
  kicker: string;
  title: string;
  epigraph?: string;
  /** Creator chapter renders the title in the editorial serif. */
  serif?: boolean;
}

/**
 * Chapter opener — same reveal grammar in both chapters, only the
 * typeface shifts. Turning a page, not switching apps.
 */
export function ChapterTitle({ kicker, title, epigraph, serif = false }: ChapterTitleProps) {
  return (
    <div className="mx-auto max-w-5xl px-6 py-28 text-center md:py-40">
      <Reveal>
        <span className="type-serif text-lg italic text-accent md:text-xl">
          {kicker}
        </span>
      </Reveal>
      <KineticText
        as="h2"
        text={title}
        className={
          serif
            ? "type-serif mt-6 text-[clamp(2.75rem,8vw,6rem)] font-light italic leading-[1.05] text-text"
            : "type-heading mt-6 text-[clamp(2.75rem,8vw,6rem)] uppercase leading-[0.95] text-text"
        }
      />
      {epigraph && (
        <Reveal delay={0.2}>
          <p className="type-serif mx-auto mt-8 max-w-xl text-base italic leading-relaxed text-text-muted md:text-lg">
            {epigraph}
          </p>
        </Reveal>
      )}
    </div>
  );
}
