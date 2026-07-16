"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    instgrm?: { Embeds: { process: () => void } };
  }
}

const SCRIPT_SRC = "https://www.instagram.com/embed.js";
let scriptPromise: Promise<void> | null = null;

function loadEmbedScript(): Promise<void> {
  if (window.instgrm) return Promise.resolve();
  if (!scriptPromise) {
    scriptPromise = new Promise((resolve) => {
      const existing = document.querySelector<HTMLScriptElement>(`script[src="${SCRIPT_SRC}"]`);
      if (existing) {
        existing.addEventListener("load", () => resolve(), { once: true });
        if (window.instgrm) resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = SCRIPT_SRC;
      script.async = true;
      script.onload = () => resolve();
      document.body.appendChild(script);
    });
  }
  return scriptPromise;
}

/*
 * The real post, live — Meta's own client-side embed widget (the same
 * "Embed" button any public Instagram post exposes), not a scrape and not
 * an API token. It renders the actual photo, caption, and like count, and
 * stays current since nothing is cached locally. Degrades to a plain
 * "View on Instagram" link if the script is blocked or slow.
 */
export function InstagramEmbed({ url }: { url: string }) {
  useEffect(() => {
    let cancelled = false;
    loadEmbedScript().then(() => {
      if (!cancelled) window.instgrm?.Embeds.process();
    });
    return () => {
      cancelled = true;
    };
  }, [url]);

  return (
    <blockquote
      className="instagram-media"
      data-instgrm-permalink={url}
      data-instgrm-captioned=""
      data-instgrm-version="14"
      style={{ background: "#FFF", margin: 0, maxWidth: 540, minWidth: 326, width: "100%" }}
    >
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="block bg-white p-6 text-center text-xs text-black"
      >
        View this post on Instagram ↗
      </a>
    </blockquote>
  );
}
