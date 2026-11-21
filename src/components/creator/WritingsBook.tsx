import { useEffect, useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import InteractiveBook, { type BookPage } from '@/components/ui/interactive-book';
import { poetryMeta } from '../../content/novel';
import { poemFragments } from '../../content/poetry';

/* Real writing only. `poemFragments` is empty until Kirtiraj supplies a fragment, so the
   one page the notebook has today is his own line about it (verbatim from the content
   file) and the link to where the lines are published. Each fragment he adds becomes a page. */
function buildPages(): BookPage[] {
  const link = (
    <a href={poetryMeta.profileUrl} target="_blank" rel="noopener" className="font-sans text-sm underline underline-offset-4">
      Read the lines on Instagram, {poetryMeta.handle}
    </a>
  );
  if (poemFragments.length === 0) {
    return [{
      pageNumber: 1,
      content: <p className="text-center text-lg italic leading-relaxed">{poetryMeta.blurb}</p>,
      backContent: <div className="flex h-full flex-col items-center justify-center gap-4 text-center"><p className="text-sm">The lines that make it out live on Instagram.</p>{link}</div>,
    }];
  }
  return poemFragments.map((f, i) => ({
    pageNumber: i + 1,
    content: (
      <div className="space-y-2">
        {f.lines.map((l, j) => <p key={j}>{l}</p>)}
        {f.note && <p className="pt-3 font-sans text-xs opacity-60">{f.note}</p>}
      </div>
    ),
    backContent: <div className="flex h-full items-center justify-center">{link}</div>,
  }));
}

/** The notebook from f03c96b: 3D page turning for a mouse on a wide screen; for
 *  reduced motion, touch and narrow screens the same words on a ruled card. The text
 *  is always in the DOM for screen readers. */
export default function WritingsBook() {
  const [mode, setMode] = useState<'plain' | 'book'>('plain');
  const pages = buildPages();

  useEffect(() => {
    const ok =
      !window.matchMedia('(prefers-reduced-motion: reduce)').matches &&
      window.matchMedia('(hover: hover)').matches &&
      window.matchMedia('(min-width: 900px)').matches;
    setMode(ok ? 'book' : 'plain');
  }, []);

  const plain = (
    <div className="notebook-card">
      <p className="creator-hand">{poetryMeta.blurb}</p>
      {poemFragments.map((f) => (
        <div key={f.id} className="creator-hand mt-8">{f.lines.map((l, j) => <p key={j}>{l}</p>)}</div>
      ))}
      <a href={poetryMeta.profileUrl} target="_blank" rel="noopener" className="button button-disc mt-8">
        Read them on Instagram
        <span className="disc"><ArrowUpRight size={15} strokeWidth={1.75} aria-hidden="true" /></span>
        <span className="sr-only"> (opens in a new tab)</span>
      </a>
    </div>
  );

  if (mode === 'plain') return plain;

  return (
    <div>
      <div className="flex justify-center overflow-hidden pb-14 pt-4">
        <InteractiveBook
          coverImage="/creator/notebook-cover.webp"
          bookTitle="The notebook"
          bookAuthor={poetryMeta.handle}
          pages={pages}
          width={300}
          height={430}
          className="!w-full"
        />
      </div>
      {/* The same text, for screen readers, whatever state the book is in. */}
      <div className="sr-only">{plain}</div>
    </div>
  );
}
