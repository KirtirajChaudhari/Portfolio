"use client";

import { SectionBand } from "./SectionBand";
import { poetryMeta } from "@/content/novel";
import { PoetryBook } from "./PoetryBook";
import { poems } from "@/content/poetry";

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

      <div className="mx-auto flex w-full max-w-6xl justify-center overflow-hidden px-2 pt-14 md:px-6 md:pt-20">
        <div className="flex origin-top items-start justify-center" style={{ transform: "scale(min(1, calc(100vw / 860)))" }}>
          <PoetryBook poems={poems} />
        </div>
      </div>
    </section>
  );
}
