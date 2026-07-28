"use client";

import { Reveal } from "../Reveal";
import { SectionHeader } from "./SectionHeader";
import { Pin, Pinned, PinnedGroup, Tape, crayon } from "./Pinboard";
import { poetryMeta } from "@/content/novel";
import { poemFragments } from "@/content/poetry";

/*
 * Poetry — a mostly-closed notebook, on purpose.
 *
 * The writing is published on Instagram and not duplicated here, so this
 * section is an object and a link rather than a reader. The page edge is
 * visible and the ink on it is deliberately illegible: suggestion, not
 * body text, and nothing invented to fill the space. If a real fragment
 * ever lands in content/poetry.ts, the open page below renders it.
 */
export function PoetryWall() {
  const fragment = poemFragments[0];

  return (
    <section aria-label="Poetry and writing" className="py-16 md:py-24">
      <SectionHeader
        note="between the lines…"
        title="Poetry"
        highlight="Poetry"
        hue="violet"
        handle={poetryMeta.handle}
        handleHref={poetryMeta.profileUrl}
        align="right"
      />

      <PinnedGroup className="mx-auto mt-16 flex max-w-6xl flex-col items-center gap-14 px-6 md:mt-20 md:flex-row md:items-start md:justify-center md:gap-20">
        {/* ── The notebook ── */}
        <Pinned tilt={-2.5} className="w-[17rem] sm:w-[19rem]">
          <Pin hue="violet" className="-top-2 left-1/2 -translate-x-1/2" />

          {/* Offset colour mat, tilted the other way. */}
          <span
            aria-hidden
            className="absolute inset-0 -z-10 rounded-[4px]"
            style={{
              backgroundColor: crayon("violet"),
              transform: "rotate(3deg) translate(7px, 9px)",
            }}
          />

          <div className="relative aspect-[3/4] overflow-hidden rounded-[3px] border border-border bg-surface">
            {/* Spine */}
            <span
              aria-hidden
              className="absolute inset-y-0 left-0 w-7"
              style={{ backgroundColor: crayon("violet") }}
            />
            <span
              aria-hidden
              className="absolute inset-y-0 left-7 w-px bg-border"
            />

            {/* Page block peeking along the fore edge */}
            <span
              aria-hidden
              className="absolute inset-y-3 right-0 w-2.5 bg-[repeating-linear-gradient(to_right,var(--border)_0_1px,transparent_1px_3px)]"
            />

            {/* Elastic closure */}
            <span
              aria-hidden
              className="absolute inset-y-0 right-9 w-2 bg-text/70"
            />

            <div className="absolute inset-x-0 top-0 px-10 pt-10">
              <span className="type-hand block text-2xl leading-tight text-text">
                {poetryMeta.handle}
              </span>
              <span className="type-hand mt-2 block text-lg leading-snug text-text-muted">
                {poetryMeta.blurb}
              </span>
            </div>

            {/* Curled corner — a glimpse of a page, illegible by design. */}
            <div className="absolute bottom-0 right-0 h-28 w-32 overflow-hidden">
              <div className="absolute -bottom-6 -right-6 h-32 w-36 rotate-[-8deg] rounded-sm border border-border bg-surface-2 shadow-[var(--pin-shadow-flat)]">
                <svg
                  aria-hidden
                  viewBox="0 0 120 60"
                  className="mt-5 ml-4 h-10 w-24"
                  fill="none"
                  stroke="var(--text-muted)"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  opacity="0.5"
                >
                  <path d="M2 8c8-5 14 4 22 0s12-6 20-2 14 3 22-1" />
                  <path d="M2 24c10-4 16 3 26 0s14-5 24-1" />
                  <path d="M2 40c7-4 13 3 20 0s11-4 18-1" />
                </svg>
              </div>
            </div>
          </div>
        </Pinned>

        {/* ── The open page — only when there is something real on it ── */}
        <div className="flex w-full max-w-sm flex-col items-center gap-8 md:items-start md:pt-10">
          {fragment && (
            <Pinned
              tilt={2}
              className="w-full border border-border bg-surface px-7 py-8"
            >
              <Tape hue="violet" className="-top-3 left-8" rotate={-7} />
              <div className="type-serif space-y-1 text-lg italic leading-relaxed text-text">
                {fragment.lines.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
              {fragment.note && (
                <span className="type-hand mt-4 block text-lg text-text-muted">
                  {fragment.note}
                </span>
              )}
              <a
                href={fragment.href}
                target="_blank"
                rel="noopener noreferrer"
                className="type-hand mt-3 inline-block text-lg text-text-muted underline-offset-4 transition-colors duration-[var(--dur-ui)] hover:text-text hover:underline"
              >
                read it in full ↗
              </a>
            </Pinned>
          )}

          <Reveal className="text-center md:text-left">
            <p className="type-serif max-w-xs text-lg italic leading-relaxed text-text-muted">
              The notebook stays shut here. The lines that make it out live on
              Instagram.
            </p>
            <a
              href={poetryMeta.profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-hand mt-4 inline-block text-2xl text-text underline decoration-[var(--crayon-violet)] decoration-2 underline-offset-[6px] transition-colors duration-[var(--dur-ui)] hover:text-text-muted"
            >
              read them on Instagram ↗
            </a>
          </Reveal>
        </div>
      </PinnedGroup>
    </section>
  );
}
