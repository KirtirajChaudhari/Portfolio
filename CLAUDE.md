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
- After each loop, take screenshots and critique your own output before reporting
  completion. No screenshot tooling is installed — see `docs/xray-plan.md` §2.
- If an acceptance criterion cannot be met, STOP and report the blocker. Do not
  silently substitute an easier implementation.
