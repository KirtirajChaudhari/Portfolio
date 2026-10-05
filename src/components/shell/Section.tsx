import type { ReactNode } from 'react';
import Reveal from './Reveal';

/** Editorial split: a quiet heading on the left that stays put while the
 *  content on the right scrolls past it. Collapses to a single column. */
export default function Section({
  id, title, note, children, dashed = false,
}: { id?: string; title: string; note?: string; children: ReactNode; dashed?: boolean }) {
  return (
    <section
      id={id}
      className={`grid scroll-mt-28 gap-8 border-t py-14 sm:py-20 lg:grid-cols-[minmax(0,230px)_minmax(0,1fr)] lg:gap-16 ${dashed ? 'border-dashed border-white/20' : 'border-white/10'}`}
    >
      <div>
        <div className="lg:sticky lg:top-28">
          <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h2>
          {note && <p className="mt-3 max-w-[26ch] text-sm leading-relaxed text-[#f7ece7]/60">{note}</p>}
        </div>
      </div>
      <Reveal>{children}</Reveal>
    </section>
  );
}
