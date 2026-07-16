"use client";

import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { InstagramEmbed } from "./InstagramEmbed";
import { photographyWall, photographyMeta } from "@/content/novel";

/*
 * Instagram polaroids — live Meta embeds (real photo, caption, likes),
 * not scraped, not manually exported. Each card keeps the scrapbook tilt
 * + tape + shadow frame; the embed's own white card sits inside it like a
 * printed photo in a polaroid mount. Single column below md so Instagram's
 * 326px embed minimum never overflows a masonry column.
 */
export function PhotographyWall() {
  return (
    <section aria-label="Photography" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="mb-16 md:mb-20">
        <span className="type-hand text-2xl text-accent">chasing light…</span>
        <h3 className="type-serif mt-2 text-4xl font-light italic text-text md:text-6xl">
          Photography
        </h3>
        <a
          href={photographyMeta.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-text-muted transition-colors hover:text-accent"
        >
          {photographyMeta.handle} ↗
        </a>
      </Reveal>

      {/* Loose scatter: masonry columns, varied offsets and tilts */}
      <PolaroidGrid className="columns-1 gap-8 md:columns-2 lg:columns-3 md:gap-10 [&>*]:mb-8 md:[&>*]:mb-10">
        {photographyWall.map((photo, i) => (
          <div
            key={photo.id}
            data-polaroid
            className="polaroid relative block break-inside-avoid"
            style={{ "--tilt": `${photo.rotate}deg` } as React.CSSProperties}
          >
            <span
              className="tape -top-3"
              style={{
                left: i % 2 === 0 ? "8%" : "auto",
                right: i % 2 === 0 ? "auto" : "8%",
                transform: `rotate(${photo.rotate * -2}deg)`,
              }}
            />
            <div className="overflow-hidden">
              <InstagramEmbed url={photo.href} />
            </div>
          </div>
        ))}
      </PolaroidGrid>
    </section>
  );
}
