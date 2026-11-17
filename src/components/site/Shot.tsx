import type { ProjectCase } from '../../content/projects';

/** A real project screenshot at two widths. `name` ties the image on the Work
 *  page to the one on its case study so the route change can carry it across. */
export default function Shot({ shot, name, sizes, eager = false }: { shot: NonNullable<ProjectCase['shot']>; name: string; sizes: string; eager?: boolean }) {
  return (
    <img
      src={`${shot.base}-1600.webp`}
      srcSet={`${shot.base}-800.webp 800w, ${shot.base}-1600.webp 1600w`}
      sizes={sizes}
      width={shot.width}
      height={shot.height}
      alt={shot.alt}
      loading={eager ? 'eager' : 'lazy'}
      fetchPriority={eager ? 'high' : undefined}
      decoding="async"
      style={{ viewTransitionName: `shot-${name}` }}
    />
  );
}
