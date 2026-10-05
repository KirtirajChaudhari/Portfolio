import { useMemo } from 'react';
import { photographyWall as photos, photographyMeta as photoMeta } from '../../content/novel';
import SectionHeader from './SectionHeader';
import { ArtGallery } from '../block/art-gallery';
import './PhotographyWall.css';

/* Optimised copies of public/creator/photos, named `<yyyymmdd|undated>-NN.webp` (any order). */
const files = import.meta.glob<string>('../../assets/gallery/*.webp', { eager: true, query: '?url', import: 'default' });
const sources = Object.entries(files).map(([path, url]) => ({ url, year: path.match(/\/(20\d{2})\d{4}-/)?.[1] ?? '' }));

/** Fisher–Yates; a fresh order on every mount. */
function shuffled<T>(list: T[]): T[] {
  const a = [...list];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function PhotographyWall({ vis }: { vis?: boolean }) {
  const { images, items } = useMemo(() => {
    const order = shuffled(sources);
    return {
      images: order.map((o) => o.url),
      items: order.map((o, i) => ({ title: `Frame ${String(i + 1).padStart(2, '0')}`, year: o.year })),
    };
  }, []);

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

        <div className="relative mt-8 h-[28rem] sm:h-[34rem] lg:h-[42rem] w-full overflow-hidden rounded-2xl border border-white/10 bg-[#12090a] shadow-2xl">
          <ArtGallery
            images={images}
            items={items}
            className="!h-full !w-full"
            cellSize={0.75}
            zoomLevel={1.25}
            showHint={true}
          />
        </div>

        <div className="wall__out mt-8">
          <ol className="wall__list" aria-label="Photographs on Instagram">
            {photos.map((photo, i) => (
              <li key={photo.id}>
                <a href={photo.href} target="_blank" rel="noopener noreferrer" className="wall__chip">
                  Post {String(i + 1).padStart(2, '0')} <span aria-hidden="true">↗</span>
                </a>
              </li>
            ))}
          </ol>
          <a href={photoMeta.profileUrl} target="_blank" rel="noopener" className="wall__link hand">
            more frames on Instagram ↗
          </a>
        </div>
      </div>
    </section>
  );
}
