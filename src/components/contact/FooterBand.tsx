import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { prefersStill } from '@/lib/gpu';

const AnimatedFooter = lazy(() =>
  import('@/components/ui/animated-footer').then((m) => ({ default: m.AnimatedFooter })),
);

/** Resolves a token to a colour string a 2D canvas accepts (tokens are OKLCH inside light-dark()). */
function tokenColor(probe: HTMLElement, token: string, alpha = 1) {
  probe.style.color = `var(${token})`;
  const c = document.createElement('canvas');
  c.width = c.height = 1;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  ctx.fillStyle = getComputedStyle(probe).color;
  ctx.fillRect(0, 0, 1, 1);
  const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
  return `rgb(${r} ${g} ${b} / ${alpha})`;
}

/** The closing band from f03c96b: the two avatars (professional, creative) drawn as
 *  ASCII, the name set large under them. Same fixed height before and after the
 *  canvas code arrives; colours follow the theme. */
export default function FooterBand() {
  const host = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [still, setStill] = useState(true);
  const [colors, setColors] = useState<{ char: string; hover: string; hoverChar: string } | null>(null);

  useEffect(() => {
    setStill(prefersStill());
    const el = host.current;
    if (!el) return;
    const read = () => setColors({
      char: tokenColor(el, '--signal', 0.42),
      hover: tokenColor(el, '--signal'),
      hoverChar: tokenColor(el, '--paper'),
    });
    read();
    el.style.color = '';
    window.addEventListener('themechange', read);
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setNear(true); io.disconnect(); } }, { rootMargin: '300px' });
    io.observe(el);
    return () => { io.disconnect(); window.removeEventListener('themechange', read); };
  }, []);

  return (
    <div ref={host} aria-hidden="true" className="relative h-[20rem] w-full overflow-hidden sm:h-[30rem]">
      {near && colors && (
        <Suspense fallback={null}>
          <AnimatedFooter
            className="absolute inset-0"
            headingLines={['Kirtiraj']}
            leftImage="/footer/hand-left.webp"
            rightImage="/footer/hand-right.webp"
            background="transparent"
            textColor="var(--fg)"
            charColor={colors.char}
            hoverColor={colors.hover}
            hoverCharColor={colors.hoverChar}
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
