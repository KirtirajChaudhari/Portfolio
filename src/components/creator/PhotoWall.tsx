import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { photographyWall, photographyMeta } from '../../content/novel';
import { hasHardwareWebGL, prefersStill } from '@/lib/gpu';

/* three lives in this chunk: fetched only on a real GPU, with a mouse, near the viewport. */
const ArtGallery = lazy(() =>
  import('@/components/block/art-gallery').then((m) => ({ default: m.ArtGallery })),
);

const frameName = (i: number) => `Frame ${String(i + 1).padStart(2, '0')}`;

/* No exported photo files exist yet (`src` is '' by rule), so each tile is the same intentional
   film-frame slot the rest of the site uses: a numbered frame, never a stand-in photograph. */
function filmFrameDataUrl(n: number, total: number): string {
  const c = document.createElement('canvas');
  c.width = c.height = 512;
  const g = c.getContext('2d');
  if (!g) return '';
  g.fillStyle = '#1a1210';
  g.fillRect(0, 0, 512, 512);
  g.fillStyle = '#0d0807';
  for (let x = 24; x < 512; x += 44) { g.fillRect(x, 18, 22, 14); g.fillRect(x, 480, 22, 14); }
  g.strokeStyle = 'rgba(247,236,231,0.28)';
  g.lineWidth = 3;
  g.strokeRect(36, 52, 440, 408);
  g.fillStyle = 'rgba(247,236,231,0.85)';
  g.font = '700 150px monospace';
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  g.fillText(String(n).padStart(2, '0'), 256, 244);
  g.font = '500 30px monospace';
  g.fillStyle = 'rgba(247,236,231,0.45)';
  g.fillText(`/ ${String(total).padStart(2, '0')}`, 256, 350);
  return c.toDataURL('image/png');
}

/** The photography wall. With a GPU and a mouse: ObsidianUI's draggable shader gallery (a lazy chunk).
 *  Otherwise a film strip. Either way every real Instagram post is a plain link underneath. */
export default function PhotoWall() {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const total = photographyWall.length;

  const items = useMemo(() => photographyWall.map((_, i) => ({ title: frameName(i) })), []);
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (prefersStill() || !hasHardwareWebGL()) return;
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setImages(photographyWall.map((_, i) => filmFrameDataUrl(i + 1, total)));
        setLive(true);
        io.disconnect();
      }
    }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, [total]);

  return (
    <div>
      {/* Fixed height before, during and after the WebGL chunk arrives. */}
      <div
        ref={host}
        className="relative h-[26rem] overflow-hidden rounded-[1.75rem] border border-white/10 bg-[#12090a] sm:h-[32rem]"
        role="group"
        aria-label={`Photography wall, ${total} frames. Drag to explore. Every frame is also linked below.`}
      >
        {live && images.length > 0
          ? (
            <Suspense fallback={null}>
              <ArtGallery images={images} items={items} className="!h-full" cellSize={0.75} />
            </Suspense>
          )
          : (
            <ul className="flex h-full snap-x snap-mandatory items-center gap-4 overflow-x-auto px-6" aria-hidden="true">
              {photographyWall.map((_, i) => (
                <li key={i} className="grid h-56 w-44 shrink-0 snap-center place-items-center rounded-md border border-white/20 bg-[#1a1210] sm:h-72 sm:w-56">
                  <span className="font-mono text-5xl font-bold text-[#f7ece7]/85">{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-mono text-sm text-[#f7ece7]/45">/ {String(total).padStart(2, '0')}</span>
                </li>
              ))}
            </ul>
          )}
      </div>

      <ol className="mt-6 flex flex-wrap gap-2" aria-label="Photographs on Instagram">
        {photographyWall.map((p, i) => (
          <li key={p.id}>
            <a
              href={p.href}
              target="_blank"
              rel="noopener"
              className="inline-flex min-h-11 items-center rounded-full border border-current/25 px-4 font-mono text-xs uppercase tracking-[0.12em] transition-colors hover:bg-black/5 focus-visible:outline-2 focus-visible:outline-offset-2"
            >
              {frameName(i)} <span aria-hidden="true" className="ml-1.5">↗</span>
            </a>
          </li>
        ))}
        <li className="basis-full pt-2 text-sm opacity-70">
          Photos live on Instagram ({photographyMeta.handle}); the exported files have not been added here yet.
        </li>
      </ol>
    </div>
  );
}
