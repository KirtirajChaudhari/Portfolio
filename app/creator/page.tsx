import type { Metadata } from "next";
import Link from "next/link";
import { NovelShell } from "@/components/novel/NovelShell";
import { ChapterTitle } from "@/components/novel/ChapterTitle";
import { CreatorIntro } from "@/components/novel/chapter-two/CreatorIntro";
import { PhotographyWall } from "@/components/novel/chapter-two/PhotographyWall";
import { PoetryWall } from "@/components/novel/chapter-two/PoetryWall";
import { MusicSection } from "@/components/novel/chapter-two/MusicSection";
import { chapterTwoMeta } from "@/content/novel";
import { siteMeta } from "@/content/shared";

export const metadata: Metadata = {
  title: "The Creator — Kirtiraj Chaudhari",
  description:
    "Chapter Two: tabla, photography, and poetry — the part of Kirtiraj Chaudhari that doesn't show up on a resume.",
};

/*
 * Chapter Two lives on its own route with its own scroll context (spec v2 §6),
 * reskinned as a wrinkled-diary / Polaroid moodboard (§7). Same motion
 * timing and easing as Chapter One — only the material changes.
 */
export default function CreatorPage() {
  return (
    <NovelShell>
      <main data-mode="artistic" className="creator-paper min-h-screen">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 pt-8">
          <Link
            href="/"
            className="text-xs tracking-[0.3em] text-text-muted transition-colors hover:text-accent"
          >
            ← CHAPTER ONE
          </Link>
          <span className="type-hand text-xl text-text-muted">the scrapbook</span>
        </div>

        <ChapterTitle
          kicker={chapterTwoMeta.kicker}
          title={chapterTwoMeta.title}
          epigraph={chapterTwoMeta.epigraph}
          serif
        />
        <CreatorIntro />
        <div className="torn-edge" />
        <PhotographyWall />
        <div className="torn-edge" />
        <PoetryWall />
        <div className="torn-edge" />
        <MusicSection />

        <footer className="border-t border-border">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-10 md:flex-row">
            <Link
              href="/"
              className="type-serif text-lg italic text-text transition-colors hover:text-accent"
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
