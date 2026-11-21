import { useEffect, useRef, useState, type ReactNode } from 'react';
import { ArrowUpRight, RotateCw } from 'lucide-react';

/** A Spotify embed that only loads near the viewport, can be reloaded, and says so
 *  when it has not loaded in time (blocked networks, privacy extensions, Spotify
 *  outages), with the direct link right there. The iframe is remounted on reload. */
export default function SpotifyPlayer({ src, title, height, href, label, header }: {
  src: string; title: string; height: number; href: string; label: string;
  /** Replaces the label above the player (the reload control stays beside it). */
  header?: ReactNode;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState<'idle' | 'loading' | 'ready' | 'stalled'>('idle');

  useEffect(() => {
    const el = host.current!;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setNear(true); io.disconnect(); }
    }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!near) return;
    setState('loading');
    const timer = setTimeout(() => setState((s) => (s === 'ready' ? s : 'stalled')), 12000);
    return () => clearTimeout(timer);
  }, [near, attempt]);

  const reload = () => setAttempt((n) => n + 1);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-3">
        {header ?? <p className="t-kicker !text-[0.6875rem]">{label}</p>}
        <button type="button" onClick={reload} className="nav-icon !h-9 !w-9 text-fg-2" aria-label={`Reload the ${label} player`} title="Reload player">
          <RotateCw size={15} strokeWidth={1.75} aria-hidden="true" />
        </button>
      </div>
      <div ref={host} className="player" style={{ height }}>
        {near && (
          <iframe
            key={attempt}
            src={src}
            title={title}
            height={height}
            loading="lazy"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            onLoad={() => setState('ready')}
            style={{ opacity: state === 'ready' ? 1 : 0, transition: 'opacity 400ms' }}
          />
        )}
        {state !== 'ready' && (
          <div className="player-skeleton" role="status">
            {state === 'stalled' ? (
              <>
                <p className="text-sm">The Spotify player didn't load here.</p>
                <div className="flex flex-wrap justify-center gap-2">
                  <button type="button" onClick={reload} className="button button-line !min-h-10 !text-sm">
                    <RotateCw size={14} strokeWidth={1.75} aria-hidden="true" /> Try again
                  </button>
                  <a href={href} target="_blank" rel="noopener noreferrer" className="button !min-h-10 !text-sm">
                    Open in Spotify <ArrowUpRight size={14} strokeWidth={1.75} aria-hidden="true" />
                    <span className="sr-only"> (opens in a new tab)</span>
                  </a>
                </div>
              </>
            ) : (
              <p className="t-data">Loading the {label.toLowerCase()} from Spotify</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
