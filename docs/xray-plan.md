# X-Ray Hero — Plan (Loop 0, recon)

Repo: `portfolio-vue` · audited 2026-08-20 · **no application code written this loop**

---

## 1. Repo map (read, not guessed)

| Thing | Finding |
|---|---|
| Framework | Vue 3.5.40, `<script setup>` SFCs, TypeScript 6.0 (`vue-tsc -b` in build) |
| Bundler | Vite 8.2.0, `@vitejs/plugin-vue` 6 — single config, `templateCompilerOptions` from Tres |
| Styling | Hand-written CSS custom properties. **No Tailwind, no CSS-in-JS.** `src/styles/{reset,tokens,typography,components,animations}.css` |
| Routing | `vue-router` 4.6, three routes: `/` (HomePage), `/creator` (CreatorPage), `/projects/:slug` |
| Animation libs present | `gsap` 3.15 (**full Club build** in node_modules: SplitText, MorphSVG, DrawSVG, ScrollTrigger, ScrollSmoother, Observer, Flip, CustomEase, InertiaPlugin), `motion` 13.1, `@vueuse/motion` 3.0, `@vueuse/core` 14.4 |
| Scroll | `lenis` 1.3.26, initialised globally in `App.vue` via `composables/useLenis.ts`. `<html class="lenis">` |
| 3D | `three` 0.185 + `@tresjs/core` 5.8, lazily loaded by `components/three/HeroOverlay3D.vue` behind a `HEAD` probe for `/models/hero.glb` |
| Existing hero | `src/components/chapter-one/HeroSection.vue` (514 lines) — the only hero |
| Chapter Two | `src/views/CreatorPage.vue` + `src/components/chapter-two/*` |
| Deployment target | **None configured.** No `vercel.json`, `netlify.toml`, or CI workflow. `dist/` is a local build. |
| Version control | `git init` + `pre-xray snapshot` commit taken 2026-08-20, before any loop touched source. Commit after each loop clears its own acceptance criteria — that makes the loop gate `git diff`-able and revertable instead of a convention. |

## 2. Capability report — what is available WITHOUT adding a dependency

| Capability | Available? | Evidence |
|---|---|---|
| CSS `mask-image` | **Yes**, and already proven here — `HeroSection.vue:450-451` feathers the portrait with a `radial-gradient` mask incl. the `-webkit-` prefix. Static, never animated. |
| SVG `<mask>` + `feTurbulence` / `feDisplacementMap` | **Yes** — browser-native, no package needed. Nothing in `src/` uses SVG filters yet. |
| GSAP | **Yes**, 3.15 incl. paid plugins. `CustomEase` (ink easing) and `Observer` (unified pointer/touch) are directly relevant. Not needed for the lens itself — the playbook mandates one hand-rolled rAF. |
| Framer Motion | **No** — and not applicable (React). Vue equivalents `motion` 13 + `@vueuse/motion` 3 are installed instead. |
| WebGL / three | **Yes** — `three` + `@tresjs/core`, with an existing async-load pattern to copy if Loop 1 lands on path C. |
| Playwright / Puppeteer / Lighthouse CLI | **No** at Loop 0. `node_modules` contained none of them; there is no CI. Resolved — see below. |

**RESOLVED (decided after Loop 0, executes as Loop 1 step 1):** `npm i -D playwright @playwright/test`, and it **stays installed**. devDependencies are never bundled into the client by Vite, so it costs the shipped page nothing. The deciding argument is Loop 8, which re-runs the Loop 1 measurement for regression comparison: a one-off manual DevTools read that can't be reproduced is a worse outcome than a permanent devDependency.

The harness is a real spec file, `scripts/mask-perf.spec.ts`, not a scratch page — `page.tracing.start()` around a scripted pointer-move sequence, then paint-rect area read out of the trace. That is the automatable form of "composited vs repainted," and Loop 8 item 10 calls the same script rather than re-deriving it.

## 3. What is generic about the current hero — blunt

