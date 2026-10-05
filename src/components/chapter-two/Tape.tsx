import type { CSSProperties } from 'react';
import './Tape.css';

/** Washi tape holding a frame to the board. One hue per item across a section. */
export default function Tape({ hue, rotate = -8, flip = false }: { hue: string; rotate?: number; flip?: boolean }) {
  return (
    <span
      className={`washi${flip ? ' washi--right' : ''}`}
      style={{ '--hue': `var(--crayon-${hue})`, '--rot': `${rotate}deg` } as CSSProperties}
      aria-hidden="true"
    ></span>
  );
}
