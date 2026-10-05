import { useEffect, useRef } from 'react';
import { photographyWall, photographyMeta } from '../../content/novel';

const TOTAL = photographyWall.length;
const frameName = (i: number) => `Frame ${String(i + 1).padStart(2, '0')}`;

/** Injects the Instagram embed script once and re-processes whenever new embeds appear. */
function useInstagramEmbeds(deps: unknown[]) {
  useEffect(() => {
    const ig = (window as any).instgrm;
    if (ig?.Embeds?.process) {
      ig.Embeds.process();
      return;
    }
    // Script not yet loaded — inject it.
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      const s = document.createElement('script');
      s.src = 'https://www.instagram.com/embed.js';
      s.async = true;
      document.body.appendChild(s);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
}

/**
 * PhotoWall
 *
 * Horizontal-scroll film strip — same layout as before, but each tile now
 * embeds the real Instagram post (photo + caption) using the official
 * Instagram embed script. No token or API key is required.
 *
 * Each tile is fixed-width so the strip scrolls horizontally. The embed
 * renders inside its own iframe so Instagram's own privacy / caching
 * rules apply. Clicking the embed opens the post on Instagram.
 */
export default function PhotoWall() {
  const stripRef = useRef<HTMLUListElement>(null);
  useInstagramEmbeds([]);

  return (
    <div>
      {/* ── Strip ── */}
      <div
        className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12090a]"
        role="group"
        aria-label={`Photography wall — ${TOTAL} posts. Scroll to browse. Each tile links to Instagram.`}
      >
        {/* left / right fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-[#12090a] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-[#12090a] to-transparent" />

        <ul
          ref={stripRef}
          className="flex snap-x snap-mandatory items-start gap-4 overflow-x-auto px-8 py-6 sm:gap-5 sm:px-10 sm:py-8"
          style={{ scrollbarWidth: 'none' }}
        >
          {photographyWall.map((p) => (
            <li
              key={p.id}
              className="w-[280px] shrink-0 snap-center overflow-hidden rounded-xl bg-white sm:w-[320px]"
            >
              {/* Official Instagram embed blockquote */}
              <blockquote
                className="instagram-media !m-0 !min-w-0 !w-full"
                data-instgrm-permalink={p.href}
                data-instgrm-version="14"
                data-instgrm-captioned
                style={{
                  background: '#FFF',
                  border: 0,
                  borderRadius: '12px',
                  boxShadow: 'none',
                  margin: 0,
                  maxWidth: '100%',
                  minWidth: 0,
                  padding: 0,
                  width: '100%',
                }}
              />
            </li>
          ))}
        </ul>
      </div>

      {/* ── Link list (accessibility + non-JS fallback) ── */}
      <ol className="mt-5 flex flex-wrap gap-2" aria-label="Photographs on Instagram">
        {photographyWall.map((p, i) => (
          <li key={p.id}>
            <a
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center rounded-full border border-current/25 px-4 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {frameName(i)} <span aria-hidden="true" className="ml-1.5">↗</span>
            </a>
          </li>
        ))}
        <li className="basis-full pt-2 text-sm opacity-60">
          Photos by {photographyMeta.handle} on Instagram.
        </li>
      </ol>
    </div>
  );
}
