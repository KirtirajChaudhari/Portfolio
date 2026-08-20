/*
 * Poetry lives on Instagram (@introvert.balak), not in this repo.
 *
 * Placeholder poems were never Kirtiraj's writing — they shipped as filler
 * and were deleted rather than carried forward. The section links out to
 * the real account instead.
 *
 * `poemFragments` is the slot for that to change: drop ONE short, real
 * fragment in and the notebook's open page renders it automatically.
 * Leave it empty rather than inventing something to fill the space.
 */

export interface PoemFragment {
  id: string;
  /** A few real lines — kept short; the notebook is not a reader. */
  lines: string[];
  /** Where this piece is published. */
  href: string;
  /** Optional place/date, e.g. "Nashik, 2026". */
  note?: string;
}

export const poemFragments: PoemFragment[] = [];
