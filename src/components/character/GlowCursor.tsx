import { useEffect, useRef } from 'react';

const DOT = 10;
const RING = 38;
const RING_LERP = 0.2;
const SCALE_LERP = 0.18;
const PULL = 0.28;        /* how far the ring leans toward an interactive element's centre */
const HOVER_SCALE = 1.9;
const INTERACTIVE = 'a, button, [role="button"], input, textarea, select';

/** Glowing dot + trailing aura ring. Fine pointers only; the native cursor is
 *  hidden while this runs (see `html.glow-cursor` in index.css). One rAF loop,
 *  transform-only writes, and it goes idle once the ring catches the dot. */
export default function GlowCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    document.documentElement.classList.add('glow-cursor');

    /* Handlers write `t`; the loop is the only code that touches the DOM. */
    const t = { x: -100, y: -100, rx: -100, ry: -100, s: 1, seen: false };
    let rx = -100, ry = -100, rs = 1;
    let raf = 0;

    const frame = () => {
      raf = 0;
      if (reduced) { rx = t.rx; ry = t.ry; rs = t.s; }
      else {
        rx += (t.rx - rx) * RING_LERP;
        ry += (t.ry - ry) * RING_LERP;
        rs += (t.s - rs) * SCALE_LERP;
      }
      dot.style.transform = `translate3d(${t.x - DOT / 2}px,${t.y - DOT / 2}px,0)`;
      ring.style.transform = `translate3d(${rx - RING / 2}px,${ry - RING / 2}px,0) scale(${rs.toFixed(3)})`;

      const settled = Math.abs(t.rx - rx) < 0.1 && Math.abs(t.ry - ry) < 0.1 && Math.abs(t.s - rs) < 0.002;
      if (!settled) raf = requestAnimationFrame(frame);
    };
    const kick = () => { if (!raf) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      if (!t.seen) {
        t.seen = true;
        rx = e.clientX; ry = e.clientY;
        dot.style.opacity = '1'; ring.style.opacity = '1';
      }
      t.x = e.clientX; t.y = e.clientY;
      const el = (e.target as Element | null)?.closest?.(INTERACTIVE);
      if (el) {
        /* Magnetic: lean toward the element, grow around it. */
        const r = el.getBoundingClientRect();
        t.rx = e.clientX + (r.left + r.width / 2 - e.clientX) * PULL;
        t.ry = e.clientY + (r.top + r.height / 2 - e.clientY) * PULL;
        t.s = HOVER_SCALE;
      } else {
        t.rx = e.clientX; t.ry = e.clientY; t.s = 1;
      }
      kick();
    };
    const onLeave = () => { dot.style.opacity = '0'; ring.style.opacity = '0'; t.seen = false; };

    window.addEventListener('pointermove', onMove, { passive: true });
    document.documentElement.addEventListener('pointerleave', onLeave);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', onMove);
      document.documentElement.removeEventListener('pointerleave', onLeave);
      document.documentElement.classList.remove('glow-cursor');
    };
  }, []);

  const base = 'mix-blend-difference pointer-events-none fixed left-0 top-0 rounded-full transition-opacity duration-300';
  return (
    <div aria-hidden="true">
      <div
        ref={ringRef}
        className={`${base} border border-white/60`}
        style={{ width: RING, height: RING, zIndex: 'var(--z-modal)', opacity: 0, boxShadow: '0 0 24px rgb(255 255 255 / 0.25)' }}
      />
      <div
        ref={dotRef}
        className={`${base} bg-white`}
        style={{ width: DOT, height: DOT, zIndex: 'var(--z-modal)', opacity: 0, boxShadow: '0 0 14px 3px rgb(255 255 255 / 0.85)' }}
      />
    </div>
  );
}
