"use client";

/*
 * ═══ MUSIC PORTAL — The Creator chapter ═══
 * Order: Debut song (the cover-reveal beat) · YouTube + Spotify profiles
 * (real fetched avatars/details, stored locally) · Reels strip.
 *
 * Poem visuals and project screenshots to be added — see placeholder
 * slots marked TODO elsewhere in the chapter.
 */

/* eslint-disable @next/next/no-img-element */

import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { InstagramEmbed } from "./InstagramEmbed";
import { musicSection } from "@/content/novel";

const SPOTIFY_GREEN = "#1DB954";

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
          className="polaroid-photo relative flex !aspect-[9/16] items-end justify-center overflow-hidden"
        >
          <div className="film-placeholder" />
          <span className="type-hand relative pb-6 text-lg text-[#e9d6a0]">
            Watch on Instagram ↗
          </span>
        </a>
      )}
    </div>
  );
}

/* ——— Modern profile card: avatar · identity · stat chip · CTA ——— */
function ProfileCard({
  tilt,
  tapeClass,
  image,
  imageAlt,
  name,
  meta,
  bio,
  ctaLabel,
  ctaHref,
  brandDot,
  brandHover,
  caption,
}: {
  tilt: string;
  tapeClass: string;
  image: string;
  imageAlt: string;
  name: string;
  meta: string;
  bio: string;
  ctaLabel: string;
  ctaHref: string;
  brandDot: React.ReactNode;
  brandHover: string;
  caption: string;
}) {
  return (
    <div data-polaroid className="polaroid relative" style={{ "--tilt": tilt } as React.CSSProperties}>
      <span className={`tape -top-3 ${tapeClass}`} />
      <div className="relative overflow-hidden bg-[#14100d]">
        {/* Soft avatar bloom behind the content */}
        <img
          src={image}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full scale-125 object-cover opacity-25 blur-2xl saturate-150"
        />
        <div className="relative flex items-center gap-5 p-6 md:p-7">
          <img
            src={image}
            alt={imageAlt}
            width={96}
            height={96}
            className="h-20 w-20 shrink-0 rounded-2xl border border-white/25 object-cover shadow-lg md:h-24 md:w-24"
          />
          <div className="min-w-0 flex-1">
            <span className="block truncate text-lg font-semibold text-[#f5f2ea]">{name}</span>
            <span className="mt-0.5 inline-block rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] tracking-wide text-[#d8cfbc]">
              {meta}
            </span>
            <p className="mt-2 text-sm leading-snug text-[#a89f8d]">{bio}</p>
            <a
              href={ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className={`mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-sm tracking-wide text-[#f5f2ea] transition-colors ${brandHover}`}
            >
              {brandDot}
              {ctaLabel}
            </a>
          </div>
        </div>
      </div>
      <span className="type-hand block px-3 py-3 text-lg text-[#44403c]">{caption}</span>
    </div>
  );
}

export function MusicSection() {
  return (
    <section aria-label="Music" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      {/* Section intro — unchanged narrative voice */}
      <Reveal className="mb-14">
        <span className="type-hand text-2xl text-accent">keeping taal…</span>
        <h3 className="type-serif mt-2 text-4xl font-light italic text-text md:text-6xl">
          {musicSection.heading}
        </h3>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
          {musicSection.body}
        </p>
      </Reveal>

      {/* ── 1 · Debut song — the cover-reveal beat, first ── */}
      <div className="flex justify-center">
        <div className="w-full max-w-2xl text-center">
          <Reveal>
            <span className="type-hand text-2xl text-accent">and then, a first…</span>
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
              className="polaroid relative w-full max-w-xl"
              style={{ "--tilt": "-1.2deg" } as React.CSSProperties}
            >
              <span className="tape -top-3 left-1/2 -translate-x-1/2 rotate-2" />
              <div className="bg-[#111] p-2">
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
              </div>
              <div className="flex items-center justify-between px-2">
                <span className="type-hand py-3 text-lg text-[#44403c]">
                  {musicSection.debutLabel}
                </span>
                <a
                  href={musicSection.spotifyTrackUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="type-hand text-base text-[#44403c] underline-offset-4 transition-colors hover:text-accent hover:underline"
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
          tilt="-1.8deg"
          tapeClass="left-[10%] rotate-3"
          image={musicSection.youtubeImage}
          imageAlt="Musical Kirtiraj — YouTube channel profile picture"
          name={musicSection.youtubeName}
          meta={`${musicSection.youtubeHandle} · ${musicSection.youtubeStats}`}
          bio={musicSection.youtubeTagline}
          ctaLabel="Visit Channel"
          ctaHref={musicSection.youtubeChannelUrl}
          brandDot={
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff0000] text-[9px] text-white">
              ▶
            </span>
          }
          brandHover="hover:border-[#ff5a5a] hover:text-[#ffb4b4]"
          caption="the YouTube channel"
        />
        <ProfileCard
          tilt="2.2deg"
          tapeClass="right-[10%] -rotate-3"
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
          brandHover="hover:border-[#1DB954] hover:text-[#5ee08a]"
          caption="the artist page"
        />
      </PolaroidGrid>

      {/* ── 3 · Reels — tight frames, no labels, content-sized ── */}
      <Reveal className="mt-20">
        <div className="mb-6 flex items-baseline justify-between">
          <span className="type-hand text-2xl text-accent">taal, on camera…</span>
          <span className="text-xs tracking-[0.25em] text-text-muted">DRAG / SWIPE →</span>
        </div>
      </Reveal>
      <PolaroidGrid className="-mx-6 flex snap-x snap-mandatory items-start gap-6 overflow-x-auto px-6 pb-4 md:mx-0 md:justify-center md:px-0">
        {musicSection.reels.map((reel, i) => (
          <div
            key={reel.id}
            data-polaroid
            className="polaroid relative w-[328px] shrink-0 snap-center !p-1.5"
            style={{ "--tilt": `${(i - 1) * 1.4}deg` } as React.CSSProperties}
          >
            <span
              className="tape -top-3"
              style={{ left: `${16 + i * 8}%`, transform: `rotate(${(1 - i) * 3}deg)` }}
            />
            <LazyReel href={reel.href} />
          </div>
        ))}
      </PolaroidGrid>
    </section>
  );
}
