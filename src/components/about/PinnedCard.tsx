import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import type { HangingIdCardHandle } from '@/components/lightswind/hanging-id-card';
import { siteMeta } from '../../content/shared';

/* The physics card is its own chunk and is only fetched once this block is near the viewport. */
const HangingIdCard = lazy(() =>
  import('@/components/lightswind/hanging-id-card').then((m) => ({ default: m.HangingIdCard })),
);

function CardFace() {
  return (
    <div className="flex flex-col items-center gap-1 bg-white px-4 pb-5 pt-4 text-center">
      <img
        src="/avatars/id-photo.webp"
        srcSet="/avatars/id-photo-320.webp 320w, /avatars/id-photo.webp 640w"
        sizes="176px"
        width={176}
        height={176}
        alt={`Portrait photo of ${siteMeta.fullName}, smiling, in glasses and a grey suit, against a red background`}
        className="h-44 w-44 rounded-xl bg-zinc-100 object-cover"
        draggable={false}
      />
      <p className="mt-3 text-sm font-bold leading-tight text-zinc-900">{siteMeta.fullName}</p>
      <p className="text-[11px] font-medium text-zinc-500">{siteMeta.role}</p>
      <p className="text-[11px] text-zinc-500">{siteMeta.location.replace(/\s*\(.*\)$/, '')}</p>
    </div>
  );
}

/** The ID card, hung from the top of whatever contains it. On desktop with a mouse it swings with
 *  scroll speed as well as drag; with reduced motion or touch it hangs still. Same card either way. */
export default function PinnedCard({ className = '' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const card = useRef<HangingIdCardHandle>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    const calm =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches;
    setStill(calm);
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  /* Scroll speed becomes angular velocity. Passive, no loop of its own: the card's own rAF does the swinging. */
  useEffect(() => {
    if (still) return;
    let lastY = window.scrollY;
    let lastT = performance.now();
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(8, now - lastT);
      const v = ((window.scrollY - lastY) / dt) * 1000;      // px/s
      lastY = window.scrollY;
      lastT = now;
      if (Math.abs(v) > 120) card.current?.nudge(Math.max(-1.6, Math.min(1.6, v * 0.00045)));
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [still]);

  return (
    <div ref={host} className={`relative h-[31rem] overflow-hidden ${className}`}>
      {near && (
        <Suspense fallback={null}>
          <HangingIdCard ref={card} ropeLength={90} ropeColor="#18181b" accentColor="#b41d1c" interactive={!still}>
            <CardFace />
          </HangingIdCard>
        </Suspense>
      )}
    </div>
  );
}
