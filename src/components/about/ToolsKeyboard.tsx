import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { tools } from '../../content/tools';

const TypingKeyboard = lazy(() =>
  import('@/components/ui/typing-keyboard').then((m) => ({ default: m.TypingKeyboard })),
);

/* The real tool names, in the order the logo grid lists them. Nothing invented. */
const TEXT = tools.map((t) => t.name).join(', ');

/** The isometric keyboard types out the tools. One use, on About. It scales to its
 *  container, mounts near the viewport, and under reduced motion or touch shows the
 *  finished text on a still keyboard. */
export default function ToolsKeyboard() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(true);
  const [scale, setScale] = useState(0.5);

  useEffect(() => {
    setStill(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches,
    );
    const el = host.current;
    if (!el) return;
    const fit = () => setScale(Math.min(0.9, (el.clientWidth / 800) * 1.0));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(el);
    return () => { ro.disconnect(); io.disconnect(); };
  }, []);

  /* 600px of keyboard at the current scale, so the box never moves when the keyboard mounts. */
  return (
    <div ref={host} className="relative w-full overflow-hidden" style={{ height: 600 * scale }}>
      {near && (
        <Suspense fallback={null}>
          <TypingKeyboard
            autoTypeText={TEXT}
            still={still}
            scale={scale}
            accentColor="#b41d1c"
            secondaryAccent="#ff7a66"
            typingSpeed={[45, 110]}
            className="absolute inset-0"
          />
        </Suspense>
      )}
    </div>
  );
}
