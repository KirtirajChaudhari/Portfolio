"use client";

import { Reveal } from "../Reveal";
import { SectionHeader } from "./SectionHeader";
import { LazyInstagram } from "./LazyInstagram";
import { Pinned, PinnedGroup, Tape, type CrayonHue } from "./Pinboard";
import { photographyWall, photographyMeta } from "@/content/novel";

/*
 * Photography — the posts as a wall of polaroids rather than a carousel.
 *
 * Laid out in CSS columns, not absolute coordinates: Meta's embed script
 * rewrites each blockquote's height after it loads, which would tear a
 * fixed-position scatter apart. Columns keep the overlap and the varied
 * depth while surviving that reflow. Below `md` the wall becomes a single
 * column — Instagram's embed has a 326px minimum width and will overflow
 * anything narrower.
 */

/* Each tape a different hue across the wall (DESIGN.md application rule 4). */
const TAPE_HUES: CrayonHue[] = ["blue", "sun", "pink", "leaf", "peach", "violet"];

/* Per-card vertical offset — breaks the column baselines so the wall reads
   as pinned by hand rather than laid out on a grid. */
const OFFSETS = ["md:mt-0", "md:mt-10", "md:mt-4", "md:mt-14", "md:mt-6", "md:mt-2"];

export function PhotographyWall() {
  return (
    /* overflow-x-clip, not hidden: clip leaves the vertical axis alone,
       where `hidden` would turn the section into a scroll container and
       break the sticky/ScrollTrigger measurements above it. */
    <section aria-label="Photography" className="overflow-x-clip py-16 md:py-24">
      <SectionHeader
        note="chasing light…"
        title="Photography"
        highlight="Photography"
        hue="blue"
        handle={photographyMeta.handle}
        handleHref={photographyMeta.profileUrl}
      />

      {/* Tight gutters below sm: Instagram's embed will not render under
          326px wide, and px-6 plus card padding leaves less than that on a
          390px phone. */}
      <PinnedGroup className="mx-auto mt-16 max-w-6xl px-2 sm:px-6 md:mt-20 md:columns-2 md:gap-10 lg:columns-3 lg:gap-8">
        {photographyWall.map((photo, i) => (
          <div
            key={photo.id}
            className={`mb-10 break-inside-avoid ${OFFSETS[i % OFFSETS.length]}`}
            /* Alternating pull-in creates the overlap between columns. */
            style={{ marginLeft: i % 3 === 1 ? "-0.75rem" : undefined }}
          >
            <Pinned
              tilt={photo.rotate}
              className="border border-border bg-surface p-1.5 pb-8 sm:p-2 sm:pb-8"
            >
              <Tape
                hue={TAPE_HUES[i % TAPE_HUES.length]}
                className={i % 2 === 0 ? "-top-3 left-7" : "-top-3 right-7"}
                rotate={i % 2 === 0 ? -8 : 9}
              />
              <LazyInstagram
                href={photo.href}
                hue="blue"
                aspect="aspect-square"
                label="View on Instagram ↗"
              />
              {/* Contact-sheet index — the only caption; the embed carries
                  the real one from the post itself. */}
              <span className="type-hand absolute bottom-1 right-3 text-lg text-text-muted">
                {String(i + 1).padStart(2, "0")}
              </span>
            </Pinned>
          </div>
        ))}
      </PinnedGroup>

      <Reveal className="mx-auto mt-6 max-w-6xl px-6 text-center">
        <a
          href={photographyMeta.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="type-hand text-xl text-text-muted underline decoration-[var(--crayon-blue)] decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-ui)] hover:text-text"
        >
          more frames on Instagram ↗
        </a>
      </Reveal>
    </section>
  );
}
