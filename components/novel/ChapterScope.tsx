"use client";

import { useEffect } from "react";

/**
 * Mirrors the page's chapter scope onto <html> so root-level chrome that
 * can't inherit from <main> — body background on overscroll, the scrollbar
 * track, ::selection — resolves the chapter's tokens instead of :root's.
 */
export function ChapterScope({ chapter }: { chapter: "two" }) {
  useEffect(() => {
    const root = document.documentElement;
    const previous = root.dataset.chapter;
    root.dataset.chapter = chapter;
    return () => {
      if (previous === undefined) delete root.dataset.chapter;
      else root.dataset.chapter = previous;
    };
  }, [chapter]);

  return null;
}