1. **Two competing CTAs**, which the parent config explicitly forbids: `<a>Learn more</a>` next to `SplitButton "Get in touch"`. The fix currently shipping is a hack — `.hero__cta.is-yielded { margin-left: -180px }` shoves one button offscreen so the row doesn't wrap.
2. **Left-type / right-portrait split with a radial glow behind the figure.** `.hero__gradient` is a `radial-gradient(ellipse 70% 55% ...)` in the accent colour. That is the gradient blob, unmodified.
3. **The headline is too small to carry a viewport.** `.display-hero` is `clamp(2rem, 4.6vw, 3.5rem)` — 56px ceiling on desktop, 32px on mobile. The guardrail floor is 72–96px desktop / 40–48px mobile. At `max-height: 880px` it steps down again to 40px.
4. **Nine sequenced entrance beats over 2.5s** before the hero is at rest (pattern → figure → eyebrow → name → tagline → buttons → socials → rail → hint), each with its own ease and stagger. This is "animations on every element."
5. **And it queues behind a boot curtain.** `BootSequence.vue` + `await bootDone` means the 2.5s ladder starts *after* a full-screen gate. Nothing is readable early.
6. **The entrance animates `filter: blur(14px)` on a 520px figure and `blur(12px)` on the tagline** — the exact property the new guardrails forbid per-frame, already in the file that Loop 2 will rewrite.
7. **The copy is portfolio-template diction.** `professionalHero.tagline` = "Building Intelligent Solutions for Healthcare, Society & the Future" — three abstract nouns and a future tense, could sit on anyone's site. `novelHero.subtitle` in `novel.ts` already says the same thing concretely ("clinical nutrition, disease screening, railway safety… models that explain their reasoning to the people who have to trust them"). The good copy exists; the hero isn't using it.
8. **Topographic contour wallpaper.** `.hero__pattern` is a generated SVG of nested ellipses at 5.5% opacity — decoration with no relationship to an ML engineer who works on explainability.
9. **The dual-persona premise is currently a route change.** `/` vs `/creator`, mediated by a 116px pill switch (`ChapterSwitch.vue`). The two identities never share a frame, so nothing is ever *revealed* — only navigated to. That is the actual thing this project is here to fix.
10. **A global custom cursor already exists** — `CustomCursor.vue`, ring + dot, `mix-blend-mode: difference`, magnetic pull at 100px, `cursor: none !important` on `html *`. Loop 3's lens ring will collide with it. It listens on `mousemove` (not `pointermove`) and re-queries `document.querySelectorAll('.btn, button, [data-cursor-magnet]')` **on every mouse move** — that alone will eat the 4× throttled frame budget.

---

## 4. PALETTE

### Rejections, honestly

The playbook rejects "cream `#F4F1EA` + serif + terracotta." **That palette is already shipping in this repo** — `tokens.css` `[data-chapter="two"]`: `--bg: #f2f0eb`, `--font-body: 'Spectral', Georgia, serif`, `--accent: #b4622f`. It was my first instinct because it is already written. Rejected and picked again below. The other two rejects (near-black + acid green; newspaper hairline broadsheet) were never in play.

### PROFESSIONAL layer — "Clean Room"
A fab clean room. Cold, bright, over-lit, nowhere to hide a defect — and it pairs structurally with Safelight: both are rooms *defined by what they exclude*, one excludes particles, the other excludes light. Renamed from "Reading Room," which was a library word doing half the work of its partner: it said "studious person" rather than "the person who shipped RasaCare." The palette also finally agrees with the rest of Chapter One, which is a white/parchment page the current dark hero sits on like an island.

| Name | Hex | Role |
|---|---|---|
| `filtered-white` | `#F2F4F6` | Ground. Cool off-white, never `#FFFFFF`. |
| `panel` | `#FCFDFE` | Raised surface — cards, the status rail. |
| `graphite` | `#14161A` | Display type and body ink. |
| `graphite-mute` | `#5A6068` | Labels, captions, the tiny factual tags. |
| `signal` | `#0B63E5` | The ONE accent. Links, focus rings, and the cold end of the saliency ramp. |
| `hairline` | `rgba(20,22,26,0.10)` | The only border weight. |

### ARTISTIC layer — "Safelight"
A darkroom at 2am — the one room where his photography, the hours he actually writes in, and the idea of an image developing all sit together. Warm-dark, one saturated red, no second accent.

| Name | Hex | Role |
|---|---|---|
| `safelight-ground` | `#140A0C` | Ground. Warm near-black. |
| `emulsion` | `#201316` | Second surface step — the marked-up annotation blocks. |
| `print-warm` | `#F0E4D9` | Type. The print coming up in the tray. |
| `print-mute` | `#B39C90` | Secondary type. |
| `safelight` | `#E4465A` | The ONE accent. Annotation strokes, the hot end of the saliency ramp. |
| `grain` | `rgba(240,228,217,0.035)` | Tiled noise, one generated source (Loop 5). |

### Measured contrast — computed, not eyeballed

| Pair | Ratio | AA normal (4.5) | AA large (3.0) |
|---|---|---|---|
| `graphite` `#14161A` on `filtered-white` | 16.43 | PASS | PASS |
| `graphite-mute` `#5A6068` on `filtered-white` | 6.03 | PASS | PASS |
| `signal` `#0B63E5` on `filtered-white` | 4.85 | PASS | PASS |
| `print-warm` `#F0E4D9` on `safelight-ground` | 15.58 | PASS | PASS |
| `print-mute` `#B39C90` on `safelight-ground` | 7.19 | PASS | PASS |
| `safelight` `#E4465A` on `safelight-ground` | **4.94** | PASS | PASS |

