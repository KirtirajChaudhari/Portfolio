import { lazy, Suspense, useEffect, useRef, useState, type ReactNode } from 'react';
import { hasHardwareWebGL, prefersStill } from '@/lib/gpu';

/* r3f + three live in this chunk and are only fetched on a real GPU, with a mouse, near the viewport. */
const LiquidOcean = lazy(() =>
  import('@/components/ui/liquid-ocean').then((m) => ({ default: m.LiquidOcean })),
);

/** A framed window onto the liquid-ocean scene, with the page's hero copy laid over it. The static
 *  gradient under it is the whole backdrop without a GPU, under reduced motion, and on touch. */
export default function OceanHero({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    if (prefersStill() || !hasHardwareWebGL()) return;
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { rootMargin: '200px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="relative isolate overflow-hidden rounded-[2rem] border border-white/15 bg-[#12090a]">
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{ background: 'radial-gradient(70% 90% at 85% 10%, rgb(180 29 28 / 0.6), transparent 70%), radial-gradient(60% 70% at 0% 100%, rgb(255 90 60 / 0.2), transparent 70%)' }}
      />
      {live && (
        <Suspense fallback={null}>
          <div aria-hidden="true" className="absolute inset-0 opacity-80">
            <LiquidOcean
              className="absolute inset-0 min-h-0"
              backgroundColor={0x12090a}
              gridColor={0x4a1a1c}
              accentColor={0xb41d1c}
              boatCount={5}
              oceanOpacity={0.8}
            />
          </div>
        </Suspense>
      )}
      {/* Keeps the copy on the dark side of the scene. */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#12090a]/90 via-[#12090a]/55 to-transparent" />
      <div className="relative z-10">{children}</div>
    </div>
  );
}
