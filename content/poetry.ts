/*
 * Poetry lives on Instagram (@introvert.balak), not in this repo.
 *
 * The three "Placeholder One/Two/Three" test poems that used to sit here
 * were never Kirtiraj's writing — they shipped as filler, and are gone.
 * The section links out to the real account instead.
 *
 * `poemFragments` is the slot for that to change: drop ONE short, real
 * fragment in and PoetryWall renders it on the open page automatically.
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
