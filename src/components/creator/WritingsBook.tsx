import { useEffect, useState } from 'react';
import InteractiveBook, { type BookPage } from '@/components/ui/interactive-book';
import { poetryMeta } from '../../content/novel';
import { poemFragments } from '../../content/poetry';

/* Real writing only. `poemFragments` is empty by rule until Kirtiraj supplies a fragment, so the
   one page the notebook has today is his own description of it (verbatim from the content file)
   and the link to where the lines are actually published. Each fragment he adds becomes a page. */
function buildPages(): BookPage[] {
  const link = (
    <a href={poetryMeta.profileUrl} target="_blank" rel="noopener" className="font-sans text-sm underline underline-offset-4">
      Read the lines on Instagram ↗
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

/** The writings, as the book. 3D page-turning for a mouse on a wide screen; for reduced motion, touch and
 *  narrow screens the same words in a plain readable card. The text is always in the DOM for screen readers. */
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
    <div className="rounded-[1.5rem] border border-current/20 bg-white/50 p-7">
      <p className="text-2xl italic leading-relaxed">{poetryMeta.blurb}</p>
      <p className="mt-4 opacity-80">The lines that make it out live on Instagram.</p>
      {poemFragments.map((f) => (
        <div key={f.id} className="mt-6 space-y-1">{f.lines.map((l, j) => <p key={j}>{l}</p>)}</div>
      ))}
      <a href={poetryMeta.profileUrl} target="_blank" rel="noopener" className="mt-6 inline-flex min-h-11 items-center rounded-full bg-[var(--text)] px-5 text-[var(--bg)]">
        Read them on Instagram {poetryMeta.handle} ↗
      </a>
    </div>
  );

  if (mode === 'plain') return plain;

  return (
    <div>
      <div className="flex justify-center overflow-hidden py-6">
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
