import { Fragment, type CSSProperties } from 'react';
import './SectionHeader.css';

interface Props {
  note?: string;
  title: string;
  /** One word inside `title` to sit the highlighter stroke behind. */
  highlight?: string;
  hue: string;
  handle?: string;
  handleHref?: string;
  align?: 'left' | 'center' | 'right';
  vis?: boolean;
}

/** Chapter-two section entry: handwritten lead-in, ink heading with a
 *  highlighter stroke behind one word, then a drawn underline in the lead hue. */
export default function SectionHeader({
  note, title, highlight, hue, handle, handleHref, align = 'left', vis = true,
}: Props) {
  const words = title.split(' ');
  const hueVar = `var(--crayon-${hue})`;

  return (
    <header className={`sh sh--${align}${vis ? ' is-in' : ''}`}>
      {note && <span className="sh__note hand">{note}</span>}

      <h2 className="sh__title">
        {words.map((word, i) => (
          <Fragment key={`${word}-${i}`}>
            {word === highlight
              ? <span className="sh__mark" style={{ '--hue': hueVar } as CSSProperties}>{word}</span>
              : word}
            {i < words.length - 1 ? ' ' : ''}
          </Fragment>
        ))}
      </h2>

      <svg className="sh__rule" viewBox="0 0 220 12" fill="none" aria-hidden="true">
        <path d="M2 8C38 3 74 2 110 4.5C146 7 182 9 218 5" stroke={hueVar} strokeWidth="3" strokeLinecap="round" />
      </svg>

      {handle && handleHref && (
        <a href={handleHref} target="_blank" rel="noopener" className="sh__handle">
          {handle} ↗
        </a>
      )}
    </header>
  );
}
