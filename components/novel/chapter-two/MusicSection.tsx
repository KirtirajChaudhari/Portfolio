"use client";

/*
 * Music — peach band entry (DESIGN.md), then: debut single embed,
 * YouTube/Spotify profile post cards, and a reels strip. Everything is
 * a white post card on the paper; brand colors (YouTube red, Spotify
 * green) survive only as platform identity dots.
 */

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { InstagramEmbed } from "./InstagramEmbed";
import { SectionBand } from "./SectionBand";
import { musicSection } from "@/content/novel";

const SPOTIFY_GREEN = "#1DB954";
const YOUTUBE_RED = "#FF0000";

/* ——— Lazy mount: reels render only when scrolled near (perf) ——— */
function LazyReel({ href }: { href: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Canonical permalink — the embed script rejects share-tracking params.
  const permalink = href.split("?")[0];

  return (
    <div ref={ref}>
      {visible ? (
        /* InstagramEmbed's inner anchor doubles as the graceful fallback
           ("View this post on Instagram ↗") if Meta's script never loads. */
        <InstagramEmbed url={permalink} />
      ) : (
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className="relative flex aspect-[9/16] items-end justify-center overflow-hidden rounded-md bg-crayon-peach"
        >
          <span className="type-hand relative pb-6 text-lg text-text">
            Watch on Instagram ↗
          </span>
        </a>
      )}
    </div>
  );
}

/* ——— Profile post card: avatar · identity · stat chip · CTA ——— */
function ProfileCard({
  image,
  imageAlt,
  name,
  meta,
  bio,
  ctaLabel,
  ctaHref,
  brandDot,
  caption,
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
}) {
  return (
    <div
      data-polaroid
      className="rounded-lg border border-border bg-surface p-2 shadow-[0_10px_24px_var(--shadow-tint)]"
    >
      <div className="flex items-center gap-5 p-5 md:p-6">
        <img
          src={image}
          alt={imageAlt}
          width={96}
          height={96}
          className="h-20 w-20 shrink-0 rounded-2xl border border-border object-cover md:h-24 md:w-24"
        />
        <div className="min-w-0 flex-1">
          <span className="block truncate text-lg font-semibold text-text">{name}</span>
          <span className="mt-1 inline-block rounded-full bg-crayon-sun px-2.5 py-0.5 text-[11px] tracking-wide text-text">
            {meta}
          </span>
          <p className="mt-2 text-sm leading-snug text-text-muted">{bio}</p>
          <a
            href={ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2 text-sm tracking-wide text-text transition-colors duration-[var(--dur-ui)] hover:border-text"
          >
            {brandDot}
            {ctaLabel}
          </a>
        </div>
      </div>
      <span className="type-hand block px-3 pb-2 text-lg text-text-muted">{caption}</span>
    </div>
  );
}

export function MusicSection() {
  return (
    <section aria-label="Music" className="py-16 md:py-24">
      <SectionBand
        color="bg-crayon-peach"
        note="keeping taal…"
        title={musicSection.heading}
      />

      <div className="mx-auto max-w-6xl px-6 pt-14 md:pt-20">
        <Reveal className="mb-14">
          <p className="max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
            {musicSection.body}
          </p>
        </Reveal>

        {/* ── 1 · Debut song — the cover-reveal beat, first ── */}
        <div className="flex justify-center">
          <div className="w-full max-w-2xl text-center">
            <Reveal>
              <span className="type-hand text-2xl text-text-muted">and then, a first…</span>
              <h4 className="type-serif mt-3 text-3xl font-light italic text-text md:text-5xl">
                “{musicSection.debutTitle}”
              </h4>
              <p className="type-serif mx-auto mt-5 max-w-lg text-base italic leading-relaxed text-text-muted md:text-lg">
                {musicSection.debutStory}
              </p>
            </Reveal>

            <PolaroidGrid className="mt-10 flex justify-center">
              <div
                data-polaroid
                className="w-full max-w-xl rounded-lg border border-border bg-surface p-2 shadow-[0_10px_24px_var(--shadow-tint)]"
              >
                <iframe
                  src={musicSection.spotifyEmbedUrl}
                  width="100%"
                  height="152"
                  frameBorder="0"
                  allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                  loading="lazy"
                  title={`${musicSection.debutTitle} — debut single on Spotify`}
                  className="rounded"
                />
                <div className="flex items-center justify-between px-2">
                  <span className="type-hand py-3 text-lg text-text-muted">
                    {musicSection.debutLabel}
                  </span>
                  <a
                    href={musicSection.spotifyTrackUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="type-hand text-base text-text-muted underline-offset-4 transition-colors hover:text-text hover:underline"
                  >
                    open the track ↗
                  </a>
                </div>
              </div>
            </PolaroidGrid>
          </div>
        </div>

        {/* ── 2 · YouTube + Spotify profiles — real fetched identities ── */}
        <PolaroidGrid className="mt-20 grid grid-cols-1 gap-10 md:mt-24 md:grid-cols-2">
          <ProfileCard
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
          <ProfileCard
            image={musicSection.artistImage}
            imageAlt="Kirtiraj Nitin Chaudhari — Spotify artist artwork"
            name={musicSection.artistName}
            meta="Artist on Spotify"
            bio={musicSection.artistBio}
            ctaLabel="Listen on Spotify"
            ctaHref={musicSection.spotifyArtistUrl}
            brandDot={
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: SPOTIFY_GREEN }} />
            }
            caption="the artist page"
          />
        </PolaroidGrid>

        {/* ── 3 · Reels — tight frames, content-sized ── */}
        <Reveal className="mt-20">
          <div className="mb-6 flex items-baseline justify-between">
            <span className="type-hand text-2xl text-text-muted">taal, on camera…</span>
            <span className="text-sm text-text-muted">drag to browse →</span>
          </div>
        </Reveal>
        <PolaroidGrid className="-mx-6 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-6 pb-4 md:mx-0 md:justify-center md:px-0">
          {musicSection.reels.map((reel) => (
            <div
              key={reel.id}
              data-polaroid
              className="w-[328px] shrink-0 snap-center rounded-lg border border-border bg-surface p-1.5 shadow-[0_10px_24px_var(--shadow-tint)]"
            >
              <LazyReel href={reel.href} />
            </div>
          ))}
        </PolaroidGrid>
      </div>
    </section>
  );
}
