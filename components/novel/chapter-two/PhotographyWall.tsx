"use client";

import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { InstagramEmbed } from "./InstagramEmbed";
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

      <div className="mx-auto max-w-6xl px-6 pt-14 md:pt-20">
        <PolaroidGrid className="columns-1 gap-8 md:columns-2 md:gap-12 [&>*]:mb-8 md:[&>*]:mb-12">
          {photographyWall.map((photo) => (
            <div
              key={photo.id}
              data-polaroid
              className="relative block break-inside-avoid overflow-hidden rounded-lg border border-border bg-surface shadow-[0_10px_24px_var(--shadow-tint)]"
            >
              <InstagramEmbed url={photo.href} />
            </div>
          ))}
        </PolaroidGrid>
      </div>

      <Reveal className="mx-auto mt-10 max-w-6xl px-6 text-center">
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
