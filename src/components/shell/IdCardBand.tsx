import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { siteMeta } from '../../content/shared';

/* The physics card is a separate chunk and is only fetched once this band is
   within ~400px of the viewport, so no other page (or the top of this one) pays for it. */
const HangingIdCard = lazy(() =>
  import('@/components/lightswind/hanging-id-card').then((m) => ({ default: m.HangingIdCard })),
);

/* One fixed height for the placeholder, the still card and the swinging card, so
   nothing shifts when the real thing arrives (CLS 0). */
const BAND_H = 'h-[34rem]';

function CardFace() {
  return (
    <div className="flex flex-col items-center gap-1 bg-white px-4 pb-5 pt-4 text-center">
      <img
        src="/avatars/professional-full.png"
        alt={`Illustrated portrait of ${siteMeta.fullName}`}
        width={176}
        height={176}
        className="h-44 w-44 rounded-xl bg-zinc-100 object-cover object-top"
        draggable={false}
      />
      <p className="mt-3 text-sm font-bold leading-tight text-zinc-900">{siteMeta.fullName}</p>
      <p className="text-[11px] font-medium text-zinc-500">{siteMeta.role}</p>
      <p className="text-[11px] text-zinc-500">{siteMeta.location.replace(/\s*\(.*\)$/, '')}</p>
    </div>
  );
}

/** Where the hanging ID card lives on About. Reduced motion and touch-only devices
 *  get the same card, hanging still: nothing is hidden, nothing swings. */
export default function IdCardBand() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(false);

  useEffect(() => {
    setStill(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches,
    );
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '400px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div
      ref={host}
      className={`relative ${BAND_H} overflow-hidden border-y border-dashed border-white/20`}
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(40% 70% at 50% 0%, rgb(255 255 255 / 0.07), transparent 70%)' }} />
      {near && (
        <Suspense fallback={null}>
          <HangingIdCard ropeLength={110} ropeColor="#18181b" accentColor="#b41d1c" interactive={!still} className="pt-0">
            <CardFace />
          </HangingIdCard>
        </Suspense>
      )}
    </div>
  );
}
