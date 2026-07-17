"use client";

import { PolaroidGrid } from "./PolaroidGrid";
import { SectionBand } from "./SectionBand";
import { poetryWall, poetryMeta } from "@/content/novel";

/*
 * Poetry — violet band entry, then poems as clean ink-on-paper cards.
 * Spectral italic carries the poem lines; Caveat signs them off.
 */
export function PoetryWall() {
  return (
    <section aria-label="Poetry and writing" className="py-16 md:py-24">
      <SectionBand
        color="bg-crayon-violet"
        note="between the lines…"
        title="Poetry"
        handle={poetryMeta.handle}
        handleHref={poetryMeta.profileUrl}
        align="right"
      />

      <div className="mx-auto max-w-6xl px-6 pt-14 md:pt-20">
        <PolaroidGrid className="grid grid-cols-1 gap-10 md:grid-cols-3">
          {poetryWall.map((poem, i) => (
            <a
              key={poem.id}
              data-polaroid
              href={poem.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`block rounded-lg border border-border bg-surface px-7 py-9 shadow-[0_10px_24px_var(--shadow-tint)] transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out)] hover:-translate-y-1 ${
                i === 1 ? "md:mt-14" : ""
              }`}
            >
              <span className="type-hand block text-2xl text-text">“{poem.title}”</span>
              <div className="type-serif mt-5 text-lg italic leading-relaxed text-text">
                {poem.lines.map((line, j) => (
                  <p key={j}>{line}</p>
                ))}
              </div>
              <span className="type-hand mt-6 block text-right text-base text-text-muted">
                — from the notebook
              </span>
            </a>
          ))}
        </PolaroidGrid>
      </div>
    </section>
  );
}
