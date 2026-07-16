"use client";

import Link from "next/link";
import { Reveal } from "./Reveal";
import { scrollToTarget } from "@/lib/scroll";

interface ChapterCTAProps {
  label: string;
  /** In-page anchor ("#id") or route ("/path"). */
  target: string;
  serif?: boolean;
}

/** Page-turn between chapters — scrolls to anchors, routes to pages. */
export function ChapterCTA({ label, target, serif = false }: ChapterCTAProps) {
  const isAnchor = target.startsWith("#");

  const btnClass = `group flex items-center gap-4 border-b border-border pb-3 text-xl transition-colors hover:border-accent md:text-3xl ${
    serif ? "type-serif italic text-text" : "type-heading uppercase tracking-wide text-text"
  }`;

  const content = (
    <>
      {label}
      <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-3">
        →
      </span>
    </>
  );

  return (
    <Reveal className="flex justify-center py-24 md:py-32">
      {isAnchor ? (
        <button
          type="button"
          onClick={() => scrollToTarget(target)}
          className={btnClass}
        >
          {content}
        </button>
      ) : (
        <Link 
          href={target} 
          className={btnClass}
        >
          {content}
        </Link>
      )}
    </Reveal>
  );
}
