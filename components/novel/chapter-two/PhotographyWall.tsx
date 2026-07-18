"use client";

import { Reveal } from "../Reveal";
import { LuminaRotatingGallery } from "./LuminaRotatingGallery";

import { SectionBand } from "./SectionBand";
import { photographyWall, photographyMeta } from "@/content/novel";

/*
 * Photography — bureaudimanche pattern: a bold typographic band entry
 * opening into a scrollable post feed. Live Meta embeds render as clean
 * white post cards on the paper. Single column below md so Instagram's
 * 326px embed minimum never overflows a masonry column.
 */
export function PhotographyWall() {
  return (
    <section aria-label="Photography" className="py-16 md:py-24">
      <SectionBand
        color="bg-crayon-blue"
        note="chasing light…"
        title="Photography"
        handle={photographyMeta.handle}
        handleHref={photographyMeta.profileUrl}
      />

      <div className="mx-auto w-full pt-4 md:pt-10">
        <LuminaRotatingGallery items={photographyWall} />
      </div>

      <Reveal className="mx-auto mt-4 max-w-6xl px-6 text-center">
        <a
          href={photographyMeta.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="type-hand text-xl text-text-muted transition-colors hover:text-text"
        >
          more frames on Instagram ↗
        </a>
      </Reveal>
    </section>
  );
}
