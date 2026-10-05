import { useMemo } from 'react';
import { photographyWall as photos, photographyMeta as photoMeta } from '../../content/novel';
import SectionHeader from './SectionHeader';
import { ArtGallery } from '../block/art-gallery';
import './PhotographyWall.css';

export default function PhotographyWall({ vis }: { vis?: boolean }) {
  const items = useMemo(
    () =>
      photos.map((_, i) => ({
        title: `Frame ${String(i + 1).padStart(2, '0')}`,
        year: 2024,
      })),
    [],
  );

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
                  Frame {String(i + 1).padStart(2, '0')} <span aria-hidden="true">↗</span>
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
