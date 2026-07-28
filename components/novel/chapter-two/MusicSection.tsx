"use client";

/*
 * Music — the most complete section, restyled onto the board.
 *
 * Debut single as a pinned handbill (the centrepiece), the two platform
 * profiles as smaller stapled cards under it, and the tabla reels as a
 * contact sheet. The reels keep the drag-scroll interaction they already
 * had; only the frame around them changed. Every embed here is the real
 * one — nothing is a mock.
 */

import Image from "next/image";
import { Reveal } from "../Reveal";
import { LazyInstagram } from "./LazyInstagram";
import { SectionHeader } from "./SectionHeader";
import { Pin, Pinned, PinnedGroup, Staple, Tape, crayon } from "./Pinboard";
import { musicSection } from "@/content/novel";

const SPOTIFY_GREEN = "#1DB954";
const YOUTUBE_RED = "#FF0000";

/* ——— Stapled platform card ——————————————————————————————————— */
function StapledCard({
  image,
  imageAlt,
  name,
  meta,
  bio,
  ctaLabel,
  ctaHref,
  brandDot,
  caption,
  tilt,
}: {
  image: string;
  imageAlt: string;
  name: string;
  meta: string;
  bio: string;
  ctaLabel: string;
  ctaHref: string;
  brandDot: React.ReactNode;
  caption: string;
  tilt: number;
}) {
  return (
    <Pinned tilt={tilt} className="border border-border bg-surface p-2">
      <Staple className="-top-1 left-1/2 -translate-x-1/2" rotate={tilt > 0 ? -5 : 5} />
      <div className="flex items-center gap-4 p-4">
        <Image
          src={image}
          alt={imageAlt}
          width={96}
          height={96}
          className="h-16 w-16 shrink-0 rounded-sm border border-border object-cover md:h-20 md:w-20"
        />
        <div className="min-w-0 flex-1">
          <span className="block truncate text-base font-semibold text-text">
            {name}
          </span>
          <span
            className="mt-1 inline-block rounded-full px-2.5 py-0.5 text-[11px] tracking-wide text-text"
            style={{ backgroundColor: crayon("sun") }}
          >
            {meta}
          </span>
          <p className="mt-2 text-sm leading-snug text-text-muted">{bio}</p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-4 py-1.5 text-sm tracking-wide text-text transition-colors duration-[var(--dur-ui)] hover:border-text"
          >
            {brandDot}
            {ctaLabel}
          </a>
        </div>
      </div>
      <span className="type-hand block px-3 pb-1 text-lg text-text-muted">
        {caption}
      </span>
    </Pinned>
  );
}

