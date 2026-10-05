# PROJECT GUARDRAILS — X-Ray Hero

> Scope: this file governs this repo (directory still named `portfolio-vue`; it was
> migrated from Vue 3 to React on branch `react-tailwind`). The parent `../../CLAUDE.md`
> (premium-site config) still applies for anything not contradicted here. Where they
> disagree — this repo is React 19 + Vite + Tailwind v4 + hand-written CSS tokens,
> NOT Next.js — this file wins.

## Stack
- React 19, react-router-dom 7, Vite 8, TypeScript. Tailwind v4 via `@tailwindcss/vite`,
  **no preflight** (`styles/reset.css` owns the reset) and utilities are `important`, so
  a Tailwind class always beats the unlayered hand-written CSS. New code uses Tailwind;
  migrated sections keep their former scoped CSS as a sibling `Component.css`.
- Former Vue scoped styles are now global. BEM names are unique; when adding a generic
  class name (`card`, `counters`, `tape`) grep for collisions first.
- Motion: GSAP + Lenis (`hooks/useLenis.tsx`), `motion/react` for new UI, `@react-three/fiber`
  for the optional 3D overlay. Hooks live in `src/hooks/`.

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
  render as `chapter-two/FilmFrame.tsx`, never as a stand-in photo.

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
  All 8 acceptance tests pass. `CustomCursor` deleted (confirmed no orphaned CSS).
  BootSequence bypass is dev-only (`import.meta.env.DEV`). Measured: 60fps @1×, 60fps
  @4×, 57.2fps @2560×1440. Lens closes in 299ms. 0 idle writes. Deferred: Loop 3
  seam screenshots in `docs/shots/loop3/` — visual review by human before Loop 5.
- **Loop 4.1** — lens hint (mirrored static line, lens-mode only), inert art CTA restyled as
  plain text, feather stops 0.74/0.9, mobile nav pill collision fixed. `DESIGN.md` written.
- **Migration** — Vue 3 to React 19 + Tailwind v4 (31 SFCs ported, specs unchanged and green:
  registration 320–2560, lens 60fps, ink). Added the character hero (home `/`): canvas head-tracker driven by
  64 WebP frames from `scripts/extract_frames.py` (never seeks or plays the MP4).
- **Site redesign** — routes `/about`, `/work`, `/contact` are separate pages on a shared shell
  (`components/shell/`: SiteNav pill, lazy ShaderGradient backdrop, editorial-split `Section`).
  Profile 2 (`/creator`) is one chip in the nav. The lens hero lives at `/xray` (specs run there).
  Old single-page sections, ScrollIsland, boot curtain, Lenis and GSAP were removed; the Vue
  originals are in git history. Page copy is written plainly, facts only from `src/content/`.
- **2026-10-05, five-part update** — (1) `CharacterCanvas` rewritten: time-based smoothing (tau 80ms,
  dt <= 50ms), frame walking (<= 2 frames/tick at a 120 frames/s budget), centre-lock hysteresis
  (enter 0.12 / exit 0.14 of vw, +-0.35 frame), centre pose entered and left through the ring frame
  nearest to it (`manifest.nearestToCenter`), progressive failure-tolerant preload, synchronous redraw on
  resize, `hover: none` = static centre. Frames regenerated: the ring's old 60->61 seam is now a
  7-frame bridge through neutral. Gate: `scripts/character-smooth.spec.ts`. (2) Work page order is
  Projects, Internships, What I'm good at; `professionalExpertise` is the only source. (3) About uses
  vendored Lightswind `HangingIdCard` (`@/` alias), `LineReveal`/`WordReveal`. (4) Certifications and
  achievements replaced. (5) Stats strip and every Smart India Hackathon claim removed (SIH was false).
  Copyright registration year 2025 per the author.

## Learned constraints (2026-10-05)
- Tailwind v4 without preflight: `border-dashed` / `divide-dashed` set border-style on all four sides and
  the untouched sides render 3px dashed. `index.css` restores `border-width: 0` in `@layer base`; keep it.
- A full-screen shader on a software rasteriser (SwiftShader, llvmpipe) logs Chromium's "GPU stall due to
  ReadPixels" and burns a core. `GradientBackdrop` only uses WebGL when the renderer is not software.
  three / r3f / ShaderGradient were removed: THREE.Clock deprecation warnings and ~285 kB gzip.
- Windows setTimeout fake-vsync turns "60Hz" into ~32Hz. The smoothness spec pumps ticks from a
  MessageChannel against performance.now() instead.
- `document.fonts.status` reads 'loaded' until something requests a face; specs must call
  `document.fonts.load(...)` before measuring text.
- motion/react logs a dev-only "Reduced Motion enabled" warning; console-cleanliness runs use the
  production build (`BASE_URL=http://localhost:4173 npx playwright test ...`).
- A route named like a root-level file (`/portfolio` vs `portfolio.html`) is served that file by Vite dev.
- **2026-10-05, portfolio v2** — nav order About, Work, Contact. About = pinned dossier (sticky ID card with the new
  photo that sways with scroll velocity via `ref.nudge`, numbered chapters, typing-keyboard of the tools). Work =
  project index + detail pane, annotated internship timeline, research-bento expertise (`figures` added to
  `ExpertiseArea`). Contact = liquid-ocean hero (GPU only) + animated-footer (the two avatars as ASCII) + the
  mailto form. Profile 2 restyled; writings = `interactive-book` (cover = creative avatar; one real page until
  `poemFragments` has entries). Six registry installs, one commit each (tag `checkpoint-pre-v2`). `components.json`
  was hand-written so `shadcn add` never ran `init`; the CLI mis-resolved the first item's `@components` targets
  into a literal `@/` folder (moved into `src/`). The user's own edits kept: About without "How I work", the
  Profile-2 portal, and PhotoWall rebuilt on real Instagram embeds (so `art-gallery` is installed, adapted, unused).
  Currently = "Building RasaCare" (a project, not an employer); MIT-WPU is the current institution.

## Learned constraints (portfolio v2)
- shadcn registry items declare their own deps even when the project already has an equivalent: `animated-footer`
  pulled gsap + next-themes, `interactive-book`/`research-bento-grid` pulled framer-motion. Port to `motion/react`
  and uninstall; GSAP/Lenis stay out. `liquid-ocean` declares none but needs r3f + three.
- Pin `three` to 0.182: r183+ logs a THREE.Clock deprecation warning through r3f (breaks the clean-console gate).
- Installing `@react-three/fiber` augments JSX types and breaks `ElementType`-typed tags; use string-literal tag unions.
- Max one WebGL context per page: `PageShell shader={false}` on Contact (its own ocean). `hasHardwareWebGL()` gates every
  WebGL piece; the leak spec forces it on with `window.__FORCE_WEBGL__`.
- Spotify's embed fails axe (aria-required-children) and logs a PlayReady notice on Windows; both come from their
  iframe and are filtered in `scripts/portfolio-v2.spec.ts`.
- Lazy routes: a spec that scrolls to an id must wait for the element first.

