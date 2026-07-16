"use client";

import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { musicSection } from "@/content/novel";

const artistId = musicSection.spotifyArtistUrl.split("/artist/")[1]?.split("?")[0];
const artistEmbedUrl = `https://open.spotify.com/embed/artist/${artistId}?utm_source=generator&theme=0`;

/*
 * Artist identity first (spec v2 §10): Spotify artist profile card and
 * YouTube channel card sit ABOVE the debut single. All embeds stay live
 * (official Spotify iframes) but wear the scrapbook frame.
 */
export function MusicSection() {
  return (
    <section aria-label="Music" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="mb-14">
        <span className="type-hand text-2xl text-accent">keeping taal…</span>
        <h3 className="type-serif mt-2 text-4xl font-light italic text-text md:text-6xl">
          {musicSection.heading}
        </h3>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-text-muted md:text-lg">
          {musicSection.body}
        </p>
      </Reveal>

      {/* Artist identity row */}
      <PolaroidGrid className="grid grid-cols-1 gap-10 md:grid-cols-2">
        <div
          data-polaroid
          className="polaroid relative"
          style={{ "--tilt": "-1.8deg" } as React.CSSProperties}
        >
          <span className="tape -top-3 left-[10%] rotate-3" />
          <div className="bg-[#111] p-2">
            <iframe
              src={artistEmbedUrl}
              width="100%"
              height="352"
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              loading="lazy"
              title="Kirtiraj Chaudhari on Spotify"
              className="rounded"
            />
          </div>
          <div className="flex items-center justify-between px-2">
            <span className="type-hand py-3 text-lg text-[#44403c]">the artist page</span>
            <a
              href={musicSection.spotifyArtistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="type-hand text-base text-[#44403c] underline-offset-4 transition-colors hover:text-accent hover:underline"
            >
              open in Spotify ↗
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-10">
          {/* YouTube channel card */}
          <div
            data-polaroid
            className="polaroid relative"
            style={{ "--tilt": "2.2deg" } as React.CSSProperties}
          >
            <span className="tape -top-3 right-[10%] -rotate-3" />
            {musicSection.youtubeChannelUrl ? (
              <a
                href={musicSection.youtubeChannelUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 bg-[#161210] p-6"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#ff0000] text-xl text-white">
                  ▶
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#f5f2ea]">
                    Tabla, on camera
                  </span>
                  <span className="mt-1 block text-xs text-[#a89f8d]">
                    Watch performances on YouTube ↗
                  </span>
                </span>
              </a>
            ) : (
              /* TODO(kirtiraj): add the channel URL in content/shared.ts */
              <div className="flex items-center gap-4 bg-[#161210] p-6">
                <span className="flex h-14 w-14 animate-pulse items-center justify-center rounded-full bg-zinc-700 text-xl text-zinc-400">
                  ▶
                </span>
                <span>
                  <span className="block text-sm font-semibold text-[#f5f2ea]">
                    Tabla, on camera
                  </span>
                  <span className="mt-1 block font-mono text-[10px] tracking-[0.2em] text-zinc-400">
                    CHANNEL URL PENDING
                  </span>
                </span>
              </div>
            )}
            <span className="type-hand block px-3 py-3 text-lg text-[#44403c]">
              the YouTube channel
            </span>
          </div>

          {/* Tabla reels — link out to Instagram */}
          <div
            data-polaroid
            className="polaroid relative"
            style={{ "--tilt": "1.4deg" } as React.CSSProperties}
          >
            <span className="tape -top-3 left-[14%] rotate-2" />
            <div className="flex flex-col gap-2 bg-[#161210] p-5">
              <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#a89f8d]">
                Performance reels
              </span>
              {musicSection.reels.map((reel) => (
                <a
                  key={reel.id}
                  href={reel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-between rounded border border-white/10 px-4 py-2.5 transition-colors hover:border-accent/60"
                >
                  <span className="type-hand text-lg text-[#f5f2ea] transition-colors group-hover:text-accent">
                    {reel.label}
                  </span>
                  <span className="text-xs text-[#a89f8d]">Instagram ↗</span>
                </a>
              ))}
            </div>
            <span className="type-hand block px-3 py-3 text-lg text-[#44403c]">
              taal, on camera
            </span>
          </div>

          {/* Debut single */}
          <div
            data-polaroid
            className="polaroid relative"
            style={{ "--tilt": "-2.5deg" } as React.CSSProperties}
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
                title="Debut single on Spotify"
                className="rounded"
              />
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="type-hand py-3 text-lg text-[#44403c]">{musicSection.debutLabel}</span>
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
        </div>
      </PolaroidGrid>
    </section>
  );
}
