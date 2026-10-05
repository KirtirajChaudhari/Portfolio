import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { photographyWall as photos, photographyMeta as photoMeta } from '../../content/novel';
import SectionHeader from './SectionHeader';
import FilmFrame from './FilmFrame';
import Pinned from './Pinned';
import './PhotographyWall.css';

declare global {
  interface Window { instgrm?: { Embeds: { process: () => void } } }
}

/* One hue per frame across the wall. */
const HUES = ['blue', 'sun', 'pink', 'leaf', 'peach', 'violet'];

/* Per-card vertical offset: breaks the column baselines so the wall reads as
   pinned by hand rather than laid out on a grid. */
const OFFSETS = ['0', '2.5rem', '1rem', '3.5rem', '1.5rem', '0.5rem'];

/* Instagram's embed never renders narrower than this. */
const EMBED_MIN = 326;

/* Official embed script, loaded once and only when the wall nears the viewport. */
let embedScript: Promise<void> | undefined;
function loadEmbedScript() {
  embedScript ??= new Promise<void>((resolve, reject) => {
    const s = document.createElement('script');
    s.src = 'https://www.instagram.com/embed.js';
    s.async = true;
    s.onload = () => resolve();
    s.onerror = () => { embedScript = undefined; reject(new Error('instagram embed.js failed to load')); };
    document.body.appendChild(s);
  });
  return embedScript;
}

/* The blockquote is built by hand so React never owns the subtree that embed.js rewrites. */
function InstagramEmbed({ href, label }: { href: string; label: string }) {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let live = true;
    const quote = document.createElement('blockquote');
    quote.className = 'instagram-media';
    quote.setAttribute('data-instgrm-permalink', href);
    quote.setAttribute('data-instgrm-version', '14');
    const link = document.createElement('a');
    link.href = href;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.textContent = label;
    quote.append(link);
    el.append(quote);
    loadEmbedScript().then(() => { if (live) window.instgrm?.Embeds.process(); }, () => {});
    return () => { live = false; el.replaceChildren(); };
  }, [href, label]);
  return <div ref={host} className="polaroid__embed" />;
}

export default function PhotographyWall({ vis }: { vis?: boolean }) {
  const grid = useRef<HTMLDivElement>(null);
  const [armed, setArmed] = useState(false);

  /* Mount the embeds just before the wall scrolls into view. */
  useEffect(() => {
    const el = grid.current;
    if (!el || armed) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) setArmed(true); }, { rootMargin: '600px 0px' });
    io.observe(el);
    return () => io.disconnect();
  }, [armed]);

  /* A phone's polaroid is narrower than the embed's minimum: shrink the embed to fit instead of clipping it. */
  useEffect(() => {
    const el = grid.current;
    if (!el) return;
    const fit = () => {
      const frame = el.querySelector<HTMLElement>('.polaroid__frame');
      if (frame) el.style.setProperty('--ig-zoom', String(Math.min(1, frame.clientWidth / EMBED_MIN)));
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section id="photos" className="wall" aria-label="Photography">
      <div className="container">
        <SectionHeader
          note="chasing light…"
          title="Photography"
          highlight="Photography"
          hue="blue"
          handle={photoMeta.handle}
          handleHref={photoMeta.profileUrl}
          vis={vis}
        />
      </div>

      {/* CSS columns rather than absolute coordinates: an embed's height is only known once Instagram
          renders it, and columns let every frame find its own height. Single column below md. */}
      <div ref={grid} className={`container wall__grid pinned-group${vis ? ' is-in' : ''}`}>
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="wall__cell"
            style={{
              marginTop: OFFSETS[i % OFFSETS.length],
              marginLeft: i % 3 === 1 ? '-0.75rem' : undefined,
            }}
          >
            <Pinned tilt={photo.rotate} index={i} innerClass="polaroid">
              <span
                className={`tape ${i % 2 === 0 ? 'polaroid__tape--l' : 'polaroid__tape--r'}`}
                style={{
                  '--tape-hue': `var(--crayon-${HUES[i % HUES.length]})`,
                  rotate: `${i % 2 === 0 ? -8 : 9}deg`,
                } as CSSProperties}
              ></span>

              {/* The film frame sits behind the embed: it is what shows while Instagram loads, or if it never does. */}
              <div className="polaroid__frame">
                <FilmFrame index={i + 1} total={photos.length} />
                {armed && <InstagramEmbed href={photo.href} label={`Frame ${String(i + 1).padStart(2, '0')} on Instagram`} />}
              </div>

              {/* Contact-sheet index: the only caption the frame carries. */}
              <span className="polaroid__idx hand">{String(i + 1).padStart(2, '0')}</span>
            </Pinned>
          </div>
        ))}
      </div>

      <div className="container wall__out">
        <ol className="wall__list" aria-label="Photographs on Instagram">
          {photos.map((photo, i) => (
            <li key={photo.id}>
              <a href={photo.href} target="_blank" rel="noopener noreferrer" className="wall__chip">
                Frame {String(i + 1).padStart(2, '0')} <span aria-hidden="true">↗</span>
              </a>
            </li>
          ))}
        </ol>
        <a href={photoMeta.profileUrl} target="_blank" rel="noopener" className="wall__link hand">
          more frames on Instagram ↗
        </a>
      </div>
    </section>
  );
}
