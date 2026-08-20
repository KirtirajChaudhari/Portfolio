# PROJECT GUARDRAILS — X-Ray Hero

> Scope: this file governs `portfolio-vue`. The parent `../../CLAUDE.md` (premium-site
> config) still applies for anything not contradicted here. Where they disagree — this
> repo is Vue 3 + Vite + hand-written CSS tokens, NOT Next.js + Tailwind — this file wins.

## Non-negotiables
1. Never animate `filter`, `backdrop-filter`, `box-shadow`, `width/height`, `top/left`,
   or `background-position` on a per-frame basis. Per frame, only these may change:
   `transform`, `opacity`, and CSS custom properties that feed a mask.
2. One `requestAnimationFrame` loop for the entire hero. Pointer events write to a
   plain object; the rAF loop is the only code that touches the DOM.
3. No portfolio content may be reachable ONLY through the lens. Every link, heading,
   and case study behind the mask must also exist in accessible DOM or be duplicated
   in a non-masked route. The lens is theatre, not navigation.
4. `prefers-reduced-motion: reduce` and `hover: none` must each land on a fully
   functional, non-lens version of the page. Build these as first-class states.
5. No orientation lock. No "please rotate your device" gate. No "tap to unlock scroll."
6. No third-party asset, image, SVG, font file, or line of copy may be lifted from any
   reference site. Reference sites inform STRUCTURE and CADENCE only.

## Content truth (repo-specific, overrides any invented copy)
- Chapter Two / Creator content comes from `src/content/novel.ts`. `src/content/artistic.ts`
  is an older draft and its `poemContent` is AI filler — never render it.
- Never invent poetry, lyrics, captions, or photo credits to fill an artistic layout.
  Empty stays empty until Kirtiraj supplies the real thing.
- `poemFragments` is `[]` and `photographyWall[].src` is `''` by design. Placeholders
  render as `chapter-two/FilmFrame.vue`, never as a stand-in photo.

## Performance budget (hard gates)
- 60fps sustained during lens movement with Chrome DevTools CPU throttle 4x.
- No long task > 50ms during the ink-spill expansion.
- Lighthouse mobile Performance >= 90, CLS = 0, LCP < 2.0s.
- Artistic-layer assets must not participate in LCP.

## Working style
- Plan in a scratch file before editing source. Show me the plan, then implement.
- After each loop, take screenshots (Playwright) and critique your own output before
  reporting completion.
- If an acceptance criterion cannot be met, STOP and report the blocker. Do not
  silently substitute an easier implementation.

## Learned constraints (append as discovered — do not delete once added)
- A grid slot with auto-sized content (a tags row, a badge, a pill) sitting inside a
  centered stack (`align-content: center` / `justify-content: center`) redistributes
  its own height delta onto every sibling slot, including ones above it. Any claim of
  "identical registration" that includes an auto-height row needs a fixed height or
  padding-based alignment, not centering. This WILL recur in Loop 7's paired panels
  and grid tiles — check it there before it becomes a repeat bug.
- `scrollHeight` on a stretched grid/flex item measures the BOX, not the text. To
  measure real text extent, use a `Range` over the element's contents. A fixed slot
  fails in two directions: assert overflow AND under-fill.
- Masks repaint their layer every frame in every engine (Loop 1: 56 paint events
  unmasked vs ~900 masked). The masked layer's paint cost is therefore a hard budget:
  no full-bleed raster imagery, no `background-blend-mode`, no live filters.
- `Emulation.setCPUThrottlingRate` barely moves this workload (~4% at 4x) because it
  is raster-bound, not JS-bound. Stress it with viewport area instead.
- A lerp snap threshold too tight relative to the value range keeps the rAF loop
  spinning on imperceptible deltas. The radius snap at 0.5px on a 0–280px range
  produced ~10 extra frames of writes on an invisible circle, preventing the loop
  from going idle. Raised to 2px (the feather's solid core at r=2 is 1.24px —
  invisible). Also snap position when radius reaches 0 — no point lerping an
  invisible center point.

## Build log

- **Loop 0** — `docs/xray-plan.md` written. Palette: Clean Room / Safelight.
  Signature: Grad-CAM annotation, not the aperture.
- **Loop 1** — Path B (SVG `<mask>`). Paint budget established. `playwright` 1.62.1
  installed as permanent devDependency. Harness: `scripts/mask-perf.spec.ts`.
- **Loop 2** — `71a0a22`. Registration template-guaranteed. Two bugs fixed (auto-height
  row, scrollHeight measurement). CLS 0.0031 deferred to Loop 5.
- **Loop 3** — `946b99d`. Lens functional: rAF loop, POS_LERP=0.18 / RAD_LERP=0.12,
  dirty check with EPS=0.05px, half-pixel quantisation, `pointerrawupdate` preferred.
  One bug found and fixed at close-out: radius snap threshold 0.5px too tight, loop
  never went idle (delta=9–12 writes). Raised to 2px + position snap on close.
  All 8 acceptance tests pass. `CustomCursor.vue` deleted (confirmed no orphaned CSS).
  BootSequence bypass is dev-only (`import.meta.env.DEV`). Measured: 60fps @1×, 60fps
  @4×, 57.2fps @2560×1440. Lens closes in 299ms. 0 idle writes. Deferred: Loop 3
  seam screenshots in `docs/shots/loop3/` — visual review by human before Loop 5.
