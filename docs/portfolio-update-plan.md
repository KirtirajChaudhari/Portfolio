# Portfolio update plan (5 tasks)

Written before editing source, per CLAUDE.md "Working style".

## Conflict check against CLAUDE.md
No conflicts. The non-negotiables are about the lens hero (`/xray`) and are not touched.
Relevant rules that carry over: content truth (facts from `src/content/` only), one rAF
loop per surface, transform/opacity-only motion, reduced-motion and `hover: none` get a
fully working static version, no new Lenis/GSAP.

Deliberate interpretations
- The "Kai Nomura" template was not attached. I implement the structure and motion numbers
  written in the prompt (eyebrow, 12-col split, line/word reveal timings, dashed ledger).
- Copyright registration year is **2025** (user answer), so the card gets `year: "2025"`
  plus status "Registered". No diary number, no day/month.

## Task 1: CharacterCanvas smoothing
Files: `src/components/character/CharacterCanvas.tsx`, `public/frames/manifest.json`
(adds `nearestToCenter`), new `scripts/character-smooth.spec.ts`, maybe `scripts/frame_seam.py`.
1. Measure first (spec records drawImage keys per tick, rAF outstanding, longtasks, Hz sim).
2. Time-based smoothing `alpha = 1 - exp(-dt/tau)`, dt clamped to 50ms.
3. Frame-walking with a time-based step budget (120 frames/s, <= 2 per tick).
4. Deadzone hysteresis (0.12 / 0.14 of vw) + 0.35-frame index hysteresis; centre pose entered and
   left through the ring frame nearest to the neutral pose, with a short dwell.
5. `pointerleave` goes through the same eased path.
6. Progressive, failure-tolerant preload; nearest-loaded-neighbour fallback.
7. Synchronous redraw in `layout()`.
8. `hover: none` behaves like reduced motion (static centre, ring frames never fetched).
Risk: frame-walking passes through unrelated head poses on big jumps; that is the intent.

## Task 2: Work page
`WorkPage.tsx`, `content/professional.ts` (`professionalExpertise` rewritten, 4 entries),
copy derived from `workJourney.length` / `projectCases.length`. Order: Projects, Internships,
What I'm good at. Grep every `#internships` / `#projects` / `/work#`.

## Task 3: About page + HangingIdCard
`vite.config.ts` + `tsconfig.app.json` `@/` alias. Component fetched from the Lightswind
registry into `src/components/lightswind/hanging-id-card.tsx` (no `init`, no `components.json`).
Lazy + IntersectionObserver-mounted, fixed-size placeholder, pause/cleanup, static fallback.
New `LineReveal` / `WordReveal` in `components/shell/`. Facts ledger, dashed dividers.
Photo grid skipped unless 3+ real photos exist in `public/`.

## Task 4: Certifications and achievements
`content/professional.ts` + `types`. Optional `status`, optional `year`. Four new
achievements, old four removed.

## Task 5: Stats strip and SIH claims
Delete the stats `<dl>`, `professionalAbout.stats`, dead exports. Strip every SIH / 5th place
claim; repo-wide grep gate.

## Verification
tsc + build, Playwright screenshots (360/768/1440) for `/`, `/work`, `/about`, axe, reduced-motion
and `hover: none` runs, loop-leak test over 10 navigation cycles, existing xray specs, CLAUDE.md
build log entry.
