/*
 * Poetry lives on Instagram (@introvert.balak), not in this repo.
 *
 * Placeholder poems were never Kirtiraj's writing — they shipped as filler
 * and were deleted rather than carried forward. The section links out to
 * the real account instead.
 *
 * `poemFragments` is the slot for that to change: supplied real fragments
 * render as plain set text on /creator, with their publication links.
 * Leave it empty rather than inventing something to fill the space.
 */

export interface PoemFragment {
  id: string;
  /** Real lines, preserved as supplied and rendered with line breaks. */
  lines: string[];
  /** Where this piece is published. */
  href: string;
  /** Optional place/date, e.g. "Nashik, 2026". */
  note?: string;
}

export const poemFragments: PoemFragment[] = [];
