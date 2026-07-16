"use client";

import { Reveal } from "../Reveal";
import { PolaroidGrid } from "./PolaroidGrid";
import { poetryWall, poetryMeta } from "@/content/novel";

/*
 * Poems as diary pages (spec v2 §8): aged wrinkled paper, deckled edges,
 * coffee-ring/ink-blot details, handwritten face for the lines.
 */
export function PoetryWall() {
  return (
    <section aria-label="Poetry and writing" className="mx-auto max-w-6xl px-6 py-24 md:py-32">
      <Reveal className="mb-16 text-right md:mb-20">
        <span className="type-hand text-2xl text-accent">between the lines…</span>
        <h3 className="type-serif mt-2 text-4xl font-light italic text-text md:text-6xl">Poetry</h3>
        <a
          href={poetryMeta.profileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-text-muted transition-colors hover:text-accent"
        >
          {poetryMeta.handle} ↗
        </a>
      </Reveal>

      <PolaroidGrid className="grid grid-cols-1 gap-12 md:grid-cols-3">
        {poetryWall.map((poem, i) => (
          <a
            key={poem.id}
            data-polaroid
            href={poem.href}
            target="_blank"
            rel="noopener noreferrer"
            className={`diary-page block px-7 py-9 ${i === 1 ? "md:mt-16" : ""}`}
            style={{ "--tilt": `${poem.rotate}deg` } as React.CSSProperties}
          >
            <span
              className="tape -top-2 left-1/2 -translate-x-1/2"
              style={{ transform: `translateX(-50%) rotate(${poem.rotate * -1.5}deg)` }}
            />
            <span
              className="coffee-ring"
              style={{ top: `${12 + i * 22}%`, right: `${6 + i * 4}%` }}
            />
            <span className="ink-blot" style={{ bottom: "14%", left: `${10 + i * 8}%` }} />

            <span className="type-hand block text-xl text-accent">“{poem.title}”</span>
            <div className="type-hand mt-5 text-[1.35rem] leading-relaxed text-[#3a2d1e]">
              {poem.lines.map((line, j) => (
                <p key={j}>{line}</p>
              ))}
            </div>
            <span className="type-hand mt-6 block text-right text-base text-[#71634f]">
              — from the notebook
            </span>
          </a>
        ))}
      </PolaroidGrid>
    </section>
  );
}
