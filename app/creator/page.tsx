import type { Metadata } from "next";
import Link from "next/link";
import { NovelShell } from "@/components/novel/NovelShell";
import { ChapterScope } from "@/components/novel/ChapterScope";
import { CreatorHero } from "@/components/novel/chapter-two/CreatorHero";
import { CreatorIntro } from "@/components/novel/chapter-two/CreatorIntro";
import { PhotographyWall } from "@/components/novel/chapter-two/PhotographyWall";
import { PoetryWall } from "@/components/novel/chapter-two/PoetryWall";
import { MusicSection } from "@/components/novel/chapter-two/MusicSection";
import { siteMeta } from "@/content/shared";

export const metadata: Metadata = {
  title: "The Creator — Kirtiraj Chaudhari",
  description:
    "Chapter Two: tabla, photography, and poetry — the part of Kirtiraj Chaudhari that doesn't show up on a resume.",
};

/*
 * Chapter Two — vibrant paper-white creative portfolio (DESIGN.md).
 * Same type and motion grammar as Chapter One; deliberately different
 * color world. ChapterScope lifts the token scope to <html> for the
 * scrollbar, selection, and overscroll background.
 */
export default function CreatorPage() {
  return (
    <NovelShell>
      <ChapterScope chapter="two" />
      <main data-chapter="two" className="min-h-dvh bg-bg text-text">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
          <Link
            href="/"
            className="text-xs tracking-[0.3em] text-text-muted transition-colors hover:text-text"
          >
            ← CHAPTER ONE
          </Link>
          <span className="type-hand text-xl text-text-muted">the notebook</span>
        </div>

        <CreatorHero />
        <CreatorIntro />
        <PhotographyWall />
        <PoetryWall />
        <MusicSection />

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
            <Link
              href="/"
              className="type-serif text-lg italic text-text transition-colors hover:text-text-muted"
            >
              ← Back to The Engineer
            </Link>
            <span className="type-hand text-lg text-text-muted">
              © 2026 {siteMeta.fullName} — pages from the notebook
            </span>
          </div>
        </footer>
      </main>
    </NovelShell>
  );
}
