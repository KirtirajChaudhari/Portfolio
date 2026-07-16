/* eslint-disable @next/next/no-img-element */
"use client";

import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { photographyWall, photographyMeta } from "@/content/novel";

/*
 * Instagram polaroids as static supplied assets (never scraped).
 * Frames follow each photo's NATURAL aspect ratio — `img` keeps its
 * intrinsic dimensions and the white border stays constant. Placeholders
 * (no src yet) fall back to a 4/5 film frame.
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
      <PolaroidGrid className="columns-2 gap-8 md:columns-3 md:gap-10 [&>*]:mb-8 md:[&>*]:mb-10">
        {photographyWall.map((photo, i) => (
          <a
            key={photo.id}
            data-polaroid
            href={photo.href}
            target="_blank"
            rel="noopener noreferrer"
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
            {photo.src ? (
              <div className="relative overflow-hidden bg-[#262220]">
                <img
                  src={photo.src}
                  alt={photo.caption}
                  loading="lazy"
                  className="block h-auto w-full"
                />
              </div>
            ) : (
              <div className="polaroid-photo">
                <div className="film-placeholder" />
              </div>
            )}
            <span className="type-hand block px-1 py-3 text-center text-lg text-[#44403c]">
              {photo.caption}
            </span>
          </a>
        ))}
      </PolaroidGrid>
    </section>
  );
}
