"use client";

import { useRouter } from "next/navigation";
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
  const router = useRouter();

  const go = () => {
    if (target.startsWith("#")) scrollToTarget(target);
    else router.push(target);
  };

  return (
    <Reveal className="flex justify-center py-24 md:py-32">
      <button
        type="button"
        onClick={go}
        className={`group flex items-center gap-4 border-b border-border pb-3 text-xl transition-colors hover:border-accent md:text-3xl ${serif ? "type-serif italic text-text" : "type-heading uppercase tracking-wide text-text"
          }`}
      >
        {label}
        <span className="inline-block transition-transform duration-500 ease-out group-hover:translate-x-3">
          →
        </span>
      </button>
    </Reveal>
  );
}
