import { useEffect, useState } from 'react';
import { HangingIdCard } from '@/components/ui/hanging-id-card';
import { siteMeta } from '../../content/shared';

/* The card is rendered into the prerendered HTML, photo included, so on a phone (where
   it is the first thing on About) the photo starts loading with the page instead of
   after a lazy chunk. The physics only attach after hydration. */

function CardFace({ priority }: { priority: boolean }) {
  return (
    <div className="flex flex-col items-center gap-1 bg-white px-4 pb-5 pt-4 text-center">
      <img
        src="/avatars/id-photo.webp"
        srcSet="/avatars/id-photo-320.webp 320w, /avatars/id-photo.webp 640w"
        sizes="176px"
        width={176}
        height={176}
        alt={`Portrait photo of ${siteMeta.fullName}, smiling, in glasses and a grey suit, against a red background`}
        className="h-44 w-44 rounded-xl bg-zinc-100 object-cover"
        draggable={false}
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
      />
      <p className="mt-3 text-sm font-bold leading-tight text-zinc-900">{siteMeta.fullName}</p>
      <p className="text-[11px] font-medium text-zinc-500">{siteMeta.role}</p>
      <p className="text-[11px] text-zinc-500">{siteMeta.location.replace(/\s*\(.*\)$/, '')}</p>
    </div>
  );
}

/** The ID card, hung from the top of whatever contains it. It only moves when dragged or clicked;
 *  with reduced motion or touch it hangs still. Same card either way. */
export default function PinnedCard({ className = '', priority = false }: { className?: string; priority?: boolean }) {
  const [still, setStill] = useState(true);

  useEffect(() => {
    setStill(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      window.matchMedia('(hover: none)').matches,
    );
  }, []);

  return (
    <div className={`relative h-[31rem] overflow-hidden ${className}`}>
      <HangingIdCard ropeLength={90} ropeColor="#7a1414" accentColor="#b41d1c" interactive={!still}>
        <CardFace priority={priority} />
      </HangingIdCard>
    </div>
  );
}
