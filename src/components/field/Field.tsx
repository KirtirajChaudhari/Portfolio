import { useEffect, useRef, type RefObject } from 'react';
import { hasHardwareWebGL } from '../../lib/gpu';
import { mountField } from './engine';

/** The canvas for the home-page figure. Purely illustrative: everything it shows is
 *  also written in the panels beside it, so it is hidden from assistive technology. */
export default function Field({ stage }: { stage: RefObject<HTMLElement | null> }) {
  const canvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvas.current || !stage.current) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const webgl = hasHardwareWebGL();
    const field = mountField(canvas.current, stage.current, {
      webgl,
      live: webgl && !reduce,
      pointer: window.matchMedia('(hover: hover) and (pointer: fine)').matches,
    });
    return () => field.destroy();
  }, [stage]);

  return <canvas ref={canvas} aria-hidden="true" />;
}
