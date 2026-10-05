import type { CSSProperties } from 'react';
import { photographyWall as photos, photographyMeta as photoMeta } from '../../content/novel';
import SectionHeader from './SectionHeader';
import FilmFrame from './FilmFrame';
import Pinned from './Pinned';
import './PhotographyWall.css';

/* One hue per frame across the wall. */
const HUES = ['blue', 'sun', 'pink', 'leaf', 'peach', 'violet'];

/* Per-card vertical offset: breaks the column baselines so the wall reads as
   pinned by hand rather than laid out on a grid. */
const OFFSETS = ['0', '2.5rem', '1rem', '3.5rem', '1.5rem', '0.5rem'];

/* overflow-x: clip, not hidden: hidden would make this a scroll container and
   break sticky measurements elsewhere on the page. */
export default function PhotographyWall({ vis }: { vis?: boolean }) {
  return (
    <section id="photos" className="wall" aria-label="Photography">
      <div className="container">
        <SectionHeader
          note="chasing light…"
          title="Photography"
          highlight="Photography"
          hue="blue"
          handle={photoMeta.handle}
          handleHref={photoMeta.profileUrl}
          vis={vis}
        />
      </div>

      {/* CSS columns rather than absolute coordinates: the frames keep their
          overlap and varied depth without a fixed scatter that would tear apart
          if any card's height changed. Single column below md. */}
      <div className={`container wall__grid pinned-group${vis ? ' is-in' : ''}`}>
        {photos.map((photo, i) => (
          <div
            key={photo.id}
            className="wall__cell"
            style={{
              marginTop: OFFSETS[i % OFFSETS.length],
              marginLeft: i % 3 === 1 ? '-0.75rem' : undefined,
            }}
          >
            <Pinned tilt={photo.rotate} index={i} innerClass="polaroid">
              <span
                className={`tape ${i % 2 === 0 ? 'polaroid__tape--l' : 'polaroid__tape--r'}`}
                style={{
                  '--tape-hue': `var(--crayon-${HUES[i % HUES.length]})`,
                  rotate: `${i % 2 === 0 ? -8 : 9}deg`,
                } as CSSProperties}
              ></span>

              <a href={photo.href} target="_blank" rel="noopener" className="polaroid__frame">
                {photo.src
                  ? <img src={photo.src} alt={photo.caption} loading="lazy" />
                  : <FilmFrame index={i + 1} total={photos.length} />}
                <span className="polaroid__cta hand">View on Instagram ↗</span>
              </a>

              {/* Contact-sheet index: the only caption the frame carries. */}
              <span className="polaroid__idx hand">{String(i + 1).padStart(2, '0')}</span>
            </Pinned>
          </div>
        ))}
      </div>

      <div className="container wall__out">
        <a href={photoMeta.profileUrl} target="_blank" rel="noopener" className="wall__link hand">
          more frames on Instagram ↗
        </a>
      </div>
    </section>
  );
}
