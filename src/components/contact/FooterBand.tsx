import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { prefersStill } from '@/lib/gpu';

const AnimatedFooter = lazy(() =>
  import('@/components/ui/animated-footer').then((m) => ({ default: m.AnimatedFooter })),
);

/** The closing band: the two avatars (professional, creative) drawn as ASCII, the name set large
 *  under them. Same fixed height before and after the canvas code arrives. */
export default function FooterBand() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(true);

  useEffect(() => {
    setStill(prefersStill());
    const el = host.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={host} className="relative h-[24rem] w-full overflow-hidden border-t border-dashed border-white/20 sm:h-[30rem]">
      {near && (
        <Suspense fallback={null}>
          <AnimatedFooter
            className="absolute inset-0"
            headingLines={['Kirtiraj']}
            leftImage="/footer/hand-left.webp"
            rightImage="/footer/hand-right.webp"
            background="#12090a"
            textColor="#f7ece7"
            charColor="#6e2a1c"
            hoverColor="#ff7a66"
            hoverCharColor="#12090a"
            columns={64}
            cellSize={14}
            fontSize={13}
            parallaxStrength={14}
            still={still}
            revealOnScroll={!still}
          />
        </Suspense>
      )}
    </div>
  );
}
