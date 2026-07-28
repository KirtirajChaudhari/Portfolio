"use client";

import Image from "next/image";
import { KineticText, Reveal } from "../Reveal";
import { Pin, Pinned, PinnedGroup, Tape, crayon } from "./Pinboard";
import { chapterTwoMeta } from "@/content/novel";

/*
 * Chapter Two opens on a board, not a banner.
 *
 * This composition is the reference for the whole mode: rotations stay
 * within ±5°, every shadow comes from the --pin-shadow-* tokens (light
 * source top-left), and the lead hue arrives through small objects —
 * tape, pins, a highlighter stroke — never a colour block. The flat
 * full-bleed band this replaces is the mechanism DESIGN.md bans outright.
 */
export function CreatorHero() {
  return (
    <header
      aria-label="Chapter Two — The Creator"
      className="paper-board relative overflow-hidden px-6 pb-24 pt-16 md:pb-32 md:pt-24"
    >
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-16 md:grid-cols-12 md:gap-8">
        {/* ── Type block — deliberately left of centre ── */}
        <div className="md:col-span-7">
          <Reveal>
            <span className="type-serif text-lg italic text-text-muted md:text-xl">
              {chapterTwoMeta.kicker}
            </span>
          </Reveal>

          <Reveal delay={0.1}>
            <h2
              className="type-heading mt-4 text-[clamp(3.25rem,9vw,6rem)] leading-[0.9] tracking-tight text-text"
              style={{ textWrap: "balance" }}
            >
              The{" "}
              <span
                className="highlighter"
                style={{ "--stroke-hue": crayon("pink") } as React.CSSProperties}
              >
                Creator
              </span>
            </h2>

            {/* Drawn swash — the hand under the title. */}
            <svg
              aria-hidden
              viewBox="0 0 320 22"
              className="mt-2 h-5 w-56 md:w-72"
              fill="none"
            >
              <path
                d="M3 14C52 5 101 3 150 7C199 11 248 17 317 8"
                stroke={crayon("pink")}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              <path
                d="M96 19C142 13 188 12 236 16"
                stroke={crayon("violet")}
                strokeWidth="2"
                strokeLinecap="round"
                opacity="0.7"
              />
            </svg>
          </Reveal>

          <KineticText
            text={chapterTwoMeta.epigraph}
            className="type-serif mt-8 max-w-md text-xl italic leading-relaxed text-text md:text-2xl"
          />

          <Reveal delay={0.2}>
            <span className="type-hand scroll-pulse mt-12 inline-block text-lg text-text-muted">
              scroll, gently ↓
            </span>
          </Reveal>
        </div>

        {/* ── The board — overlapping objects, asymmetric, weighted low-right ── */}
        <PinnedGroup className="relative md:col-span-5 md:h-[30rem]">
          {/* Polaroid — his own channel portrait, pinned at the top. */}
          <div className="mx-auto w-60 md:absolute md:left-2 md:top-0 md:mx-0 md:w-64">
            <Pinned tilt={-3.5} className="border border-border bg-surface p-2.5 pb-11">
              <Pin hue="pink" className="-top-2 left-1/2 -translate-x-1/2" />
              <Image
                src="/creator/youtube-profile.jpg"
                alt="Kirtiraj Chaudhari — the portrait from his music channel"
                width={512}
                height={512}
                className="aspect-square w-full object-cover"
                priority
              />
              <span className="type-hand absolute inset-x-0 bottom-2 text-center text-xl text-text-muted">
                off the clock
              </span>
            </Pinned>
          </div>

          {/* Ticket stub — the book device, torn along a perforation. */}
          <div className="mx-auto mt-8 w-52 md:absolute md:-left-6 md:bottom-6 md:mt-0 md:w-56">
            <Pinned tilt={4.5} className="border border-border bg-surface">
              <Tape hue="peach" className="-top-3 left-6" rotate={-9} />
              <div className="flex items-stretch">
                <div
                  className="flex w-11 shrink-0 items-center justify-center"
                  style={{ backgroundColor: crayon("peach") }}
                >
                  <span className="type-heading rotate-180 text-[0.65rem] tracking-[0.25em] text-text [writing-mode:vertical-rl]">
                    STUB
                  </span>
                </div>
                {/* Perforation */}
                <div className="w-px border-l border-dashed border-border" />
                <div className="px-4 py-4">
                  <span className="type-heading block text-xs tracking-[0.3em] text-text-muted">
                    ADMIT ONE
                  </span>
                  <span className="type-heading mt-1 block text-xl leading-none text-text">
                    CHAPTER TWO
                  </span>
                  <span className="type-hand mt-1 block text-base text-text-muted">
                    no case studies
                  </span>
                </div>
              </div>
            </Pinned>
          </div>

          {/* Handwritten scrap — the line the whole chapter runs on. */}
          <div className="mx-auto mt-8 w-56 md:absolute md:bottom-0 md:right-0 md:mt-0 md:w-60">
            <Pinned tilt={-2.5} className="border border-border bg-surface px-5 py-4">
              <Tape hue="violet" className="-top-3 right-5" rotate={7} />
              <p className="type-hand text-xl leading-snug text-text">
                tabla first — years before the first line of code
              </p>
            </Pinned>
          </div>
        </PinnedGroup>
      </div>
    </header>
  );
}
