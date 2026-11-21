import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { tools } from '../../content/tools';

const TypingKeyboard = lazy(() =>
  import('@/components/ui/typing-keyboard').then((m) => ({ default: m.TypingKeyboard })),
);

/* The real tool names, in the order the logo grid lists them. Nothing invented. */
const TEXT = tools.map((t) => t.name).join(', ');

/* What the isometric keyboard actually paints inside its 800 x 600 stage, measured
   at scale 1: the screen rises 57px above the stage, the body ends 183px above its
   bottom. The box below is cut to that, plus a margin for the screen's glow, so the
   keyboard fills its space instead of floating in a box a third empty. */
const PAINT = { x: 148, y: -57, w: 502, h: 474 };
const MARGIN = 24;
const BOX = { w: PAINT.w + 2 * MARGIN, h: PAINT.h + 2 * MARGIN };

/** The isometric keyboard types out the tools (Home and About). It scales to its
 *  container's width, mounts near the viewport, and under reduced motion or touch
 *  shows the finished text on a still keyboard. */
export default function ToolsKeyboard({ className = 'max-w-[40rem]' }: { className?: string }) {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(true);
  const [scale, setScale] = useState(0.6);

  useEffect(() => {
    setStill(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches,
    );
    const el = host.current;
    if (!el) return;
    const fit = () => setScale(el.clientWidth / BOX.w);
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '150px' });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  /* CSS sizes the box from its width, so it has its final height in the prerendered
     HTML and never moves when the keyboard mounts. The keyboard's own 800 x 600 stage
     is larger than what it paints: it is clipped sideways (no page overflow) and takes
     no pointer events (it has none, and must not cover the content below). */
  return (
    <div ref={host} className={cn('relative w-full overflow-x-clip', className)} style={{ aspectRatio: `${BOX.w} / ${BOX.h}` }}>
      {near && (
        <Suspense fallback={null}>
          <TypingKeyboard
            autoTypeText={TEXT}
            still={still}
            scale={scale}
            accentColor="#b41d1c"
            secondaryAccent="#ff7a66"
            typingSpeed={[45, 110]}
            className="pointer-events-none absolute"
            style={{
              left: (MARGIN - PAINT.x) * scale,
              top: (MARGIN - PAINT.y) * scale,
              width: 800 * scale,
              height: 600 * scale,
            }}
          />
        </Suspense>
      )}
    </div>
  );
}
