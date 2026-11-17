import { useEffect, useRef } from 'react';
import type { Formation } from '../field/formations';

const LABEL: Record<Formation, string> = {
  graph: 'Illustration: a clustered graph of 23,756 points with one path through it marked in red.',
  network: 'Illustration: a three-layer network drawn as points, 2,788 inputs, 256 hidden units and 4 outputs, with one path marked in red.',
  track: 'Illustration: a railway track drawn as points with a red detection frame around an obstacle.',
};

/** A still of one of the home-page formations, drawn once when it scrolls near.
 *  The drawing code is loaded on demand so it stays out of the page's first load. */
export default function FormationFigure({ formation, className = '' }: { formation: Formation; className?: string }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    let alive = true;
    let paint: (() => void) | undefined;
    const near = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        near.disconnect();
        import('../field/still').then(({ drawStill }) => {
          if (!alive) return;
          paint = () => drawStill(el, formation);
          paint();
          sized.observe(el);
        });
      },
      { rootMargin: '300px' },
    );
    near.observe(el);
    const sized = new ResizeObserver(() => paint?.());
    const repaint = () => paint?.();
    const scheme = window.matchMedia('(prefers-color-scheme: dark)');
    scheme.addEventListener('change', repaint);
    window.addEventListener('themechange', repaint);
    return () => {
      alive = false;
      near.disconnect();
      sized.disconnect();
      scheme.removeEventListener('change', repaint);
      window.removeEventListener('themechange', repaint);
    };
  }, [formation]);

  return <canvas ref={canvas} role="img" aria-label={LABEL[formation]} className={`h-full w-full ${className}`} />;
}
