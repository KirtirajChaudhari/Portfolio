"use client";

import { useEffect, useRef, useState } from "react";
import { InstagramEmbed } from "./InstagramEmbed";
import { crayon, type CrayonHue } from "./Pinboard";

/**
 * Meta's embed widget is heavy and this page mounts fourteen of them.
 * Each one waits until it is near the viewport, and shows a crayon-tinted
 * placeholder that is itself a working link until then.
 */
export function LazyInstagram({
  href,
  hue = "blue",
  aspect = "aspect-square",
  label = "View on Instagram ↗",
}: {
  href: string;
  hue?: CrayonHue;
  /** Tailwind aspect class for the pre-mount placeholder. */
  aspect?: string;
  label?: string;
}) {
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
    /* Meta's script sizes its own iframe and can return one wider than the
       column it sits in. A definite-width, clipping wrapper keeps that from
       stretching the card and pushing the page into horizontal scroll. */
    <div ref={ref} className="w-full overflow-hidden">
      {visible ? (
        /* InstagramEmbed's inner anchor doubles as the graceful fallback
           ("View this post on Instagram ↗") if Meta's script never loads. */
        <InstagramEmbed url={permalink} />
      ) : (
        /* A tint, not a fill — a wall of eleven saturated squares would be
           the flat colour-block mechanism DESIGN.md bans, and this is what
           anyone on a slow connection sees first. The hue identifies the
           section; the crayon rule keeps its weight in the corner. */
        <a
          href={permalink}
          target="_blank"
          rel="noopener noreferrer"
          className={`relative flex ${aspect} items-end justify-center overflow-hidden rounded-[2px] border border-border`}
          style={{
            backgroundColor: `color-mix(in oklab, ${crayon(hue)} 18%, var(--surface-2))`,
          }}
        >
          <span
            aria-hidden
            className="absolute left-0 top-0 h-1.5 w-14"
            style={{ backgroundColor: crayon(hue) }}
          />
          <span className="type-hand pb-6 text-lg text-text-muted">{label}</span>
        </a>
      )}
    </div>
  );
}