`safelight` was `#E0384A`, which measures **4.48** — it misses body-text AA by 0.02. That would have survived Loop 5's contrast sample (display sizes only need 3.0) and then failed the first time the red carried a link or a caption. `#E4465A` clears it at 4.94 with a shift you cannot see side by side. Fixed here rather than in components.

`signal` **stays `#0B63E5`.** It does sit near the trustworthy-SaaS-blue cluster (LinkedIn `#0A66C2` and neighbours), and the suggested nudge to `#0A5FFF` is a real distinctiveness gain — but it measures **4.69** against 4.85, spending contrast margin on the exact axis that just bit us with the red. The saliency-ramp logic is what earns the blue back, and that logic only becomes *visible* in Loop 5 when the ramp ships. Revisit there, with the ramp on screen, or not at all.

### Seam contrast strategy
The two palettes are **luminance-inverted** (L\* ≈ 96 vs L\* ≈ 6), which is what decides which layer is dark: the artistic layer is on top and masked, so its 40%-alpha feather band always *darkens* the professional layer beneath it and never lightens it. That band composites to ≈`#999698`, and `graphite` on it measures **6.19:1** — professional text only ever *gains* contrast as the lens approaches. The failure mode the playbook's Loop 3 self-verify warns about is designed out rather than patched later.

The converse — `print-warm` at 40% over `film-white` — *is* illegible, so the rule for Loop 2 is: **no artistic type may live permanently in the feather band.** Artistic type sits inside the 62% solid core or it isn't type, it's texture. The lens's REST_RADIUS is sized from that: the solid core must be wide enough to hold one annotation line at body size.

The `signal`↔`safelight` pair is deliberately the two ends of one saliency ramp (cold → hot), not two brand colours. Each layer still has exactly one accent.

## 5. TYPE

| Role | Face | Where |
|---|---|---|
| Display — **both layers** | **Inter Tight**, weight 600 only | The H1 in both layers. Shared on purpose: registration demands an identical box, and a condensed face against a normal one cannot hold the same right edge across 320→2560px. One face, one weight; the layers separate by colour, case and texture instead. |
| Body — **shared** | **Inter**, 400 (+600 for strong) | Both layers, 17px. This is the face that makes it read as one person. Already loaded. |
| Artistic secondary display | **Antonio**, 700 uppercase | Kickers, the marquee, section titles in the artistic layer only — **never the H1**. Already loaded, already the Creator voice. |
| Utility / mono | `ui-monospace` system stack | Tiny factual labels (place · year · stack · language). Zero bytes. Already the `--font-mono` token. |
| Hand | **Caveat** 500 | Existing Chapter Two device; the Grad-CAM annotation note (see SIGNATURE). Already loaded. |

Cost: **one new family (Inter Tight, one weight)**, replacing the `-0.015em` tracking hack currently faking optical tightening on Inter at display sizes. `Spectral` can be dropped from the import in exchange if the Chapter Two serif goes with the rejected palette — decide in Loop 5, not now.