export function MusicSection() {
  return (
    /* The handbill's rotated corner tapes overhang by a few px on a phone;
       clip that axis only, leaving vertical overhang (tape tops) visible. */
    <section aria-label="Music" className="overflow-x-clip py-16 md:py-24">
      <SectionHeader
        note="keeping taal…"
        title={musicSection.heading}
        highlight="Musician"
        hue="peach"
      />

      <div className="mx-auto max-w-6xl px-6">
        <Reveal className="mt-12 md:mt-16">
          <p className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
            {musicSection.body}
          </p>
        </Reveal>

        <PinnedGroup className="mt-16 md:mt-20">
          {/* ── 1 · The handbill — debut single, centre stage ── */}
          <div className="flex justify-center">
            <div className="w-full max-w-lg">
              <Pinned
                tilt={-2}
                className="border border-border bg-surface px-5 pb-5 pt-8 md:px-7 md:pb-7"
              >
                <Pin hue="peach" className="-top-2 left-1/2 -translate-x-1/2" />
                <Tape hue="pink" className="-top-3 -left-4" rotate={-38} />
                <Tape hue="sun" className="-top-3 -right-4" rotate={38} />

                <span className="type-hand block text-center text-2xl text-text-muted">
                  and then, a first…
                </span>

                <div className="mt-5 flex justify-center">
                  <Image
                    src={musicSection.artistImage}
                    alt={`${musicSection.debutTitle} — single artwork`}
                    width={300}
                    height={300}
                    className="w-40 border border-border object-cover shadow-[var(--pin-shadow-flat)] md:w-48"
                  />
                </div>

                <span className="type-heading mt-5 block text-center text-xs tracking-[0.35em] text-text-muted">
                  {musicSection.debutLabel.toUpperCase()}
                </span>
                <h4
                  className="type-heading mt-2 text-center text-[clamp(1.75rem,5vw,2.75rem)] leading-[0.95] text-text"
                  style={{ textWrap: "balance" }}
                >
                  {musicSection.debutTitle}
                </h4>

                {/* Rule, drawn rather than ruled. */}
                <svg
                  aria-hidden
                  viewBox="0 0 240 8"
                  className="mx-auto mt-4 h-2 w-40"
                  fill="none"
                >
                  <path
                    d="M2 5C42 2 82 2 122 4C162 6 202 6 238 3"
                    stroke={crayon("peach")}
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>

                <p className="type-serif mx-auto mt-5 max-w-md text-center text-base italic leading-relaxed text-text-muted">
                  {musicSection.debutStory}
                </p>

                <iframe
                  src={musicSection.spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${musicSection.debutTitle} — debut single on Spotify`}
                  className="mt-6 rounded"
                />

                <div className="mt-1 flex justify-center">
                  <a
                    href={musicSection.spotifyTrackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-hand text-lg text-text-muted underline-offset-4 transition-colors duration-[var(--dur-ui)] hover:text-text hover:underline"
                  >
                    open the track ↗
                  </a>
                </div>
              </Pinned>
            </div>
          </div>

          {/* ── 2 · Stapled platform cards, smaller, beneath ── */}
          <div className="mx-auto mt-16 grid max-w-3xl grid-cols-1 gap-10 md:mt-20 md:grid-cols-2">
            <StapledCard
              tilt={-2.5}
              image={musicSection.youtubeImage}
              imageAlt="Musical Kirtiraj — YouTube channel profile picture"
              name={musicSection.youtubeName}
              meta={`${musicSection.youtubeHandle} · ${musicSection.youtubeStats}`}
              bio={musicSection.youtubeTagline}
              ctaLabel="Visit Channel"
              ctaHref={musicSection.youtubeChannelUrl}
              brandDot={
                <span
                  className="flex h-5 w-5 items-center justify-center rounded-full text-[9px] text-white"
                  style={{ backgroundColor: YOUTUBE_RED }}
                >
                  ▶
                </span>
              }
              caption="the YouTube channel"
            />
            <StapledCard
              tilt={3}
              image={musicSection.artistImage}
              imageAlt="Kirtiraj Nitin Chaudhari — Spotify artist artwork"
              name={musicSection.artistName}
              meta="Artist on Spotify"
              bio={musicSection.artistBio}
              ctaLabel="Listen on Spotify"
              ctaHref={musicSection.spotifyArtistUrl}
              brandDot={
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: SPOTIFY_GREEN }}
                />
              }
              caption="the artist page"
            />
          </div>
        </PinnedGroup>

        {/* ── 3 · Contact sheet — same drag-scroll, new frame ── */}
        <Reveal className="mt-20 md:mt-24">
          <div className="mb-5 flex items-baseline justify-between">
            <span className="type-hand text-2xl text-text-muted">
              taal, on camera…
            </span>
            <span className="text-sm text-text-muted">drag to browse →</span>
          </div>
        </Reveal>

        <Reveal>
          <div className="relative -mx-6 md:mx-0">
            <div className="filmstrip relative overflow-hidden px-6 py-6 md:px-8">
              {/* w-max + mx-auto rather than justify-center: on a scroll
                  container, centering an overflowing track pushes the first
                  frame past the left edge where it cannot be scrolled back. */}
              <div className="scrollbar-hide snap-x snap-mandatory overflow-x-auto py-3">
                <div className="mx-auto flex w-max items-start gap-5">
                  {musicSection.reels.map((reel) => (
                    <figure
                      key={reel.id}
                      className="w-[328px] shrink-0 snap-center bg-surface p-1.5"
                    >
                      <LazyInstagram
                        href={reel.href}
                        hue="peach"
                        aspect="aspect-[9/16]"
                        label="Watch on Instagram ↗"
                      />
                      <figcaption className="type-hand px-1 pt-1 text-base text-text-muted">
                        {reel.label}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
