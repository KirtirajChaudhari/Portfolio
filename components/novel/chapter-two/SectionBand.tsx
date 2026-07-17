"use client";

import { Reveal } from "../Reveal";

/**
 * Full-bleed crayon band that opens each Chapter Two section
 * (toryloves chapter-band pattern; bureaudimanche-scale type).
 * One band color per section, assigned in DESIGN.md — ink type on top.
 */
export function SectionBand({
  color,
  note,
  title,
  handle,
  handleHref,
  align = "left",
}: {
  /** Tailwind bg class for the section's crayon color, e.g. "bg-crayon-blue". */
  color: string;
  /** Short handwritten lead-in, e.g. "chasing light…". */
  note?: string;
  title: string;
  handle?: string;
  handleHref?: string;
  align?: "left" | "right";
}) {
  return (
    <div className={`w-full ${color} py-12 md:py-16`}>
      <Reveal
        className={`mx-auto max-w-6xl px-6 ${align === "right" ? "text-right" : ""}`}
      >
        {note && <span className="type-hand block text-2xl text-text">{note}</span>}
        <h3
          className="type-heading mt-1 text-[clamp(3rem,9vw,6rem)] leading-[0.95] text-text"
          style={{ textWrap: "balance" }}
        >
          {title}
        </h3>
        {handle && handleHref && (
          <a
            href={handleHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block text-sm text-text underline decoration-text/30 underline-offset-4 transition-colors hover:decoration-text"
          >
            {handle} ↗
          </a>
        )}
      </Reveal>
    </div>
  );
}
