"use client";

import { Reveal } from "../Reveal";
import { crayon, type CrayonHue } from "./Pinboard";

/**
 * Section entry for Chapter Two — bureaudimanche-scale ink type on the
 * paper, with the lead hue carried by a highlighter stroke behind a single
 * word. Replaces the full-bleed SectionBand, which DESIGN.md deprecates
 * along with the flat-colour-block mechanism it belonged to.
 */
export function SectionHeader({
  note,
  title,
  highlight,
  hue,
  handle,
  handleHref,
  align = "left",
}: {
  /** Short handwritten lead-in, e.g. "chasing light…". */
  note?: string;
  title: string;
  /** One word inside `title` to sit the highlighter stroke behind. */
  highlight?: string;
  hue: CrayonHue;
  handle?: string;
  handleHref?: string;
  align?: "left" | "right";
}) {
  const words = title.split(" ");

  return (
    <Reveal
      className={`mx-auto max-w-6xl px-6 ${align === "right" ? "text-right" : ""}`}
    >
      {note && (
        <span className="type-hand block text-2xl text-text-muted">{note}</span>
      )}

      <h3
        className="type-heading mt-1 text-[clamp(3rem,9vw,6rem)] leading-[0.95] text-text"
        style={{ textWrap: "balance" }}
      >
        {words.map((word, i) => {
          const isHighlighted = word === highlight;
          return (
            <span key={`${word}-${i}`}>
              {isHighlighted ? (
                <span
                  className="highlighter"
                  style={{ "--stroke-hue": crayon(hue) } as React.CSSProperties}
                >
                  {word}
                </span>
              ) : (
                word
              )}
              {i < words.length - 1 ? " " : ""}
            </span>
          );
        })}
      </h3>

      {/* Drawn underline — the second small job the lead hue does here. */}
      <svg
        aria-hidden
        viewBox="0 0 220 12"
        className={`mt-3 h-3 w-40 ${align === "right" ? "ml-auto" : ""}`}
        fill="none"
      >
        <path
          d="M2 8C38 3 74 2 110 4.5C146 7 182 9 218 5"
          stroke={crayon(hue)}
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>

      {handle && handleHref && (
        <a
          href={handleHref}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-block text-sm text-text underline decoration-text/30 underline-offset-4 transition-colors duration-[var(--dur-ui)] hover:decoration-text"
        >
          {handle} ↗
        </a>
      )}
    </Reveal>
  );
}