**Devanagari:** do **not** load a Devanagari face speculatively. `novel.ts` ships `poemFragments: []` and the repo rule is that placeholder poetry never gets invented. When a real Marathi fragment arrives, add `Noto Sans Devanagari` with its own `line-height` step (≈1.9 vs Latin's 1.55 at the same size) and a correct fallback chain — and not before.

## 6. GRID

Both layers snap to one grid, declared once on `.hero` and consumed by both:

- **Space base: 8px**, 4px half-step. Keeps the existing `--sp-*` ladder usable (its `17px` outlier is Apple's body size, not a spacing step — leave it).
- **Baseline: 28px.** Body 17px / 28px = 1.647 line-height, inside the 1.55–1.65 target. Display 96px / 112px (4×28). Section rhythm 112px desktop (4×28), 56px mobile (2×28) — within 40% of the existing `--sp-section: 80px`, so the page below the hero does not have to be re-spaced in Loop 7.
- **Registration contract:** `--hero-fs`, `--hero-lh`, `--hero-track`, `--hero-x`, `--hero-y` are declared once on `.hero` and consumed by **both** `.hero__layer--pro` and `.hero__layer--art`. A value hardcoded in one layer only is a Loop 2 blocker, not a nit.
- Container: keep `--maxw-grid: 1360px`; the hero's type column is `--maxw-prose` capped at 14ch for the H1, as today.

## 7. SIGNATURE

> **The page is remembered for the annotation, not the aperture: wherever the lens lands, the engineering claim under it is marked up like a Grad-CAM — one highlighted region and one handwritten line of the human reason behind it — so the reveal reads as evidence, not as a wallpaper swap.**

The lens is the mechanism and is deliberately *not* the signature. The signature is that the mechanism is Kirtiraj's own stated thesis turned on himself: `professionalMission` in `professional.ts` says he builds "models a doctor, a reviewer, or an operator can interrogate before they act on it… every prediction traceable to its evidence." An explainability overlay, run on the author. That is why the accent pair is a saliency ramp and why the artistic layer's job is annotation rather than decoration.

---

## 8. Decisions this forces on later loops (flag now, don't discover later)

- **Loop 1 decision gate is still open** — path A/B/C needs measured numbers. The measurement *route* is now settled (§2): Playwright spec, kept, re-run by Loop 8.
- **Loop 2 content:** the artistic layer's copy must come from `novel.ts` (`creatorIntro`, `chapterTwoMeta.epigraph`) or be written fresh *about real things Kirtiraj does* (tabla, camera, notebooks). No invented poem lines — that is a standing repo rule, and it caps what Loop 5's payload can contain until he supplies a fragment.
- **Non-negotiable #3 is already satisfiable for free:** `/creator` is a complete, non-masked, accessible route containing everything the artistic layer will show. The lens stays theatre; the toggle can simply be a real link to it.

### Pending spec change — saliency ramp *in* the mask edge

Loop 3's mask spec is a 3-stop pure-alpha gradient (solid → 62%, 40% alpha → 82%, transparent → 100%). Amend it so the intermediate stops step **through the ramp colours** (`signal` → `safelight`) rather than through alpha alone: the reveal then literally renders as a saliency overlay instead of a spotlight that happens to sit near one. Constraints: it stays a mask/gradient the rAF loop feeds via custom properties — no new per-frame property — and it **counts as one of Loop 5's three devices**, so the artistic layer gets grain + one hand mark + this, and the glitch type is cut, or this is cut. Decide at Loop 5, budget it now.

### Addenda to paste with their loops

**Loop 3 addendum.** `CustomCursor.vue` currently runs `querySelectorAll` on every `mousemove`. It is being **replaced** by `hero__lens-ui` this loop, not run alongside it. First step of the loop: delete its `mousemove` listener and the global `cursor: none` styling it applies, then `grep` to verify no other component still expects it (`data-cursor-label`, `data-cursor-magnet`, `data-cursor-hover` are all live attributes elsewhere in `src/` — check each). Two independent per-frame cursor systems blow the 4× budget before the mask logic runs.

**Loop 6 addendum.** Scroll is owned by Lenis, not the browser. `touch-action` changes and `touchstart`/`touchend` handlers for the tap-splash must be verified against Lenis's own touch interception, not native scroll. Test that Lenis's `isScrolling` state does not fight the hold-to-reveal timer, and that a scroll-intent drag — finger moves >10px before lifting — **cancels** the splash and passes through to Lenis rather than triggering an accidental flood.

---

## Self-verify

- **Did I read the actual files, or infer from folder names?** Read. `package.json`, `node_modules/gsap/*`, `vite.config.ts`, `index.html`, `App.vue`, `router/index.ts`, `HeroSection.vue` (all 514 lines), `HomePage.vue`, `CreatorPage.vue`, `ChapterSwitch.vue`, `CustomCursor.vue`, `tokens.css`, `typography.css`, `content/{shared,professional,novel}.ts`. Capability claims cite line numbers or `node_modules` listings.
- **Would a stranger guess the subject is an engineer who writes poetry in three languages — or could this palette belong to any portfolio?** Half credit, and I'd rather say so than claim otherwise. *Safelight* is specific — it comes from his photography and the hours he writes in, and no generic portfolio picks a darkroom red. *Clean Room* (renamed from the weaker "Reading Room") now works as hard as its partner: a real fab term, the same physical-room structure, and the two are opposites of one idea — exclude the particles, exclude the light. The colours alone are still the softer half; cold-white + one blue is a common engineer default. What carries the identity is the pairing being a **saliency ramp** rather than two brand colours, and that only becomes visible once Loop 5 ships the annotation. The multilingualism is **not** in the palette and cannot be faked into it — it arrives as type or not at all, and per repo rule it waits for real text.
- **Is my SIGNATURE the lens itself?** No — stated explicitly in §7. The lens is the mechanism; the signature is the Grad-CAM annotation it uncovers, which is the author's own professional thesis applied to himself.

**STOP.** Plan written. No implementation until Loop 1 is pasted.
